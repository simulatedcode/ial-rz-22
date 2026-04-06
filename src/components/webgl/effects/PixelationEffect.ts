import * as THREE from 'three'

export const PixelationShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: { value: new THREE.Vector2() },
    uPixelSize: { value: 16.0 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    uniform float uPixelSize;
    varying vec2 vUv;
    
    void main() {
      // uv = floor(uv * resolution / pixelSize) * pixelSize / resolution
      vec2 snappedUv = floor(vUv * uResolution / uPixelSize) * uPixelSize / uResolution;
      gl_FragColor = texture2D(tDiffuse, snappedUv);
    }
  `,
}
