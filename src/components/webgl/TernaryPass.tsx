'use client'

import { forwardRef, useMemo } from 'react'
import { Effect } from 'postprocessing'
import { Uniform, Vector2 } from 'three'

const fragmentShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;
uniform float uThreshold;
uniform int uDebug;

float toTernary(float x, float t) {
    return sign(x) * step(t, abs(x));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    // 🔹 1. READ SIGNAL FROM PREVIOUS PASS
    float packed = inputColor.r;
    float signal = packed * 2.0 - 1.0;

    // 🔥 2. APPLY TERNARY
    float t = toTernary(signal, uThreshold);

    // 🧪 3. DEBUG VIEW (VERY IMPORTANT)
    if (uDebug == 1) {
        vec3 debugColor = vec3(
            step(0.5, t),      // +1 → red
            step(0.1, abs(t)), // ±1 → green
            step(0.5, -t)      // -1 → blue
        );

        outputColor = vec4(debugColor, 1.0);
        return;
    }

    // 🔹 4. RECONSTRUCT IMAGE
    vec3 col = vec3(t * 0.5 + 0.5);

    outputColor = vec4(col, 1.0);
}
`

class TernaryEffect extends Effect {
  constructor({
    threshold = 0.25,
    debug = 1,
  }: {
    threshold?: number
    debug?: number
  } = {}) {
    super('TernaryEffect', fragmentShader, {
      uniforms: new Map<string, Uniform>([
        ['uResolution', new Uniform(new Vector2(1, 1))],
        ['uTime', new Uniform(0)],
        ['uThreshold', new Uniform(threshold)],
        ['uDebug', new Uniform(debug)],
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

interface TernaryPassProps {
  threshold?: number
  debug?: number
}

export const TernaryPass = forwardRef<TernaryEffect, TernaryPassProps>(
  ({ threshold, debug }, ref) => {
    const effect = useMemo(() => {
      return new TernaryEffect({
        threshold,
        debug,
      })
    }, [threshold, debug])

    return <primitive ref={ref} object={effect} dispose={null} />
  }
)

TernaryPass.displayName = 'TernaryPass'
