export const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

export const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform float uScroll;
uniform float uQuality;

varying vec2 vUv;

// ==============================
// UTILS
// ==============================
vec2 getCenteredUV(vec2 uv) {
  return uv - 0.5;
}

vec2 getMouse(vec2 mouse) {
  return mouse - 0.5;
}

float safeLength(vec2 v) {
  return length(v) + 0.0001;
}

// ==============================
// EFFECTS
// ==============================
float applyWave(vec2 p, float time, float scroll) {
  float t = time + scroll * 0.01;
  return sin(p.x * 10.0 + t) * 0.1;
}

float applyGlow(vec2 p, vec2 mouse, float quality) {
  float d = safeLength(p - mouse * 1.5);

  float strength = mix(0.01, 0.02, quality);
  float softness = mix(0.1, 0.0, quality);

  return strength / (d + softness);
}

vec3 applyPalette(float wave, float glow) {
  vec3 base = vec3(0.05, 0.6, 0.35);
  vec3 glowColor = vec3(0.8, 0.9, 1.0);

  vec3 color = vec3(0.0);
  color += base * wave;
  color += glowColor * glow;

  return color;
}

// ==============================
// MAIN
// ==============================
void main() {
  vec2 p = getCenteredUV(vUv);
  vec2 mouse = getMouse(uMouse);

  float wave = applyWave(p, uTime, uScroll);
  float glow = applyGlow(p, mouse, uQuality);

  vec3 color = applyPalette(wave, glow);

  gl_FragColor = vec4(color, 1.0);
}
`;