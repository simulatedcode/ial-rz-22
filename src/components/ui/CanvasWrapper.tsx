'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import CanvasRoot from '@/components/webgl/CanvasRoot'

export default function CanvasWrapper() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0.5, 4], fov: 35, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
      }}
    >
      <Suspense fallback={null}>
        <CanvasRoot />
      </Suspense>
    </Canvas>
  )
}
