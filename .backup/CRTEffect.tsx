'use client';

import { useMemo } from 'react';
import { Effect } from 'postprocessing';
import { Uniform } from 'three';

const fragmentShader = `
uniform float time;
uniform float scanlineIntensity;
uniform float scanlineCount;
uniform float vignetteIntensity;
uniform float noiseIntensity;
uniform float chromaticAberration;
uniform float brightness;
uniform float contrast;

float random(vec2 co) {
  return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  vec2 coord = uv;
  
  float aberration = chromaticAberration / 1000.0;
  vec4 cr = texture2D(inputBuffer, coord + vec2(aberration, 0.0));
  vec4 cg = inputColor;
  vec4 cb = texture2D(inputBuffer, coord - vec2(aberration, 0.0));
  
  vec3 color = vec3(cr.r, cg.g, cb.b);
  
  float scanline = sin(coord.y * scanlineCount * 3.14159) * 0.5 + 0.5;
  scanline = pow(scanline, 1.5) * scanlineIntensity;
  color -= scanline * 0.1;
  
  float flicker = sin(time * 10.0 + coord.y * 50.0) * 0.02;
  color += flicker;
  
  float noise = random(coord + time) * noiseIntensity;
  color += noise * 0.05;
  
  vec2 vignetteCoord = coord * 2.0 - 1.0;
  float vignette = 1.0 - dot(vignetteCoord, vignetteCoord) * vignetteIntensity;
  color *= vignette;
  
  color = (color - 0.5) * contrast + 0.5 + brightness;
  color.g *= 1.05;
  
  outputColor = vec4(color, inputColor.a);
}
`;

interface CRTEffectOptions {
  scanlineIntensity?: number;
  scanlineCount?: number;
  vignetteIntensity?: number;
  noiseIntensity?: number;
  chromaticAberration?: number;
  brightness?: number;
  contrast?: number;
}

export function createCRTEffect(options: CRTEffectOptions = {}) {
  const {
    scanlineIntensity = 0.5,
    scanlineCount = 800.0,
    vignetteIntensity = 0.3,
    noiseIntensity = 0.5,
    chromaticAberration = 2.0,
    brightness = 0.0,
    contrast = 1.1,
  } = options;

  return new Effect('CRTEffect', fragmentShader, {
    uniforms: new Map([
      ['time', new Uniform(0)],
      ['scanlineIntensity', new Uniform(scanlineIntensity)],
      ['scanlineCount', new Uniform(scanlineCount)],
      ['vignetteIntensity', new Uniform(vignetteIntensity)],
      ['noiseIntensity', new Uniform(noiseIntensity)],
      ['chromaticAberration', new Uniform(chromaticAberration)],
      ['brightness', new Uniform(brightness)],
      ['contrast', new Uniform(contrast)],
    ]),
  });
}

export interface CRTEffectProps extends CRTEffectOptions {
  children?: React.ReactNode;
}

export function CRTEffect(props: CRTEffectProps) {
  const effect = useMemo(() => createCRTEffect(props), [props]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <primitive object={effect} dispose={null} /> as any;
}
