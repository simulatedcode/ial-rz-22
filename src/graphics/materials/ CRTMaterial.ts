import * as THREE from 'three'

export function createCRTMaterial(texture: THREE.Texture) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTexture: { value: texture },
    },

    vertexShader: `
      varying vec2 vUv;

      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,

    fragmentShader: `
      varying vec2 vUv;

      uniform float uTime;
      uniform sampler2D uTexture;

      void main() {
        vec2 uv = vUv;

        // RGB shift (chromatic aberration)
        float shift = 0.002;
        float r = texture(uTexture, uv + vec2(shift, 0.0)).r;
        float g = texture(uTexture, uv).g;
        float b = texture(uTexture, uv - vec2(shift, 0.0)).b;
        vec3 color = vec3(r, g, b);

        // Scanlines
        float scanline = sin(uv.y * 400.0) * 0.08;
        color -= scanline;

        // Horizontal sync noise
        float hsync = sin(uv.y * 8000.0 + uTime * 100.0) * 0.01;
        color += hsync;

        // Vignette
        vec2 vigUv = uv * (1.0 - uv.yx);
        float vig = vigUv.x * vigUv.y * 15.0;
        vig = pow(vig, 0.3);
        color *= vig;

        // Flicker
        float flicker = sin(uTime * 10.0) * 0.015 + 1.0;
        color *= flicker;

        // Brightness boost
        color *= 1.15;

        gl_FragColor = vec4(color, 1.0);
      }
    `,
  })
}
