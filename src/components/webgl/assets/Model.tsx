'use client'

import { useGLTF, useTexture } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { ASSETS } from './AssetLoader'
import {
  applyScanMaterial,
  applyGlassScanMaterial,
  sharedScanUniforms,
} from '../effects/ScanMaterial'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'
import {
  getMappedModelRotation,
  getMappedModelY,
  getMappedScanPosition
} from '@/lib/animation-mapper'

export function Model() {
  const { scene } = useGLTF(ASSETS.models.hero)
  const { scene: r3fScene } = useThree()

  const envMap = useTexture('/images/panorama.png')
  envMap.mapping = THREE.EquirectangularReflectionMapping
  envMap.colorSpace = THREE.SRGBColorSpace

  useLayoutEffect(() => {
    r3fScene.environment = envMap
    r3fScene.environmentIntensity = 0.08

    return () => {
      r3fScene.environment = null
    }
  }, [envMap, r3fScene])

  const groupRef = useRef<THREE.Group>(null)
  const scrollProgress = useOrchestratorStore((state) => state.scrollProgress)

  useLayoutEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      // 🔥 Optimization: Basic mesh setup
      child.castShadow = true
      child.receiveShadow = true

      const mat = child.material as THREE.MeshPhysicalMaterial
      if (!mat) return

      // 🔥 Optimization: Only process each material instance once
      if (!mat.userData.isProcessed) {
        // Correct texture settings for GLTF standards if missing
        const maps = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap']
        maps.forEach(mapName => {
          const texture = (mat as any)[mapName]
          if (texture && texture instanceof THREE.Texture) {
            texture.flipY = false
            texture.colorSpace = (mapName === 'map' || mapName === 'emissiveMap')
              ? THREE.SRGBColorSpace
              : THREE.NoColorSpace
          }
        })

        // 🔥 loading original texture & material properties
        // We detect "glass" or "chrome" parts to apply specific scan logic
        const isGlass = mat.transmission > 0 || mat.transparent || mat.opacity < 1

        if (isGlass) {
          applyGlassScanMaterial(mat)
          child.renderOrder = 10
        } else {
          applyScanMaterial(mat)
        }

        mat.userData.isProcessed = true
      }
    })
  }, [scene])

  useFrame((state) => {
    sharedScanUniforms.uTime.value = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y =
        getMappedModelRotation(scrollProgress, state.clock.elapsedTime)

      groupRef.current.position.y =
        getMappedModelY(scrollProgress)

      sharedScanUniforms.uScanPosition.value =
        getMappedScanPosition(scrollProgress)
    }
  })

  return (
    <>
      <ambientLight intensity={0.035} />
      <directionalLight position={[3, 3, 3]} intensity={0.02} />
      <directionalLight position={[-3, -2, -3]} intensity={0.06} />

      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </>
  )
}

useGLTF.preload(ASSETS.models.hero)