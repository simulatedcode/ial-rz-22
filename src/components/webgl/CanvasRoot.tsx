'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

import { Model } from './Model'
import { SignalProcessor } from './SignalProcessor'
import { TernaryPass } from './TernaryPass'
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
  return (
    <>
      {/* 🔥 increase ambient */}
      <ambientLight intensity={0.6} />

      <directionalLight
        position={[5, 5, 5]}
        intensity={1.0} // 🔥 stronger
      />

      <pointLight
        position={[0, -2, 3]}
        intensity={0.4} // 🔥 stronger
        color="#4a9eff"
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
  const ternaryRef = useRef<any>(null)

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
        <TernaryPass ref={ternaryRef} threshold={0.15} debug={0} />
      </EffectComposer>
    </>
  )
}
