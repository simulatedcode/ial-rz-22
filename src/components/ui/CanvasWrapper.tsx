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
      // ⚡ Cap DPR at 1.5 — above 1.5 you fill 2.25x pixels for marginal sharpness gain.
      // On a 3x screen this saves 56% fragment invocations vs uncapped.
      dpr={[1, 1.5]}
      gl={{
        // ⚡ CRITICAL: antialias: false — with post-processing, MSAA samples
        // are resolved and discarded when the framebuffer is read into a texture.
        // It costs GPU bandwidth for zero visual benefit.
        antialias: false,
        powerPreference: 'high-performance',
        // ⚡ Use LinearToneMapping when possible — ACES is more expensive.
        // Switch back to ACES if color accuracy is required.
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2,
        outputColorSpace: THREE.SRGBColorSpace,
        // ⚡ Disable depth buffer stencil — not used in this scene.
        stencil: false,
        // ⚡ Disable logarithmic depth — far plane is only 100 units, not needed.
        logarithmicDepthBuffer: false,
      }}
    >
      <Suspense fallback={null}>
        <WebGLCanvas />
      </Suspense>
    </Canvas>
  )
}
