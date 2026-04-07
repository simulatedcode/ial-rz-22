
import { useGLTF, useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

interface AssetRegistry {
  models: Record<string, string>
  textures: Record<string, string>
}

export const ASSETS: AssetRegistry = {
  models: {
    hero: '/model/scene.gltf',
  },
  textures: {
    // Add textures here as needed
  }
}

export const MODEL_OPTIONS: Record<string, object> = {
  hero: {
    draco: true,
    gltfTransform: true,
  }
}

export const useModel = <TKey extends keyof typeof ASSETS.models>(
  key: TKey
) => {
  const path = ASSETS.models[key]
  const modelOptions = MODEL_OPTIONS[key]

  const { scene } = useGLTF(path, modelOptions as unknown as Parameters<typeof useGLTF>[1])

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)

    clone.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        if (child.material) {
          const mat = child.material as THREE.MeshStandardMaterial
          mat.toneMapped = true
          mat.needsUpdate = true
        }
      }
    })

    return clone
  }, [scene])

  return clonedScene
}

export const preloadAssets = () => {
  Object.values(ASSETS.models).forEach((path) => {
    useGLTF.preload(path)
  })

  Object.values(ASSETS.textures).forEach((path) => {
    useTexture.preload(path)
  })
}
