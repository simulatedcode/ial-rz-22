'use client'

import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'
import * as THREE from 'three'

import { Model } from './Model'
import { SignalProcessor } from './SignalProcessor'
import { TernaryPass } from './TernaryPass'

function RotatingCamera() {
  useFrame((state) => {
    const angle = state.clock.elapsedTime * 0.2
    const radius = 4
    state.camera.position.x = Math.sin(angle) * radius
    state.camera.position.z = Math.cos(angle) * radius
    state.camera.position.y = 0.5
    state.camera.lookAt(0, 0, 0)
  })
  
  return null
}

function CinematicLighting() {
  return (
    <>
      <ambientLight intensity={0.2} />
      
      <directionalLight
        position={[5, 5, 5]}
        intensity={1.5}
      />
      
      <directionalLight
        position={[-3, 2, -2]}
        intensity={0.8}
        color="#4a9eff"
      />
      
      <pointLight
        position={[0, -2, 3]}
        intensity={0.5}
        color="#ff6b35"
      />
      
      <spotLight
        position={[0, 5, 0]}
        angle={0.5}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
      />
    </>
  )
}

function CenteredModel() {
  const modelRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.05
    }
  })
  
  return (
    <group ref={modelRef} position={[0, -1, 0]} scale={2}>
      <Model />
    </group>
  )
}

export default function CanvasRoot() {
  return (
    <Canvas
      camera={{
        position: [0, 0.5, 4],
        fov: 35,
        near: 0.1,
        far: 100
      }}
      gl={{
        antialias: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2
      }}
    >
      <color attach="background" args={['#050810']} />
      
      <fog attach="fog" args={['#050810', 5, 15]} />
      
      <CinematicLighting />
      
      <CenteredModel />
      
      <RotatingCamera />
      
      <EffectComposer>
        <SignalProcessor />
        <TernaryPass
          threshold={0.15}
          debug={0}
        />
      </EffectComposer>
    </Canvas>
  )
}
