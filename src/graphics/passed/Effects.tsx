'use client'

import {
  EffectComposer,
  Bloom,
  Noise,
  Vignette,
} from '@react-three/postprocessing'
import { CRTEffect } from './CRTEffect'

export default function Effects() {
  return (
    <EffectComposer>
      <CRTEffect />

      <Bloom intensity={0.6} mipmapBlur />
      <Noise opacity={0.04} />
      <Vignette eskil={false} offset={0.15} darkness={1.1} />
    </EffectComposer>
  )
}
