'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

import Model from './Hero3D/Model'
import { SignalProcessor } from './SignalProcessor'
import { TernaryEffect, TernaryPass } from './TernaryPass'
import TransitionController from './TransitionController'
import { useTransitionStore } from '@/store/useTransitionStore'

function RotatingCamera() {
  const phase = useTransitionStore((state) => state.phase)

  useFrame((state) => {
    // Only rotate if we are not in a hard transition
    if (phase === 'idle') {
      const angle = state.clock.elapsedTime * 0.2
      const radius = 4
      state.camera.position.x = Math.sin(angle) * radius
      state.camera.position.z = Math.cos(angle) * radius
      state.camera.position.y = 0.5
      state.camera.lookAt(0, 0, 0)
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

    // 🔥 KEY LIGHT (main sculpting light)
    keyLight.current.position.set(
      Math.cos(back - 0.5) * 6,
      3 + Math.sin(t * 0.3) * 0.8,
      Math.sin(back - 0.5) * 6
    )
    keyLight.current.target = target.current

    // 🔥 RIM LIGHT (tight edge highlight)
    rimLight.current.position.set(
      Math.cos(back + 0.5) * 5,
      1.5,
      Math.sin(back + 0.5) * 5
    )

    // 🔥 FILL LIGHT (very subtle, just to avoid full black)
    fillLight.current.position.set(
      Math.cos(back) * 3,
      -1.5,
      Math.sin(back) * 3
    )

    // 🔥 subtle flicker for life
    keyLight.current.intensity = 1.8 + Math.sin(t * 6) * 0.05
  })

  return (
    <>
      {/* 🌫️ VERY low ambient (keep contrast) */}
      <ambientLight intensity={0.08} />

      {/* 🔥 KEY (white → defines form) */}
      <directionalLight
        ref={keyLight}
        intensity={1.8}
        color="#ffffff"
        castShadow
      />

      <object3D ref={target} position={[0, 0, 0]} />

      {/* 🔥 RIM (cyan → scan synergy) */}
      <directionalLight
        ref={rimLight}
        intensity={2.2}
        color="#00ffff"
      />

      {/* 💡 FILL (low + colored) */}
      <pointLight
        ref={fillLight}
        intensity={0.4}
        color="#ff2a5f"
      />
    </>
  )
}

function CenteredModel() {
  const modelRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })

  return (
    <group ref={modelRef} position={[0, -1, 0]} scale={2}>
      <Model />
    </group>
  )
}

export default function CanvasRoot() {
  const ternaryRef = useRef<TernaryEffect>(null)

  return (
    <>
      {/* Scene */}
      <color attach="background" args={['#050810']} />
      <fog attach="fog" args={['#050810', 5, 15]} />

      <TransitionController effectRef={ternaryRef} />
      <CinematicLighting />
      <CenteredModel />
      <RotatingCamera />

      {/* 🔥 Pipeline */}
      <EffectComposer multisampling={0}>
        <SignalProcessor />
        <TernaryPass ref={ternaryRef} threshold={0.25} debug={0} />
      </EffectComposer>
    </>
  )
}
