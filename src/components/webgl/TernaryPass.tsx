'use client'

import { forwardRef, useMemo } from 'react'
import { Effect } from 'postprocessing'
import { Uniform, Vector2 } from 'three'

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
        ['uResolution', new Uniform(new Vector2(1, 1))],
      ]),
    })
  }

  setSize(width: number, height: number): void {
    const uResolution = this.uniforms.get('uResolution')
    if (uResolution) uResolution.value.set(width, height)
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
