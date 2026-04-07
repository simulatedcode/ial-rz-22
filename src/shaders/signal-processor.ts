export const signalProcessorShader = `
precision highp float;

uniform vec2 uResolution;
uniform float uTime;

float luminance(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
}

float encodeSignal(float lum) {
    float signal = (lum - 0.5) * 2.0;
    signal = tanh(signal * 1.2);
    return signal;
}

float packSignal(float signal) {
    return signal * 0.5 + 0.5;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // 🔥 Pixelation intensity
    float pixelSize = 6.0;
    vec2 pUv = floor(uv * uResolution / pixelSize) * pixelSize / uResolution;
    
    // Note: Since we can't easily re-sample inputColor in mainImage, 
    // we lean on the fact that TernaryPass will process this.
    // However, to get a blocky effect, we can quantize the luminance itself.
    
    vec3 col = inputColor.rgb;
    float lum = luminance(col);
    
    // Quantize luminance to create distinct digital "bands"
    lum = floor(lum * 8.0) / 8.0;

    float signal = encodeSignal(lum);
    float packed = packSignal(signal);

    vec3 finalColor = col;
    float alpha = packed;

    outputColor = vec4(finalColor, alpha);
}
`
