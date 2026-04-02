'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

export default function Grid() {
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      depthTest: false, // 🔥 ignore depth
      uniforms: {
        uColor: { value: new THREE.Color('#00ffff') },
      },
      vertexShader: `
        varying vec2 vUv;

        void main() {
          vUv = uv;

          // 🔥 FORCE FULLSCREEN (ignore camera)
          gl_Position = vec4(position.xy, 1.0, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor;

        float grid(vec2 uv, float scale) {
          vec2 g = abs(fract(uv * scale - 0.5) - 0.5) / fwidth(uv * scale);
          float line = min(g.x, g.y);
          return 1.0 - min(line, 1.0);
        }

        void main() {
          float g1 = grid(vUv, 8.0);
          float g2 = grid(vUv, 16.0);

          float combined = g1 * 0.7 + g2 * 0.3;

          vec3 color = uColor * combined;

          gl_FragColor = vec4(color, combined * 0.25);
        }
      `,
    })
  }, [])

  return (
    <mesh renderOrder={-1000}>
      <planeGeometry args={[4, 3]} />
      <primitive object={material} attach="material" />
    </mesh>
  )
}
