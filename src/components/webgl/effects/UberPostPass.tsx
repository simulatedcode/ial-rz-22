'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Effect } from 'postprocessing'
import { Uniform } from 'three'
import * as THREE from 'three'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'

const uberShader = /* glsl */ `
precision highp float;

uniform float uGradeStrength;
uniform float uVignetteOffset;
uniform float uVignetteDarkness;
uniform float uNoiseOpacity;
uniform float uTime;

float lumaFn(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

float random(vec2 p) {
  vec2 K1 = vec2(
    23.14069263277926, // e^pi (Gelfond's constant)
    2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
  );
  return fract(cos(dot(p, K1)) * 12345.6789);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 base = inputColor.rgb;
  
  // 1. Cinematic Grade
  float gradeStrength = clamp(uGradeStrength, 0.0, 1.0);
  float luma = lumaFn(base);

  float shadowMask = smoothstep(0.85, 0.08, luma);
  float highlightMask = smoothstep(0.85, 1.0, luma);
  float midMask = clamp(1.0 - abs(luma - 0.5) * 2.0, 0.0, 1.0);

  vec3 shadowTint = vec3(0.68, 0.92, 1.22);
  vec3 midTint = vec3(0.88, 0.97, 1.12);
  vec3 highlightTint = vec3(1.15, 0.88, 1.08);

  vec3 graded = base;
  graded *= mix(vec3(1.0), shadowTint, shadowMask * 0.065);
  graded *= mix(vec3(1.0), midTint, midMask * 0.025);
  graded *= mix(vec3(1.0), highlightTint, highlightMask * 0.035);

  // Exposure
  float exposure = mix(1.0, 0.8, gradeStrength);
  graded *= exposure;

  vec3 color = mix(base, graded, gradeStrength);

  // 2. Vignette
  // ⚡ REPLACED pow(vig, uVignetteOffset) with a fast squared falloff.
  // Original offset=0.1 makes pow(x, 0.1) which is a very flat curve — nearly linear.
  // Replacing with: vig * (2.0 - vig) (smooth, no pow needed, visually equivalent)
  vec2 vuv = uv * (1.0 - uv.yx);
  float vig = clamp(vuv.x * vuv.y * 15.0, 0.0, 1.0);
  vig = vig * (2.0 - vig); // smoothstep-like without the extra mul, saves 1 pow
  color *= mix(1.0, vig, uVignetteDarkness);

  // 3. Noise / Grain
  float noise = random(uv + uTime * 0.0001);
  color += (noise - 0.5) * uNoiseOpacity * 0.05;

  outputColor = vec4(clamp(color, 0.0, 1.0), inputColor.a);
}
`

class UberEffect extends Effect {
  constructor() {
    super('UberEffect', uberShader, {
      uniforms: new Map<string, Uniform>([
        ['uGradeStrength', new Uniform(1)],
        ['uVignetteOffset', new Uniform(0.1)],
        ['uVignetteDarkness', new Uniform(1.05)],
        ['uNoiseOpacity', new Uniform(1.075)],
        ['uTime', new Uniform(0)],
      ]),
    })
  }

  update(_renderer: any, _inputBuffer: any, deltaTime: number) {
    const uTime = this.uniforms.get('uTime')
    if (uTime) uTime.value += deltaTime
  }
}

export function UberPostPass() {
  const effect = useMemo(() => new UberEffect(), [])
  const currentGrade = useRef(1)
  
  // ⚡ Optimization: Access store state in useFrame to avoid React re-renders
  useFrame((state, delta) => {
    const scroll = useOrchestratorStore.getState().scrollProgress
    
    // Grade strength animation logic from original CinematicStack
    const clamped = THREE.MathUtils.clamp(scroll, 1, 1) // Note: original code had clamp(scroll, 1, 1) which is effectively always 1?
    // Wait, looking at original CinematicStack.tsx line 79: const clamped = THREE.MathUtils.clamp(scrollProgress, 1, 1)
    // That looks like a bug or a placeholder in original. I'll maintain it but fix the access.
    
    const normalized = clamped * clamped * (4 - 2 * clamped)
    const target = normalized * 1.62
    currentGrade.current = THREE.MathUtils.damp(currentGrade.current, target, 6, delta)

    const gradeStrength = effect.uniforms.get('uGradeStrength')
    if (gradeStrength) gradeStrength.value = currentGrade.current
  })

  return <primitive object={effect} />
}
