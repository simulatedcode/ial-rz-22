'use client'

import { useRef, useLayoutEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

import { Model } from './assets/Model'
import { SignalProcessor } from './effects/SignalProcessor'
import { TernaryPass, TernaryEffect } from './effects/TernaryPass'
import { CinematicStack } from './effects/CinematicStack'
import { ScrollController } from './controllers/Scroll'
import { TransitionController } from './controllers/Transition'
import { useTransitionStore } from '@/store/useTransitionStore'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'
import {
  getMappedCameraPosition,
  getMappedLookAt,
  getTransitionUniforms,
} from '@/lib/animation-mapper'

function SceneOrchestrator({ ternaryRef }: { ternaryRef: React.RefObject<TernaryEffect | null> }) {
  const scrollProgress = useOrchestratorStore((state) => state.scrollProgress)
  const transitionProgress = useOrchestratorStore((state) => state.transitionProgress)
  const phase = useTransitionStore((state) => state.phase)
  const { camera } = useThree()

  const tempVec = useMemo(() => new THREE.Vector3(), [])
  const tempLookAt = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    // 1. Deterministic Camera Mapping
    getMappedCameraPosition(scrollProgress, tempVec)
    getMappedLookAt(scrollProgress, tempLookAt)

    // 2. Apply to Scene
    camera.position.copy(tempVec)
    camera.lookAt(tempLookAt)

    // 4. Update Post-processing Effects
    if (ternaryRef.current) {
      const threshold = getTransitionUniforms(transitionProgress, phase)
      const uThreshold = ternaryRef.current.uniforms.get('uThreshold')
      if (uThreshold) uThreshold.value = threshold
    }
  })

  return null
}

function CinematicLighting() {
  const keyLight = useRef<THREE.DirectionalLight>(null)
  const rimLight = useRef<THREE.DirectionalLight>(null)
  const fillLight = useRef<THREE.PointLight>(null)
  const target = useRef<THREE.Object3D>(null)

  useFrame((state) => {
    if (!keyLight.current || !rimLight.current || !fillLight.current || !target.current) return

    const t = state.clock.elapsedTime
    const cx = state.camera.position.x
    const cz = state.camera.position.z
    const angle = Math.atan2(cz, cx)
    const back = angle + Math.PI

    keyLight.current.position.set(
      Math.cos(back - 0.5) * 6,
      3 + Math.sin(t * 0.3) * 0.8,
      Math.sin(back - 0.5) * 6
    )
    keyLight.current.target = target.current

    rimLight.current.position.set(
      Math.cos(back + 0.5) * 5,
      1.5,
      Math.sin(back + 0.5) * 5
    )

    fillLight.current.position.set(
      Math.cos(back) * 3,
      -1.5,
      Math.sin(back) * 3
    )

    keyLight.current.intensity = 1.8 + Math.sin(t * 16) * 0.05
  })

  return (
    <>
      <ambientLight intensity={0.12} />
      <directionalLight ref={keyLight} intensity={1.85} color="#ffffff" castShadow />
      <object3D ref={target} position={[0, 0, 0]} />
      <directionalLight ref={rimLight} intensity={2.2} color="#00ffff" />
      <pointLight ref={fillLight} intensity={0.6} color="#ff2a5f" />
    </>
  )
}

function CenteredModel({ modelRef }: { modelRef: React.RefObject<THREE.Group | null> }) {
  useLayoutEffect(() => {
    if (!modelRef.current) return
    const box = new THREE.Box3().setFromObject(modelRef.current)
    const center = box.getCenter(new THREE.Vector3())
    modelRef.current.position.sub(center)
  }, [modelRef])

  return (
    <group ref={modelRef} scale={2}>
      <Model />
    </group>
  )
}

export default function Canvas() {
  const ternaryRef = useRef<TernaryEffect>(null)
  const modelRef = useRef<THREE.Group>(null)

  return (
    <>
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 5, 15]} />

      <ScrollController />
      <TransitionController />

      <SceneOrchestrator ternaryRef={ternaryRef} />
      <CinematicLighting />
      <CenteredModel modelRef={modelRef} />

      <EffectComposer multisampling={0}>
        <SignalProcessor />
        <TernaryPass ref={ternaryRef} threshold={0.25} debug={0} />
        <CinematicStack />
      </EffectComposer>
    </>
  )
}
