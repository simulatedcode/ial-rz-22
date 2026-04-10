'use client'

import { useRef } from 'react'
import { LUTCubeLoader } from 'postprocessing'
import { useLoader, useFrame } from '@react-three/fiber'
import {
  LUT,
  Bloom,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'
import * as THREE from 'three'

interface CinematicStackProps {
  lutPath?: string
}

export function CinematicStack({
  lutPath = '/luts/cinestyle.cube',
}: CinematicStackProps) {
  // 🎨 Load LUT
  const lut = useLoader(LUTCubeLoader, lutPath)

  const lutRef = useRef<any>(null)

  useFrame(() => {
    if (lutRef.current) {
      const scrollProgress = useOrchestratorStore.getState().scrollProgress
      const clamped = THREE.MathUtils.clamp(scrollProgress, 0, 1)
      const intensity = THREE.MathUtils.smoothstep(clamped, 0, 1)
      lutRef.current.blendMode.opacity.value = intensity
    }
  })

  return (
    <>
      {/* 🌟 1. Bloom: Light bleed (applied before grading so glow gets tinted) */}
      <Bloom
        luminanceThreshold={1.0}
        mipmapBlur
        intensity={0.05}
      />

      {/* 🎞️ 2. Color Grading: Master grade */}
      <LUT ref={lutRef} lut={lut} />

      {/* 🕶️ 3. Vignette: Lens framing */}
      <Vignette offset={0.1} darkness={1.1} />

      {/* 🌫️ 4. Noise: Film grain texture (last pass to fix banding) */}
      <Noise opacity={0.07} premultiply />
    </>
  )
}
