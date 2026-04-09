'use client'

import { useMemo } from 'react'
import { LUTCubeLoader } from 'postprocessing'
import { useLoader } from '@react-three/fiber'
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

  // 🎮 Global drivers
  const scrollProgress = useOrchestratorStore((s) => s.scrollProgress)

  // 🧠 Derived intensity with cinematic smoothing
  const intensity = useMemo(() => {
    const clamped = THREE.MathUtils.clamp(scrollProgress, 0, 1)
    return THREE.MathUtils.smoothstep(clamped, 0, 1)
  }, [scrollProgress])

  return (
    <>
      {/* 🌟 1. Bloom: Light bleed (applied before grading so glow gets tinted) */}
      <Bloom
        luminanceThreshold={1.0}
        mipmapBlur
        intensity={0.05}
      />

      {/* 🎞️ 2. Color Grading: Master grade */}
      {/* @ts-ignore - Library types omit opacity even though it's standard for Effects */}
      <LUT lut={lut} opacity={intensity} />

      {/* 🕶️ 3. Vignette: Lens framing */}
      <Vignette offset={0.1} darkness={1.1} />

      {/* 🌫️ 4. Noise: Film grain texture (last pass to fix banding) */}
      <Noise opacity={0.07} premultiply />
    </>
  )
}
