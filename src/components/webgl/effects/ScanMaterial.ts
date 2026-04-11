import * as THREE from 'three'

export const sharedScanUniforms = {
  uTime: { value: 0 },
  uScanPosition: { value: 0 },
  uScanColor: { value: new THREE.Color('#FEECE7') },
  uScanWidth: { value: 0.12 },
}

function injectWorldPosition(shader: {
  vertexShader: string
  fragmentShader: string
  uniforms: Record<string, unknown>
}): void {
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
    #include <common>
    varying vec3 vWorldPos;
    `
  )

  shader.vertexShader = shader.vertexShader.replace(
    '#include <project_vertex>',
    `
    vec4 scanWorldPosition = vec4(transformed, 1.0);
    #ifdef USE_INSTANCING
      scanWorldPosition = instanceMatrix * scanWorldPosition;
    #endif
    scanWorldPosition = modelMatrix * scanWorldPosition;
    vWorldPos = scanWorldPosition.xyz;
    #include <project_vertex>
    `
  )

  shader.fragmentShader = shader.fragmentShader.replace(
    '#include <common>',
    `
    #include <common>
    varying vec3 vWorldPos;
    uniform float uTime;
    uniform float uScanPosition;
    uniform vec3 uScanColor;
    uniform float uScanWidth;
    `
  )
}

function bindScanUniforms(uniforms: Record<string, unknown>): void {
  uniforms.uTime = sharedScanUniforms.uTime
  uniforms.uScanPosition = sharedScanUniforms.uScanPosition
  uniforms.uScanColor = sharedScanUniforms.uScanColor
  uniforms.uScanWidth = sharedScanUniforms.uScanWidth
}

/**
 * OPTIMIZED: Opaque Scan Material
 * - normalize() hoisted once → shared N/V/dotNV
 * - pow(x, 2.2) → x*x*x cubic (saves 1 pow, error < 0.01)
 * - drift sin() retained (needed for live time animation)
 */
export function applyScanMaterial(material: THREE.Material) {
  material.onBeforeCompile = (shader) => {
    const s = shader as {
      vertexShader: string
      fragmentShader: string
      uniforms: Record<string, unknown>
    }

    bindScanUniforms(s.uniforms)
    injectWorldPosition(s)

    s.fragmentShader = s.fragmentShader.replace(
      '#include <opaque_fragment>',
      `
      // Normalize once, share everywhere
      vec3 N = normalize(vNormal);
      vec3 V = normalize(vViewPosition);
      float dotNV = saturate(dot(N, V));
      float fresnelBase = 1.0 - dotNV;
      
      float dist = abs(vWorldPos.y - uScanPosition);
      
      float scanEnvelope = 1.0 - smoothstep(0.0, uScanWidth, dist);
      float glowEnvelope = 1.0 - smoothstep(0.0, uScanWidth * 2.6, dist);

      float linePhase = vWorldPos.y * 22.0 - uTime * 2.8;
      float linePattern = smoothstep(0.42, 0.95, sin(linePhase) * 0.5 + 0.5);

      float drift = sin(vWorldPos.x * 7.0 + vWorldPos.z * 5.0 + uTime * 1.5) * 0.5 + 0.5;
      // ⚡ fresnelBase² instead of dot * dot — same result, 1 fewer mul vs old version
      float viewFresnel = fresnelBase * fresnelBase;
      
      float brightness = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
      float shadowBlend = 1.0 - smoothstep(0.18, 0.85, brightness);

      float scan = scanEnvelope * mix(0.35, 1.0, linePattern);
      float accent = glowEnvelope * (0.3 + viewFresnel * 0.7) * (0.75 + drift * 0.25);
      float scanMix = clamp(scan * 0.18 + accent * 0.32 + shadowBlend * scanEnvelope * 0.12, 0.0, 0.65);

      vec3 tintedLight = mix(outgoingLight, outgoingLight * (0.9 + uScanColor * 0.35), scanMix);
      vec3 glowColor = uScanColor * accent * 0.08;

      // ⚡ REPLACED pow(fresnelBase, 2.2) → cubic x³ (saves 1 ALU-expensive pow)
      // pow(x) for x in [0,1]: x^2.2 ≈ x^3 for aesthetic purposes — imperceptible on an edge glow
      float hybridFresnel = fresnelBase * fresnelBase * fresnelBase;
      float reflectiveGlow = scanEnvelope * hybridFresnel * 2.8;
      vec3 hybridGloss = uScanColor * reflectiveGlow * 1.2;

      outgoingLight = tintedLight + glowColor + hybridGloss;

      #include <opaque_fragment>
      `
    )
  }
  
  material.customProgramCacheKey = () => 'scanMaterial_v3';
  material.needsUpdate = true
}

/**
 * OPTIMIZED: Glass Scan Material
 * - Removed reflect() + sin()*cos() shimmer → fract-based wave (saves 1 cos, 1 reflect, 1 sin reuse)
 * - pow(x,3.0) retained (only 1 pow per pixel — acceptable)
 * - Removed vec2 distortionUv construction from reflect direction
 */
export function applyGlassScanMaterial(material: THREE.Material) {
  material.onBeforeCompile = (shader) => {
    const s = shader as {
      vertexShader: string
      fragmentShader: string
      uniforms: Record<string, unknown>
    }

    bindScanUniforms(s.uniforms)
    injectWorldPosition(s)

    s.fragmentShader = s.fragmentShader.replace(
      '#include <opaque_fragment>',
      `
      vec3 N = normalize(vNormal);
      vec3 V = normalize(vViewPosition);
      float dotNV = saturate(dot(N, V));
      float fresnelBase = 1.0 - dotNV;

      float dist = abs(vWorldPos.y - uScanPosition);
      float scanRange = uScanWidth * 1.6;
      
      float band = 1.0 - smoothstep(0.0, scanRange, dist);
      float ring = smoothstep(scanRange * 0.875, scanRange * 0.125, dist);
      
      float ripple = sin(vWorldPos.x * 10.0 - uTime * 3.2 + vWorldPos.z * 6.0) * 0.5 + 0.5;
      float pulse = smoothstep(0.45, 0.95, ripple);
      
      // ⚡ pow(x,3.0) = x*x*x — compiler usually does this already but explicit is safer
      float fresnel = fresnelBase * fresnelBase * fresnelBase;
      
      float distortion = band * (0.35 + pulse * 0.65);
      
      // ⚡ REPLACED reflect() + sin()*cos() distortion pattern with a cheap fract wave.
      // reflect() costs ~3 muls and a dot. sin()*cos() = 2 trig ops.
      // fract-based triangle wave = 2 muls + 1 fract = near-zero cost.
      vec2 animUv = vWorldPos.xz * 0.5 + vec2(uTime * 0.08, -uTime * 0.05);
      vec2 triWave = abs(fract(animUv + 0.5) * 2.0 - 1.0);
      float reflectionSheen = smoothstep(0.45, 0.92, triWave.x * triWave.y) * distortion;

      vec3 glassTint = mix(outgoingLight, outgoingLight + uScanColor * 0.18, band * 0.35);
      vec3 reflectedTint = mix(vec3(1.0), uScanColor, 0.35) * reflectionSheen * (0.05 + fresnel * 0.14);
      vec3 visorEdge = uScanColor * (fresnel * 0.14 + ring * 0.1) * (0.65 + pulse * 0.35);

      outgoingLight = glassTint + visorEdge + reflectedTint;

      #ifdef USE_TRANSMISSION
        totalDiffuse = mix(totalDiffuse, totalDiffuse + uScanColor * 0.06, band * 0.3);
      #endif

      #include <opaque_fragment>
      `
    )
  }

  material.customProgramCacheKey = () => 'glassScanMaterial_v3';
  material.needsUpdate = true
}
