'use client'

import { useMemo, forwardRef } from 'react'
import { Effect } from 'postprocessing'
import { retroTerminalShader } from '@/shaders/retro-terminal'

class RetroTerminalEffectImpl extends Effect {
  constructor() {
    super('RetroTerminalEffect', retroTerminalShader, {
      uniforms: new Map([]), // The shader currently has warp and scan hardcoded in it as floats
    })
  }
}

export const RetroTerminalEffect = forwardRef<RetroTerminalEffectImpl, any>(
  (props, ref) => {
    const effect = useMemo(() => new RetroTerminalEffectImpl(), [])
    return <primitive ref={ref} object={effect} dispose={null} />
  }
)
