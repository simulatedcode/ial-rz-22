'use client'

import { useGLTF } from '@react-three/drei'
import { useEffect, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ASSETS } from './AssetLoader'
import { applyScanMaterial, sharedScanUniforms } from '../effects/ScanMaterial'

export default function Model() {
  const { scene } = useGLTF(ASSETS.models.hero)

  const groupRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!groupRef.current) return

    const materialCache = new Map<string, THREE.MeshPhysicalMaterial>()

    groupRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      child.castShadow = true
      child.receiveShadow = true

      const oldMat = child.material as THREE.MeshStandardMaterial
      if (!oldMat) return

      // 🔥 Fix GLTF textures
      if (oldMat.map) {
        oldMat.map.flipY = false
        oldMat.map.colorSpace = THREE.SRGBColorSpace
      }

      // 🔥 reuse material if already processed
      if (materialCache.has(oldMat.uuid)) {
        child.material = materialCache.get(oldMat.uuid)!
        return
      }

      // 🔍 detect transparency from original material
      const isTransparent =
        oldMat.transparent === true || (oldMat.opacity ?? 1) < 1

      let newMat: THREE.MeshPhysicalMaterial

      if (isTransparent) {
        // ✅ GLASS / TRANSPARENT PARTS
        newMat = new THREE.MeshPhysicalMaterial({
          map: oldMat.map || null,

          transparent: true,
          opacity: oldMat.opacity ?? 0.6,

          roughness: 0.1,
          metalness: 0.0,

          transmission: 0.9,
          thickness: 0.5,
          ior: 1.45,

          depthWrite: false, // 🔥 critical
        })

        // ensure correct render order
        child.renderOrder = 10
      } else {
        // ✅ PLASTIC TOY MATERIAL
        newMat = new THREE.MeshPhysicalMaterial({
          map: oldMat.map || null,
          normalMap: oldMat.normalMap || null,
          roughnessMap: oldMat.roughnessMap || null,
          metalnessMap: oldMat.metalnessMap || null,

          color: '#ffffff',

          roughness: 0.35,
          metalness: 0.0,

          clearcoat: 0.6,
          clearcoatRoughness: 0.15,

          transmission: 0,
          transparent: false,
        })

        // apply scan only to solid parts
        applyScanMaterial(newMat)
      }

      // 🔥 improve reflections
      newMat.envMapIntensity = 1.2

      child.material = newMat
      materialCache.set(oldMat.uuid, newMat)
    })
  }, [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const range = 2.0

    // 🔥 global shader update
    sharedScanUniforms.uTime.value = t
    sharedScanUniforms.uScanPosition.value =
      Math.sin(t * 0.2) * range
  })

  return (
    <group ref={groupRef} scale={1}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(ASSETS.models.hero)
