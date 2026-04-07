export const ternaryPassShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uThreshold;
uniform int uDebug;

// Simple random generator
float rand(vec2 co){
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

// 1D random to create sharp timing stutters
float rand1(float n){
    return fract(sin(n) * 43758.5453);
}

// Unpack original signal
float unpackSignal(float v) {
    return v * 2.0 - 1.0;
}

// Compute ternary highlight mask
float toTernary(float x, float threshold) {
    float mask = step(threshold, abs(x));
    float s = sign(x + 0.0001);
    return s * mask;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // 💥 Transition progress (0.0 idle -> 1.0 peak transition)
    float baseProgress = clamp((uThreshold - 0.15) / 0.7, 0.0, 1.0);
    
    // 🔥 Make it Random and Erratic
    // uThreshold changes slightly every frame, acting like a time variable.
    float stutter = rand1(uThreshold * 145.2); 
    // Randomly spike the intensity to make it unpredictable
    // Using sqrt for a more persistent glitch as it recedes
    float easeProg = (uThreshold > 0.4) ? pow(baseProgress, 1.2) : sqrt(baseProgress);
    float progress = mix(easeProg, easeProg * stutter * 1.5, baseProgress);
    progress = clamp(progress, 0.0, 1.3); // allow clipping to overdrive
    
    vec2 pUv = uv;
    vec3 finalCol = inputColor.rgb;
    float alpha = inputColor.a;
    
    // 💥 Dramatic Pixelated Glitch Core
    if (progress > 0.001) {
        
        // Massive pixel blocks
        float pixelSize = max(1.0, floor(progress * 35.0 * rand1(uThreshold * 34.0) + 2.0));
        
        if (pixelSize > 1.0) {
            pUv = floor(uv * uResolution / pixelSize) * (pixelSize) / uResolution;
        }
        
        // Screen Bounce/Vertical Tear (Dramatic)
        if (rand(vec2(uThreshold, 0.0)) < progress * 0.4) {
             pUv.y = fract(pUv.y + progress * (rand1(uThreshold) - 0.5) * 0.4);
        }

        // Horizontal Glitch tearing
        float numSlices = 40.0 * rand1(uThreshold * 2.2); // Randomize number of slices
        float blockY = floor(pUv.y * numSlices);
        
        float tearTrigger = rand(vec2(blockY, uThreshold * 105.0));
        if (tearTrigger < progress * 1.8) {
            // Intense horizontal jump
            float shift = (rand(vec2(blockY, uThreshold)) - 0.5) * 1.5 * progress;
            pUv.x = fract(pUv.x + shift); 
        }

        // Chromatic Aberration (RGB split) across pixels NO artificial bright colors
        float rgbSplit = progress * 0.15 * rand(vec2(uThreshold, pUv.y));
        float r = texture2D(inputBuffer, fract(pUv + vec2(rgbSplit, 0.0))).r;
        float g = texture2D(inputBuffer, fract(pUv)).g;
        float b = texture2D(inputBuffer, fract(pUv - vec2(rgbSplit, 0.0))).b;
        
        finalCol = vec3(r, g, b);
        
        // Hardware crash posterization limit
        if (rand(pUv + uThreshold) < progress * 0.6) {
            finalCol = floor(finalCol * 6.0) / 6.0;
        }
        
        // Random dead/shadow pixel chunks (keeps scene tone dark and dystopian)
        if (rand1(pUv.x * pUv.y + uThreshold) < progress * 0.1) {
            finalCol *= 0.2; 
        }
    }

    // 🔴 Retain the original Ternary logic for the model's signal
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
        
        // Maintain local grid logic for the targeted model, dynamically pixelating
        float gridTexel = 4.0;
        vec2 gridUv = floor(uv * uResolution / gridTexel) * gridTexel / uResolution;
        float grid = 0.9 + 0.1 * sin(gridUv.y * uResolution.y * 3.14159 / gridTexel);
        grid *= 0.9 + 0.1 * sin(gridUv.x * uResolution.x * 3.14159 / gridTexel);
        finalCol *= grid;
        
        finalCol = pow(finalCol, vec3(1.1));
    } else {
        finalCol = pow(finalCol, vec3(1.05));
    }

    outputColor = vec4(finalCol, 1.0);
}
`
