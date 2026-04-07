'use client'

import { useGLTF, useTexture } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

/* =========================================================
   ASSET REGISTRY
========================================================= */

interface AssetRegistry {
  models: Record<string, string>
  textures: Record<string, string>
}

export const ASSETS: AssetRegistry = {
  models: {
    hero: '/model/scene.gltf',
  },
  textures: {},
}



/* =========================================================
   PRELOAD
========================================================= */

export const preloadAssets = () => {
  Object.values(ASSETS.models).forEach((path) => {
    useGLTF.preload(path)
  })

  Object.values(ASSETS.textures).forEach((path) => {
    useTexture.preload(path)
  })
}
