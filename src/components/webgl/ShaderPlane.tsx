'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useMemo, useEffect } from 'react'
import * as THREE from 'three'

import { vertexShader, fragmentShader } from './shaders/baseShader'
import { useShaderStore } from '@/store/useShaderStore'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'

export function ShaderPlane() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const { viewport } = useThree()

  // Initialize uniforms once
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
      uQuality: { value: 1.0 },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
    }),
    [viewport.width, viewport.height]
  )

  // Mouse tracking event listener onto the window directly to feed uMouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Map standard screen coordinates [0...1]
      const mx = e.clientX / window.innerWidth
      const my = 1 - (e.clientY / window.innerHeight)
      useShaderStore.getState().setMouse(mx, my)
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  useFrame((state) => {
    if (!materialRef.current) return

    // Extract state cleanly without React re-renders mapping hooks
    const { quality, mouse } = useShaderStore.getState()
    const { scrollProgress } = useOrchestratorStore.getState() // Already existing store, tracking global scroll

    // Feed ShaderUniforms
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    materialRef.current.uniforms.uMouse.value.set(mouse.x, mouse.y)

    // We map real absolute scroll or normalized scroll to uScroll. 
    // scrollProgress is a 0-1 normal, we amplify it for the shader
    materialRef.current.uniforms.uScroll.value = scrollProgress * 100
    materialRef.current.uniforms.uQuality.value = quality
  })

  return (
    <mesh position={[0, 0, -30]} renderOrder={-1}>
      {/* 2x2 Plane fills the entire frustum with no gaps if placed cleanly in an Orthographic camera,
          but using viewport size allows it to cleanly fill standard Perspective views.
          Scaled arbitrarily large to cover frustum when pushed far back in Z. */}
      <planeGeometry args={[Math.max(viewport.width, 20) * 10, Math.max(viewport.height, 20) * 10]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmentShader}
        vertexShader={vertexShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  )
}

