export const ternaryPassShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uThreshold;
uniform int uDebug;

float unpackSignal(float v) {
    return v * 2.0 - 1.0;
}

float toTernary(float x, float threshold) {
    float mask = step(threshold, abs(x));
    float s = sign(x + 0.0001);
    return s * mask;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // 🔥 Pixelation logic
    float pixelSize = 4.0; // Size of the "pixels"
    vec2 pUv = floor(uv * uResolution / pixelSize) * pixelSize / uResolution;

    vec3 col = inputColor.rgb;

    float packed = inputColor.a;
    float signal = unpackSignal(packed);

    float t = toTernary(signal, uThreshold);

    if (uDebug == 1) {
        vec3 debugColor = vec3(
            step(0.5, t),
            step(0.1, abs(t)),
            step(0.5, -t)
        );

        outputColor = vec4(debugColor, inputColor.a);
        return;
    }

    float signedT = t;
    
    if (abs(signedT) > 0.01) {
        // 🔥 Stylized digital appearance for the model
        col *= (1.0 + signedT * 0.25);
        
        // Scanlines/Grid based on pixelated UV
        float grid = 0.9 + 0.1 * sin(pUv.y * uResolution.y * 3.14159 / pixelSize);
        grid *= 0.9 + 0.1 * sin(pUv.x * uResolution.x * 3.14159 / pixelSize);
        col *= grid;
        
        // Boost contrast on signal
        col = pow(col, vec3(1.1));
    } else {
        // Background remains relatively untouched
        col = pow(col, vec3(1.05));
    }

    outputColor = vec4(col, inputColor.a);
}
`
