'use client'

import { useRef, useLayoutEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

import { Model } from './assets/Model'
import { SignalProcessor } from './effects/SignalProcessor'
import { TernaryPass, TernaryEffect } from './effects/TernaryPass'
import {
  ScrollController,
  START_CAMERA_POSITION,
  START_LOOK_AT,
} from './controllers/Scroll'
import { TransitionController } from './controllers/Transition'
import { useTransitionStore } from '@/store/useTransitionStore'

function RotatingCamera() {
  const phase = useTransitionStore((state) => state.phase)

  useFrame((state, delta) => {
    const isScrolling =
      typeof window !== 'undefined' && window.scrollY > 5

    const scrollBlend =
      typeof window === 'undefined'
        ? 0
        : THREE.MathUtils.clamp(window.scrollY / 96, 0, 1)

    const angle = state.clock.elapsedTime * 0.2
    const radius = 4
    const orbitX = Math.sin(angle) * radius
    const orbitZ = Math.cos(angle) * radius
    const blendTargetX = THREE.MathUtils.lerp(orbitX, START_CAMERA_POSITION.x, scrollBlend)
    const blendTargetY = THREE.MathUtils.lerp(0, START_CAMERA_POSITION.y, scrollBlend)
    const blendTargetZ = THREE.MathUtils.lerp(orbitZ, START_CAMERA_POSITION.z, scrollBlend)

    if (phase === 'idle') {
      const damping = isScrolling ? 14 : 6

      state.camera.position.x = THREE.MathUtils.damp(
        state.camera.position.x,
        blendTargetX,
        damping,
        delta
      )
      state.camera.position.y = THREE.MathUtils.damp(
        state.camera.position.y,
        blendTargetY,
        damping,
        delta
      )
      state.camera.position.z = THREE.MathUtils.damp(
        state.camera.position.z,
        blendTargetZ,
        damping,
        delta
      )

      state.camera.lookAt(START_LOOK_AT)
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

      <directionalLight
        ref={keyLight}
        intensity={1.85}
        color="#ffffff"
        castShadow
      />

      <object3D ref={target} position={[0, 0, 0]} />

      <directionalLight
        ref={rimLight}
        intensity={2.2}
        color="#00ffff"
      />

      <pointLight
        ref={fillLight}
        intensity={0.6}
        color="#ff2a5f"
      />
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

      <ScrollController modelRef={modelRef} />
      <TransitionController effectRef={ternaryRef} />

      <CinematicLighting />
      <CenteredModel modelRef={modelRef} />
      <RotatingCamera />

      <EffectComposer multisampling={0}>
        <SignalProcessor />
        <TernaryPass ref={ternaryRef} threshold={0.25} debug={0} />
      </EffectComposer>
    </>
  )
}
