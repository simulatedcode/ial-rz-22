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

    vec3 col = inputColor.rgb;

    float lum = luminance(col);
    float signal = encodeSignal(lum);
    float packed = packSignal(signal);

    vec3 finalColor = col;
    float alpha = packed;

    outputColor = vec4(finalColor, alpha);
}
`
