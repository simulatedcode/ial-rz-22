'use client'

import { Bloom } from '@react-three/postprocessing'
import { UberPostPass } from './UberPostPass'

/**
 * OPTIMIZED: CinematicStack
 * Consolidates multiple post-processing passes into a single Uber Shader.
 * Reduces full-screen draw calls and eliminates React re-renders by hoisting state access into the GPU loop.
 */
export function CinematicStack() {
  return (
    <>
      {/* 1. Bloom remains a separate pass as it requires mipmap downsampling */}
      <Bloom
        luminanceThreshold={1.8}
        mipmapBlur
        intensity={0.08}
      />

      {/* 2. Consolidated Pass (Grade + Vignette + Noise) 
          Moving these into one shader reduces global draw calls significantly.
      */}
      <UberPostPass />
    </>
  )
}
