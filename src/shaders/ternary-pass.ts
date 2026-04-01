export const ternaryPassShader = `
precision highp float;

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
    col *= (1.0 + signedT * 0.15);
    col = pow(col, vec3(1.05));

    outputColor = vec4(col, inputColor.a);
}
`
