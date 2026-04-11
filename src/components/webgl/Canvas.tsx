'use client'

import { useRef, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Stats } from '@react-three/drei'
import * as THREE from 'three'
import { EffectComposer } from '@react-three/postprocessing'

import { Model } from './assets/Model'
import { ScrollController } from './controllers/Scroll'
import { TransitionController } from './controllers/Transition'
import { RetroTerminalEffect } from './effects/RetroTerminal'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'
import {
  getMappedCameraPosition,
  getMappedLookAt,
} from '@/lib/animation-mapper'

function SceneOrchestrator() {
  const { camera } = useThree()

  const tempVec = useMemo(() => new THREE.Vector3(), [])
  const tempLookAt = useMemo(() => new THREE.Vector3(), [])

  useFrame(() => {
    // 🔥 Optimization: Direct state access from store to avoid React re-renders
    const { scrollProgress } = useOrchestratorStore.getState()

    // 1. Deterministic Camera Mapping
    getMappedCameraPosition(scrollProgress, tempVec)
    getMappedLookAt(scrollProgress, tempLookAt)

    // 2. Apply to Scene
    camera.position.copy(tempVec)
    camera.lookAt(tempLookAt)
  })

  return null
}

function CinematicLighting() {
  const keyLight = useRef<THREE.DirectionalLight>(null)
  const rimLight = useRef<THREE.DirectionalLight>(null)
  const fillLight = useRef<THREE.PointLight>(null)
  const target = useRef<THREE.Object3D>(null)

  const prevPos = useRef(new THREE.Vector3())
  const EPSILON = 0.01

  useFrame((state) => {
    if (!keyLight.current || !rimLight.current || !fillLight.current || !target.current) return

    const cx = state.camera.position.x
    const cz = state.camera.position.z

    // Only update if camera moved significantly or clock progressed
    const moved = Math.abs(prevPos.current.x - cx) > EPSILON || Math.abs(prevPos.current.z - cz) > EPSILON
    const t = state.clock.elapsedTime

    if (moved || (t % 0.1 < 0.02)) { // Throttled updates for time-based flickering
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
      prevPos.current.set(cx, 0, cz)
    }
  })

  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight ref={keyLight} intensity={1.85} color="#ffffff" castShadow />
      <object3D ref={target} position={[0, 0, 0]} />
      <directionalLight ref={rimLight} intensity={1.6} color="#00ffff" />
      <pointLight ref={fillLight} intensity={0.6} color="#ff2a5f" />
    </>
  )
}

export default function Canvas() {
  return (
    <>
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 5, 50]} />

      <ScrollController />
      <TransitionController />

      <SceneOrchestrator />
      <CinematicLighting />
      <Model />

      <EffectComposer enableNormalPass multisampling={0}>
        <RetroTerminalEffect />
      </EffectComposer >

      <Stats className="top-auto! bottom-4! left-4!" />
    </>
  )
}
