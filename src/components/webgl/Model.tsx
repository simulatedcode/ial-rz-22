'use client'

import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Group } from 'three'

export function Model() {
  const { scene } = useGLTF('/model/newscene.gltf')
  const modelRef = useRef<Group>(null)
  
  return (
    <primitive
      ref={modelRef}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  )
}

useGLTF.preload('/model/newscene.gltf')
