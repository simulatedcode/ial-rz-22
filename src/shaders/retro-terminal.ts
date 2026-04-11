export const retroTerminalShader = `

// ==============================
// CONFIG
// ==============================
float uWarp = 0.015; // Reduced warp to align with flatter CSS layout
float uScanStrength = 0.25; // Matches CSS 0.25 darken
float uRGBShift = 0.004; // Subtle chromatic aberration
float uNoiseStrength = 0.03; 
float uBloom = 1.1;

// ==============================
// UTILS
// ==============================
float getDistanceFromCenter(vec2 uv) {
    return length(abs(uv - 0.5));
}

float random(vec2 uv) {
    return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
}

// ==============================
// EFFECTS
// ==============================

// Barrel distortion (CRT curvature)
vec2 applyWarp(vec2 uv) {
    vec2 delta = uv - 0.5;
    vec2 dist = delta * delta;

    uv.x = delta.x * (1.0 + dist.y * (0.3 * uWarp));
    uv.y = delta.y * (1.0 + dist.x * (0.4 * uWarp));

    return uv + 0.5;
}

// Chromatic aberration (RGB split)
vec3 applyChromatic(vec2 uv, float dist, vec4 baseColor) {
    vec2 shift = vec2(uRGBShift * dist, 0.0);

    float r = texture2D(inputBuffer, uv + shift).r;
    float g = baseColor.g;
    float b = texture2D(inputBuffer, uv - shift).b;

    return vec3(r, g, b);
}

// CRT shadow mask / scanlines (Matches CSS linear-gradient blockiness)
vec3 applyScanlines(vec3 color) {
    // Matches CSS: 4px tall lines, 50% shaded by uScanStrength (0.25)
    float darkLine = step(0.5, fract(gl_FragCoord.y * 0.25)); 
    return color * (1.0 - (darkLine * uScanStrength));
}

// Subpixel phosphor grid (Matches CSS 90deg linear-gradient rgb stripe)
vec3 applySubpixels(vec3 color) {
    // Cycles every 6 pixels (2px Red, 2px Green, 2px Blue)
    float x = mod(gl_FragCoord.x, 6.0);
    vec3 mask = vec3(1.0);
    
    // Simulate the subtle RGB phosphor stripe overlay
    if (x < 2.0) mask = vec3(1.06, 0.98, 0.98);
    else if (x < 4.0) mask = vec3(0.98, 1.02, 0.98);
    else mask = vec3(0.98, 0.98, 1.06);
    
    return color * mask;
}

// Film grain
vec3 applyNoise(vec3 color, vec2 uv) {
    float n = random(uv);
    return color + (n - 0.5) * uNoiseStrength;
}

// Vignette (Matches CSS radial-gradient)
float applyVignette(float dist) {
    // CSS gradient starts dropping roughly after 40% distance from center
    // and fades out to ~70% darkness at edges.
    float v = smoothstep(0.3, 0.8, dist);
    return 1.0 - (v * 0.7); // output multiplier
}

// Edge mask / Bezel Inner Shadow (Matches CSS inset 80px shadow)
float applyEdgeMask(vec2 uv) {
    // Smoother, deeper mask to emulate inner shadow
    return 
        smoothstep(0.0, 0.06, uv.x) *
        smoothstep(1.0, 0.94, uv.x) *
        smoothstep(0.0, 0.06, uv.y) *
        smoothstep(1.0, 0.94, uv.y);
}

// ==============================
// PIPELINE
// ==============================

void mainUv(inout vec2 uv) {
    uv = applyWarp(uv);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float dist = getDistanceFromCenter(uv);

    // 1. Chromatic aberration
    vec3 color = applyChromatic(uv, dist, inputColor);

    // 2. Scanlines 
    color = applyScanlines(color);

    // 3. Phosphor Subpixels
    color = applySubpixels(color);

    // 4. Noise
    color = applyNoise(color, uv);

    // 5. Bloom boost
    color *= uBloom;

    // 6. Vignette
    color *= applyVignette(dist);

    // 7. Edge mask (Inner bezel shadow)
    color *= applyEdgeMask(uv);

    outputColor = vec4(color, 1.0);
}
`;