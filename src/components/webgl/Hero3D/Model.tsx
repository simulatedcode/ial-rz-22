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

      // 🔁 reuse material
      if (materialCache.has(oldMat.uuid)) {
        child.material = materialCache.get(oldMat.uuid)!
        return
      }

      let newMat: THREE.MeshPhysicalMaterial

      /* =================================================
         🔍 CORRECT GLASS DETECTION (IMPORTANT)
      ================================================= */

      const isGlass =
        'transmission' in oldMat &&
        (oldMat as any).transmission > 0

      if (isGlass) {
        // 🪐 REAL VISOR MATERIAL
        newMat = new THREE.MeshPhysicalMaterial({
          map: oldMat.map || null,

          transparent: true,
          opacity: 1,

          roughness: oldMat.roughness ?? 0.05,
          metalness: 0,

          transmission: 1,
          thickness: 0.25, // 🔥 depth
          ior: 1.45,

          clearcoat: 1.0,
          clearcoatRoughness: 0,

          envMapIntensity: 2.0,
          depthWrite: false,
        })

        // optional tint (remove if not needed)
        newMat.attenuationColor = new THREE.Color('#F88863')
        newMat.attenuationDistance = 0.5

        // render priority fix
        child.renderOrder = 10
      } else {
        // 🧱 SOLID MATERIAL
        newMat = new THREE.MeshPhysicalMaterial({
          map: oldMat.map || null,
          normalMap: oldMat.normalMap || null,
          roughnessMap: oldMat.roughnessMap || null,
          metalnessMap: oldMat.metalnessMap || null,

          color: '#ffffff',

          roughness: 0.2,
          metalness: 0.0,

          clearcoat: 0.5,
          clearcoatRoughness: 0.15,

          transmission: 0.0,
          transparent: false,

          envMapIntensity: 1.2,
        })

        // 🔥 keep your scan system
        applyScanMaterial(newMat)
      }

      newMat.needsUpdate = true

      child.material = newMat
      materialCache.set(oldMat.uuid, newMat)
    })
  }, [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const range = 2.0

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
