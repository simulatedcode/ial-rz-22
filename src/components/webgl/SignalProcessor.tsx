'use client'

import { forwardRef, useMemo } from 'react'
import { Effect } from 'postprocessing'
import { Uniform, Vector2 } from 'three'

const fragmentShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 col = inputColor.rgb;

    float signal = dot(col, vec3(0.299, 0.587, 0.114));
    signal = signal * 2.0 - 1.0;

    float packed = signal * 0.5 + 0.5;

    outputColor = vec4(packed, col.g, col.b, 1.0);
}
`

class SignalProcessorEffect extends Effect {
  constructor() {
    super('SignalProcessorEffect', fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ['uResolution', new Uniform(new Vector2(1, 1))],
        ['uTime', new Uniform(0)],
      ]),
    })
  }

  update(_renderer: unknown, _inputBuffer: unknown, deltaTime: number): void {
    const uTime = this.uniforms.get('uTime')
    if (uTime) {
      uTime.value += deltaTime
    }
  }

  setSize(width: number, height: number): void {
    const uResolution = this.uniforms.get('uResolution')
    if (uResolution) {
      uResolution.value.set(width, height)
    }
  }
}

export const SignalProcessor = forwardRef<SignalProcessorEffect>((_, ref) => {
  const effect = useMemo(() => new SignalProcessorEffect(), [])
  return <primitive ref={ref} object={effect} dispose={null} />
})

SignalProcessor.displayName = 'SignalProcessor'
