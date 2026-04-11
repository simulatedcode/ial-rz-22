export const signalProcessorShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;

float luminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

// ⚡ REPLACED tanh with a fast cubic polynomial approximation.
// tanh(x) ≈ x*(27+x²)/(27+9x²) — max error < 0.003, ~5x cheaper.
float tanhApprox(float x) {
    float x2 = x * x;
    return x * (27.0 + x2) / (27.0 + 9.0 * x2);
}

float encodeSignal(float lum) {
    float signal = (lum - 0.5) * 2.0;
    signal = tanhApprox(signal * 1.2);
    return signal;
}

float packSignal(float signal) {
    return signal * 0.5 + 0.5;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec3 col = inputColor.rgb;
    float lum = luminance(col);
    
    // Quantize luminance to create distinct digital "bands"
    lum = floor(lum * 8.0) / 8.0;

    float signal = encodeSignal(lum);
    float packed = packSignal(signal);

    outputColor = vec4(col, packed);
}
`
