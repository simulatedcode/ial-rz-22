'use client'

import { forwardRef, useMemo } from 'react'
import { Effect } from 'postprocessing'
import { Uniform } from 'three'

import { ternaryPassShader } from '@/shaders/ternary-pass'

class TernaryEffect extends Effect {
  constructor({
    threshold = 0.15,
    debug = 0,
  }: {
    threshold?: number
    debug?: number
  } = {}) {
    super('TernaryEffect', ternaryPassShader, {
      uniforms: new Map<string, Uniform>([
        ['uThreshold', new Uniform(threshold)],
        ['uDebug', new Uniform(debug)],
      ]),
    })
  }
}

interface TernaryPassProps {
  threshold?: number
  debug?: number
}

export const TernaryPass = forwardRef<TernaryEffect, TernaryPassProps>(
  ({ threshold = 0.15, debug = 0 }, ref) => {
    const effect = useMemo(() => {
      return new TernaryEffect({ threshold, debug })
    }, [threshold, debug])
    return <primitive ref={ref} object={effect} />
  }
)

TernaryPass.displayName = 'TernaryPass'
