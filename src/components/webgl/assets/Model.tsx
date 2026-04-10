'use client'

import { Environment, useGLTF, useTexture } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
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

const MATERIAL_MAP_KEYS = [
  'map',
  'normalMap',
  'roughnessMap',
  'metalnessMap',
  'emissiveMap',
  'aoMap',
] as const

type MaterialMapKey = (typeof MATERIAL_MAP_KEYS)[number]

type ScanReadyMaterial = THREE.MeshPhysicalMaterial & Partial<Record<MaterialMapKey, THREE.Texture | null>>

export function Model() {
  const { scene } = useGLTF(ASSETS.models.hero)
  const envMapTexture = useTexture('/images/panorama.png')
  const envMap = useMemo(() => {
    const texture = envMapTexture.clone()

    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.colorSpace = THREE.SRGBColorSpace
    texture.needsUpdate = true

    return texture
  }, [envMapTexture])

  const groupRef = useRef<THREE.Group>(null)
  const scrollProgress = useOrchestratorStore((state) => state.scrollProgress)

  useLayoutEffect(() => {
    if (!scene) return

    scene.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      // 🔥 Optimization: Basic mesh setup
      child.castShadow = true
      child.receiveShadow = true

      const mat = child.material as ScanReadyMaterial
      if (!mat) return

      // 🔥 Optimization: Only process each material instance once
      if (!mat.userData.isProcessed) {
        // Correct texture settings for GLTF standards if missing
        MATERIAL_MAP_KEYS.forEach((mapName) => {
          const texture = mat[mapName]
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
      <Environment map={envMap} background={false} environmentIntensity={0.35} />

      <ambientLight intensity={0.25} />
      <directionalLight position={[3, 3, 3]} intensity={0.18} />
      <directionalLight position={[-3, -2, -3]} intensity={0.46} />

      <group ref={groupRef}>
        <primitive object={scene} />
      </group>
    </>
  )
}

useGLTF.preload(ASSETS.models.hero)
