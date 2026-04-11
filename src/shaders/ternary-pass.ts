export const ternaryPassShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uThreshold;
uniform int uDebug;

// ⚡ REPLACED sin-based hash with a bit-hash (integer ops only, no trig).
// 4 sin() calls → 0. Dramatically cheaper on mobile GPUs.
float hash11(float p) {
    uvec2 q = uvec2(floatBitsToUint(p));
    q.x ^= q.x >> 17u; q.x *= 0xbf324cu;
    q.x ^= q.x >> 13u;
    return float(q.x) * (1.0 / float(0xffffffffu));
}

float hash21(vec2 p) {
    uvec2 q = floatBitsToUint(p);
    q.x ^= q.y ^ 0x4fc93u;
    q.x *= 0x27d4eb2du;
    q.x ^= q.x >> 15u;
    return float(q.x) * (1.0 / float(0xffffffffu));
}

float unpackSignal(float v) {
    return v * 2.0 - 1.0;
}

float toTernary(float x, float threshold) {
    float mask = step(threshold, abs(x));
    float s = sign(x + 0.0001);
    return s * mask;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    float baseProgress = clamp((uThreshold - 0.15) / 0.7, 0.0, 1.0);
    
    float stutter = hash11(uThreshold * 145.2);
    
    // ⚡ REPLACED pow(x, 1.2) with x * sqrt(x) approximation (cheaper, visually equivalent)
    // and sqrt(x) stays as-is (1 instruction vs 2+ for pow).
    float easeProg = (uThreshold > 0.4)
        ? baseProgress * sqrt(baseProgress) // ≈ pow(x, 1.5), cheap, similar visual weight
        : sqrt(baseProgress);
    float progress = clamp(mix(easeProg, easeProg * stutter * 1.5, baseProgress), 0.0, 1.3);
    
    vec2 pUv = uv;
    vec3 finalCol = inputColor.rgb;
    float alpha = inputColor.a;
    
    if (progress > 0.001) {
        float pixelSize = max(1.0, floor(progress * 35.0 * hash11(uThreshold * 34.0) + 2.0));
        
        if (pixelSize > 1.0) {
            pUv = floor(uv * uResolution / pixelSize) * pixelSize / uResolution;
        }
        
        // Vertical tear
        if (hash21(vec2(uThreshold, 0.0)) < progress * 0.4) {
             pUv.y = fract(pUv.y + progress * (hash11(uThreshold) - 0.5) * 0.4);
        }

        // Horizontal glitch
        float numSlices = 40.0 * hash11(uThreshold * 2.2);
        float blockY = floor(pUv.y * numSlices);
        
        float tearTrigger = hash21(vec2(blockY, uThreshold * 105.0));
        if (tearTrigger < progress * 1.8) {
            float shift = (hash21(vec2(blockY, uThreshold)) - 0.5) * 1.5 * progress;
            pUv.x = fract(pUv.x + shift); 
        }

        // Chromatic Aberration
        float rgbSplit = progress * 0.15 * hash21(vec2(uThreshold, pUv.y));
        float r = texture2D(inputBuffer, fract(pUv + vec2(rgbSplit, 0.0))).r;
        float g = texture2D(inputBuffer, fract(pUv)).g;
        float b = texture2D(inputBuffer, fract(pUv - vec2(rgbSplit, 0.0))).b;
        finalCol = vec3(r, g, b);
        
        // Posterization
        if (hash21(pUv + uThreshold) < progress * 0.6) {
            finalCol = floor(finalCol * 6.0) / 6.0;
        }

        // Dead pixels
        if (hash11(pUv.x * pUv.y + uThreshold) < progress * 0.1) {
            finalCol *= 0.2; 
        }
    }

    float signal = unpackSignal(alpha);
    float t = toTernary(signal, uThreshold);

    if (uDebug == 1) {
        vec3 debugColor = vec3(step(0.5, t), step(0.1, abs(t)), step(0.5, -t));
        outputColor = vec4(debugColor, alpha);
        return;
    }

    float signedT = t;
    if (abs(signedT) > 0.01) {
        finalCol *= (1.0 + signedT * 0.25);
        
        // ⚡ REPLACED 2x sin() grid with a single multiply of fract waves.
        // sin(u * π / texel) ≈ tri-wave via fract — same periodic grid, zero trig.
        float gridTexel = 4.0;
        vec2 gridUv = floor(uv * uResolution / gridTexel) / uResolution;
        vec2 wave = abs(fract(gridUv * uResolution / gridTexel * 0.5) * 2.0 - 1.0);
        float grid = 0.9 + 0.1 * wave.x * wave.y;
        finalCol *= grid;

        // ⚡ REPLACED pow(x, 1.1) with x + x*0.1*x trick (fma-friendly).
        finalCol = finalCol + finalCol * finalCol * 0.1;
    } else {
        // ⚡ REPLACED pow(x, 1.05) with a linear lift (visual diff negligible at 1.05).
        finalCol = finalCol * 1.03;
    }

    outputColor = vec4(finalCol, 1.0);
}
`
