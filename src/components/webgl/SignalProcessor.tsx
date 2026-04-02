'use client'

import { forwardRef, useMemo } from 'react'
import { Effect } from 'postprocessing'
import { Uniform, Vector2 } from 'three'

import { signalProcessorShader } from '@/shaders/signal-processor'

class SignalProcessorEffect extends Effect {
  constructor() {
    super('SignalProcessorEffect', signalProcessorShader, {
      uniforms: new Map<string, Uniform>([
        ['uResolution', new Uniform(new Vector2(1, 1))],
        ['uTime', new Uniform(0)],
      ]),
    })
  }

  update(_renderer: unknown, _inputBuffer: unknown, deltaTime: number): void {
    const uTime = this.uniforms.get('uTime')
    if (uTime) uTime.value += deltaTime
  }

  setSize(width: number, height: number): void {
    const uResolution = this.uniforms.get('uResolution')
    if (uResolution) uResolution.value.set(width, height)
  }
}

export const SignalProcessor = forwardRef<SignalProcessorEffect>((_, ref) => {
  const effect = useMemo(() => new SignalProcessorEffect(), [])
  return <primitive ref={ref} object={effect} />
})

SignalProcessor.displayName = 'SignalProcessor'
