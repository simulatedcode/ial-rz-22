'use client'

import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { createCRTMaterial } from '../materials/ CRTMaterial'

export default function CRTScreen() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const texture = useTexture('/texture/screen.jpg') as THREE.Texture

  const material = useMemo(() => {
    const clonedTexture = texture.clone()
    clonedTexture.wrapS = THREE.ClampToEdgeWrapping
    clonedTexture.wrapT = THREE.ClampToEdgeWrapping
    clonedTexture.minFilter = THREE.LinearFilter
    clonedTexture.magFilter = THREE.LinearFilter
    clonedTexture.needsUpdate = true
    return createCRTMaterial(clonedTexture)
  }, [texture])

  useFrame((state) => {
    if (!materialRef.current) return
    materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    <mesh>
      <planeGeometry args={[4, 3]} />
      <primitive
        object={material}
        ref={materialRef}
        attach="material"
      />
    </mesh>
  )
}
