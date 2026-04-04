'use client'

import { useMemo, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'

export const Model = forwardRef<Group>((props, ref) => {
  const { scene } = useGLTF('/model/newscene.glb')

  useMemo(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // ✅ KEEP ORIGINAL MATERIAL
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial

          // ensure compatibility with postprocessing
          mat.toneMapped = true
          mat.needsUpdate = true
        }
      }
    })

  }, [scene])

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={1}
      position={[0, 0, 0]}
    />
  )
})

Model.displayName = 'Model'

useGLTF.preload('/model/newscene.glb')
