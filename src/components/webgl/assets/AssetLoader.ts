'use client'

export interface AssetRegistry {
  models: Record<string, string>
  textures: Record<string, string>
}

export const ASSETS: AssetRegistry = {
  models: {
    hero: '/model/scene.gltf',
  },
  textures: {},
}

export const preloadAssets = () => {
  Object.values(ASSETS.models).forEach((path) => {
    import('@react-three/drei').then(({ useGLTF }) => {
      useGLTF.preload(path)
    })
  })

  Object.values(ASSETS.textures).forEach((path) => {
    import('@react-three/drei').then(({ useTexture }) => {
      useTexture.preload(path)
    })
  })
}