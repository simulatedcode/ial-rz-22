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
      float dist = abs(vWorldPos.y - uScanPosition);
      float scanEnvelope = 1.0 - smoothstep(0.0, uScanWidth, dist);
      float glowEnvelope = 1.0 - smoothstep(0.0, uScanWidth * 2.6, dist);

      float linePhase = vWorldPos.y * 22.0 - uTime * 2.8;
      float linePattern = sin(linePhase) * 0.5 + 0.5;
      linePattern = smoothstep(0.42, 0.95, linePattern);

      float drift = sin(vWorldPos.x * 7.0 + vWorldPos.z * 5.0 + uTime * 1.5) * 0.5 + 0.5;
      float viewFresnel = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), 2.0);
      float brightness = dot(outgoingLight, vec3(0.2126, 0.7152, 0.0722));
      float shadowBlend = 1.0 - smoothstep(0.18, 0.85, brightness);

      float scan = scanEnvelope * mix(0.35, 1.0, linePattern);
      float accent = glowEnvelope * (0.3 + viewFresnel * 0.7) * (0.75 + drift * 0.25);
      float scanMix = clamp(scan * 0.18 + accent * 0.32 + shadowBlend * scanEnvelope * 0.12, 0.0, 0.65);

      vec3 tintedLight = mix(outgoingLight, outgoingLight * (0.9 + uScanColor * 0.35), scanMix);
      vec3 glowColor = uScanColor * accent * 0.08;

      // 🔥 HYBRID SPECULAR: Reflective sheen from the scan line
      float hybridFresnel = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), 2.2);
      float reflectiveGlow = scanEnvelope * hybridFresnel * 2.8;
      vec3 hybridGloss = uScanColor * reflectiveGlow * 1.2;

      outgoingLight = tintedLight + glowColor + hybridGloss;

      #include <opaque_fragment>
      `
    )
  }
  
  material.customProgramCacheKey = () => 'scanMaterial';
  material.needsUpdate = true
}

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
      float dist = abs(vWorldPos.y - uScanPosition);
      float band = 1.0 - smoothstep(0.0, uScanWidth * 1.6, dist);
      float ring = smoothstep(uScanWidth * 1.4, uScanWidth * 0.2, dist);
      float ripple = sin(vWorldPos.x * 10.0 - uTime * 3.2 + vWorldPos.z * 6.0) * 0.5 + 0.5;
      float pulse = smoothstep(0.45, 0.95, ripple);
      float fresnel = pow(1.0 - saturate(dot(normalize(vNormal), normalize(vViewPosition))), 3.0);
      vec3 scanViewDir = normalize(vViewPosition);
      vec3 scanReflectDir = reflect(-scanViewDir, normalize(vNormal));
      float distortion = band * (0.35 + pulse * 0.65);
      vec2 distortionUv = scanReflectDir.xz * (4.0 + distortion * 2.0);
      distortionUv += vec2(vWorldPos.x, vWorldPos.z) * 0.12;
      distortionUv += vec2(uTime * 0.08, -uTime * 0.05);
      float reflectionWave = sin(distortionUv.x + distortionUv.y) * cos(distortionUv.y * 1.7 - distortionUv.x * 0.6);
      reflectionWave = reflectionWave * 0.5 + 0.5;
      float reflectionSheen = smoothstep(0.45, 0.92, reflectionWave) * distortion;

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

  material.customProgramCacheKey = () => 'glassScanMaterial';
  material.needsUpdate = true
}
