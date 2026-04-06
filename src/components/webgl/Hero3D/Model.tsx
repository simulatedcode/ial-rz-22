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

    // 🔥 PERFORMANCE: Cache converted materials so we don't spam ShaderCompilations!
    // GLTFs often have 50+ meshes that share the exact same 1 or 2 original materials.
    const materialCache = new Map<string, THREE.MeshPhysicalMaterial>()

    groupRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      child.castShadow = true
      child.receiveShadow = true

      const oldMat = child.material as THREE.MeshStandardMaterial
      if (!oldMat) return

      // 🔥 FIX texture orientation (important for GLTF)
      oldMat.map?.flipY === false || (oldMat.map && (oldMat.map.flipY = false))

      // If we already converted this exact material for another mesh, reuse it!
      if (materialCache.has(oldMat.uuid)) {
        child.material = materialCache.get(oldMat.uuid)
        return
      }

      // ✅ Plastic Toy Material
      const newMat = new THREE.MeshPhysicalMaterial({
        map: oldMat.map || null,
        normalMap: oldMat.normalMap || null,
        roughnessMap: oldMat.roughnessMap || null,
        metalnessMap: oldMat.metalnessMap || null,

        color: '#ffffff',

        // 🔥 plastic properties
        roughness: 0.35,
        metalness: 0.0,

        clearcoat: 0.6,
        clearcoatRoughness: 0.15,

        // ❌ no glass behavior
        transmission: 0,
        thickness: 0,
        ior: 1.0,

        transparent: false,
      })

      // 🔥 improve reflections (important for plastic look)
      newMat.envMapIntensity = 1.2

      child.material = newMat
      materialCache.set(oldMat.uuid, newMat)

      // 🔥 apply scan effect (no wrong casting)
      applyScanMaterial(newMat)
    })
  }, [scene])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    const range = 2.0

    // 🔥 PERFORMANCE: Global O(1) uniform update instead of looping over every mesh shader!
    sharedScanUniforms.uTime.value = t
    sharedScanUniforms.uScanPosition.value = Math.sin(t * 0.2) * range
  })

  return (
    <group ref={groupRef} scale={1}>
      <primitive object={scene} />
    </group>
  )
}

useGLTF.preload(ASSETS.models.hero)