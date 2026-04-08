import * as THREE from 'three'

export const sharedScanUniforms = {
  uTime: { value: 0 },
  uScanPosition: { value: 0 },
  uScanColor: { value: new THREE.Color('#00ffff') },
  uScanWidth: { value: 0.15 },
}

export function applyScanMaterial(
  material: THREE.Material
) {
  material.onBeforeCompile = (shader) => {
    const s = shader as { 
      vertexShader: string
      fragmentShader: string
      uniforms: Record<string, unknown>
    }
    
    s.uniforms.uTime = sharedScanUniforms.uTime
    s.uniforms.uScanPosition = sharedScanUniforms.uScanPosition
    s.uniforms.uScanColor = sharedScanUniforms.uScanColor
    s.uniforms.uScanWidth = sharedScanUniforms.uScanWidth

    s.vertexShader = s.vertexShader.replace(
      '#include <common>',
      `
      #include <common>
      varying vec3 vWorldPos;
      `
    )

    s.vertexShader = s.vertexShader.replace(
      '#include <project_vertex>',
      `
      #include <project_vertex>
      vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      `
    )

    s.fragmentShader = s.fragmentShader.replace(
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

    s.fragmentShader = s.fragmentShader.replace(
      '#include <output_fragment>',
      `
      float dist = abs(vWorldPos.y - uScanPosition);

      float scan = smoothstep(uScanWidth, 0.0, dist);
      float glow = smoothstep(uScanWidth * 3.0, 0.0, dist);

      float edge = dot(normalize(vNormal), vec3(0.0, 1.0, 0.0));
      edge = pow(1.0 - abs(edge), 2.0);

      float noise = sin(vWorldPos.x * 10.0 + uTime * 5.0) * 0.02;
      scan += noise;

      vec3 scanColor = uScanColor * scan * 2.2;
      vec3 glowColor = uScanColor * glow * 0.4;
      vec3 edgeColor = uScanColor * edge * scan * 0.8;

      outgoingLight += scanColor + glowColor + edgeColor;

      #include <output_fragment>
      `
    )
  }

  material.needsUpdate = true
}