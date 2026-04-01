'use client'

import { useMemo, forwardRef } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'
import type { Group } from 'three'

export const Model = forwardRef<Group>((props, ref) => {
  const { scene } = useGLTF('/model/newscene.gltf')

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.frustumCulled = false

        // ✅ KEEP ORIGINAL MATERIAL
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial

          // ensure compatibility with postprocessing
          mat.toneMapped = true
          mat.needsUpdate = true
        }
      }
    })

    return clone
  }, [scene])

  return (
    <primitive
      ref={ref}
      object={clonedScene}
      scale={1}
      position={[0, 0, 0]}
    />
  )
})

Model.displayName = 'Model'

useGLTF.preload('/model/newscene.gltf')
