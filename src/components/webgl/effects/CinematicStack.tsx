'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import {
  Bloom,
  Vignette,
  Noise,
} from '@react-three/postprocessing'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'
import { Effect } from 'postprocessing'
import { Uniform } from 'three'
import * as THREE from 'three'

const cinematicGradeShader = /* glsl */ `
precision highp float;

uniform float uStrength;

float lumaFn(vec3 c) {
  return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

// 🎯 luminance-preserving darkening
vec3 applyExposure(vec3 color, float exposure) {
  return color * exposure;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec3 base = inputColor.rgb;
  float strength = clamp(uStrength, 0.0, 1.0);

  vec3 color = base;

  // 👉 YOUR ORIGINAL LOOK (UNCHANGED)
  float luma = lumaFn(color);

  float shadowMask = smoothstep(0.85, 0.08, luma);
  float highlightMask = smoothstep(0.85, 1.0, luma);
  float midMask = 1.0 - abs(luma - 0.5) * 2.0;
  midMask = clamp(midMask, 0.0, 1.0);

  vec3 shadowTint = vec3(0.68, 0.92, 1.22);
  vec3 midTint = vec3(0.88, 0.97, 1.12);
  vec3 highlightTint = vec3(1.15, 0.88, 1.08);

  vec3 graded = color;

  graded = mix(graded, graded * shadowTint, shadowMask * 0.065);
  graded = mix(graded, graded * midTint, midMask * 0.025);
  graded = mix(graded, graded * highlightTint, highlightMask * 0.035);

  // 🎯 ONLY CHANGE: DARKEN EXPOSURE
  float exposure = mix(1.0, 0.8, strength); // 👈 tweak this (0.65–0.8)
  graded = applyExposure(graded, exposure);

  vec3 finalColor = mix(base, graded, strength);

  outputColor = vec4(clamp(finalColor, 0.0, 1.0), inputColor.a);
}
`

class CinematicGradeEffect extends Effect {
  constructor() {
    super('CinematicGradeEffect', cinematicGradeShader, {
      uniforms: new Map<string, Uniform>([
        ['uStrength', new Uniform(1)]
      ]),
    })
  }
}

export function CinematicStack() {
  const scrollProgress = useOrchestratorStore((state) => state.scrollProgress)
  const gradeEffect = useMemo(() => new CinematicGradeEffect(), [])
  const current = useRef(1)

  useFrame((_, delta) => {
    const clamped = THREE.MathUtils.clamp(scrollProgress, 1, 1)

    const normalized = clamped * clamped * (4 - 2 * clamped)
    const target = normalized * 1.62

    current.current = THREE.MathUtils.damp(current.current, target, 6, delta)

    const strength = gradeEffect.uniforms.get('uStrength')
    if (strength) {
      strength.value = current.current
    }
  })

  return (
    <>
      <Bloom
        luminanceThreshold={1.92}
        mipmapBlur
        intensity={0.08}
      />

      <primitive object={gradeEffect} />

      <Vignette
        offset={0.1}
        darkness={1.05}
      />

      <Noise
        opacity={1.075}
        premultiply
      />
    </>
  )
}
