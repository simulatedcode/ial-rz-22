#ifndef GLITCH_PASS_GLSL
#define GLITCH_PASS_GLSL

precision highp float;

uniform float uTime;
uniform vec2 uResolution;

// 🔹 ternary helpers (from core)
float unpackTernary(float v) {
    return v * 2.0 - 1.0;
}

// ------------------------------------------------------------
// 🔥 GLITCH MODULATION (DRIVEN BY TERNARY)
// ------------------------------------------------------------

vec2 glitchUV(vec2 uv, float t, float time) {
    float wave = sin(uv.y * 60.0 + time * 8.0) * 0.002;
    float glitch = step(0.98, fract(time * 6.0)) * (fract(time * 3.0) - 0.5) * 0.1;

    return vec2(uv.x + (wave + glitch) * t, uv.y);
}

// ------------------------------------------------------------
// 🔹 CHROMA SHIFT
// ------------------------------------------------------------

vec3 chromaShift(vec2 uv, float t, sampler2D buffer) {
    vec2 dir = uv - 0.5;
    float dist = length(dir);

    float strength = t * 0.02;

    vec2 rOffset = dir * dist * strength;
    vec2 bOffset = -dir * dist * strength;

    float r = texture2D(buffer, uv + rOffset).r;
    float g = texture2D(buffer, uv).g;
    float b = texture2D(buffer, uv + bOffset).b;

    return vec3(r, g, b);
}

// ------------------------------------------------------------
// 🔹 SCANLINE EFFECT
// ------------------------------------------------------------

float scanline(vec2 uv) {
    float scan = sin(uv.y * uResolution.y * 0.5);
    return mix(0.9, 1.1, step(0.0, scan));
}

// ------------------------------------------------------------
// 🔥 MAIN
// ------------------------------------------------------------

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {

    // 🔹 1. UNPACK TERNARY SIGNAL
    float t = unpackTernary(inputColor.r);

    // 🔹 2. DISTORT UV USING TERNARY
    vec2 distortedUV = glitchUV(uv, t, uTime);

    // 🔹 3. SAMPLE PREVIOUS PASS
    vec3 col = texture2D(inputBuffer, distortedUV).rgb;

    // 🔹 4. APPLY CHROMA SHIFT
    vec3 chroma = chromaShift(uv, t, inputBuffer);

    col = mix(col, chroma, step(0.5, abs(t)));

    // 🔹 5. SCANLINE MODULATION
    col *= scanline(uv);

    // 🔹 6. FINAL OUTPUT
    outputColor = vec4(col, 1.0);
}

#endif
