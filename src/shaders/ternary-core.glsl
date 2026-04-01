#ifndef TERNARY_CORE_GLSL
#define TERNARY_CORE_GLSL

// ============================================================
// TERNARY CORE - CLEAN + GPU SAFE
// Balanced ternary (-1, 0, +1)
// ============================================================

// 🔹 Core ternary quantization
float ternary(float x, float threshold) {
    return sign(x) * step(threshold, abs(x));
}

vec3 ternaryVec3(vec3 v, float threshold) {
    return sign(v) * step(vec3(threshold), abs(v));
}

// ------------------------------------------------------------
// 🔹 PACK / UNPACK (IMPORTANT FOR PIPELINE)
// ------------------------------------------------------------

float packTernary(float t) {
    return t * 0.5 + 0.5;
}

vec3 packTernaryVec3(vec3 t) {
    return t * 0.5 + 0.5;
}

float unpackTernary(float v) {
    return v * 2.0 - 1.0;
}

vec3 unpackTernaryVec3(vec3 v) {
    return v * 2.0 - 1.0;
}

// ------------------------------------------------------------
// 🔹 ARITHMETIC
// ------------------------------------------------------------

float ternaryAdd(float a, float b) {
    return clamp(a + b, -1.0, 1.0);
}

vec3 ternaryAddVec3(vec3 a, vec3 b) {
    return clamp(a + b, -1.0, 1.0);
}

float ternaryMul(float a, float b) {
    return a * b;
}

vec3 ternaryMulVec3(vec3 a, vec3 b) {
    return a * b;
}

// ------------------------------------------------------------
// 🔹 MASK SYSTEM (FIXED + BRANCHLESS)
// -1 → invert
//  0 → ignore
// +1 → apply
// ------------------------------------------------------------

float applyTernaryMask(float base, float mask) {
    float isActive = step(0.1, abs(mask));
    float signMask = sign(mask);
    return mix(base, base * signMask, isActive);
}

vec3 applyTernaryMaskVec3(vec3 base, vec3 mask) {
    vec3 isActive = step(vec3(0.1), abs(mask));
    vec3 signMask = sign(mask);
    return mix(base, base * signMask, isActive);
}

// ------------------------------------------------------------
// 🔹 COMPOSITION
// ------------------------------------------------------------

float composeTernarySignals(float a, float b, float c) {
    return clamp(a + b + c, -1.0, 1.0);
}

vec3 composeTernarySignalsVec3(vec3 a, vec3 b, vec3 c) {
    return clamp(a + b + c, -1.0, 1.0);
}

// ------------------------------------------------------------
// 🔹 NOISE (TERNARY FIELD)
// ------------------------------------------------------------

float ternaryNoise(vec2 uv, float scale, float threshold) {
    float n = fract(sin(dot(uv * scale, vec2(12.9898, 78.233))) * 43758.5453);
    return ternary(n - 0.5, threshold);
}

// ------------------------------------------------------------
// 🔹 UTIL (SAFE)
// ------------------------------------------------------------

float signalStrength(float signal) {
    return abs(signal);
}

#endif
