'use client'

import { Effect } from 'postprocessing'
import { forwardRef, useMemo } from 'react'
import * as THREE from 'three'

class CRTImpl extends Effect {
  constructor() {
    super(
      'CRT',
      `
      uniform float uTime;
      uniform vec2 uResolution;

      vec2 barrelDistortion(vec2 uv, float strength) {
        uv = uv * 2.0 - 1.0;
        float r2 = dot(uv, uv);
        uv *= 1.0 + strength * r2;
        return uv * 0.5 + 0.5;
      }

      void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
        vec2 resolution = uResolution;
        
        // Barrel distortion
        vec2 curvedUv = barrelDistortion(uv, 0.1);
        
        // Cutoff edges
        if (curvedUv.x < 0.0 || curvedUv.x > 1.0 || curvedUv.y < 0.0 || curvedUv.y > 1.0) {
          outputColor = vec4(0.0, 0.0, 0.0, 1.0);
          return;
        }

        // RGB shift (chromatic aberration)
        float aberration = 0.002;
        float r = texture(inputBuffer, curvedUv + vec2(aberration, 0.0)).r;
        float g = texture(inputBuffer, curvedUv).g;
        float b = texture(inputBuffer, curvedUv - vec2(aberration, 0.0)).b;
        vec3 color = vec3(r, g, b);

        // Phosphor mask (dynamic resolution)
        vec2 pixelCoord = curvedUv * resolution * 0.5;
        vec2 subPixel = fract(pixelCoord);
        
        float mask = 1.0;
        if (subPixel.x < 0.333) mask = 0.8;
        else if (subPixel.x < 0.666) mask = 0.85;
        else mask = 0.8;
        
        color *= mask;

        // Scanlines
        float scan = sin(curvedUv.y * resolution.y * 1.5) * 0.06;
        color -= scan;

        // Flicker (multiply instead of add)
        float flicker = sin(uTime * 8.0) * 0.015 + sin(uTime * 50.0) * 0.005;
        color *= 1.0 + flicker;

        // Vignette (using curved UV)
        vec2 vigUv = curvedUv * (1.0 - curvedUv);
        float vig = pow(vigUv.x * vigUv.y * 18.0, 0.45);
        vig = clamp(vig, 0.0, 1.0);
        color *= mix(0.6, 1.0, vig);

        // Slight brightness boost
        color *= 1.1;

        outputColor = vec4(color, 1.0);
      }
      `,
      {
        uniforms: new Map<string, THREE.Uniform<number | THREE.Vector2>>([
          ['uTime', new THREE.Uniform(0)],
          ['uResolution', new THREE.Uniform(new THREE.Vector2(1920, 1080))],
        ]),
      }
    )
  }

  update(_renderer: unknown, _inputBuffer: unknown, deltaTime: number) {
    const timeUniform = this.uniforms.get('uTime')
    if (timeUniform) {
      timeUniform.value += deltaTime
    }
  }
}

export const CRTEffect = forwardRef((props, ref) => {
  const effect = useMemo(() => new CRTImpl(), [])
  return <primitive ref={ref} object={effect} />
})
