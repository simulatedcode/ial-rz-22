'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas as WebGLCanvas } from '@/components/webgl'

export default function CanvasWrapper() {
  return (
    <Canvas
      className="w-full h-full"
      camera={{ position: [0, 0, 0], fov: 30, near: 0.1, far: 100 }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        powerPreference: 'high-performance',
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
      }}
    >
      <Suspense fallback={null}>
        <WebGLCanvas />
      </Suspense>
    </Canvas>
  )
}
