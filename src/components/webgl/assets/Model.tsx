'use client'

import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ASSETS } from './AssetLoader'
import {
  applyGlassScanMaterial,
  applyScanMaterial,
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
  const groupRef = useRef<THREE.Group>(null)
  const modelScene = useMemo(() => scene.clone(true), [scene])

  const scrollProgress = useOrchestratorStore((state) => state.scrollProgress)

  useLayoutEffect(() => {
    if (!groupRef.current) return

    groupRef.current.visible = false

    const materialCache = new Map<string, THREE.MeshPhysicalMaterial>()

    groupRef.current.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      child.matrixAutoUpdate = false
      child.updateMatrix()

      child.castShadow = true
      child.receiveShadow = true

      const oldMat = child.material as THREE.MeshStandardMaterial
      if (!oldMat) return

      if (oldMat.map) {
        oldMat.map.flipY = false
        oldMat.map.colorSpace = THREE.SRGBColorSpace
      }

      if (materialCache.has(oldMat.uuid)) {
        child.material = materialCache.get(oldMat.uuid)!
        return
      }

      let newMat: THREE.MeshPhysicalMaterial

      const isGlass =
        'transmission' in oldMat &&
        (oldMat as THREE.MeshPhysicalMaterial).transmission > 0

      if (isGlass) {
        newMat = new THREE.MeshPhysicalMaterial({
          map: oldMat.map || null,
          transparent: true,
          opacity: 0.86,
          roughness: oldMat.roughness ?? 0.02,
          metalness: 0,
          transmission: 1,
          thickness: 0.25,
          ior: 1.45,
          clearcoat: 0.8,
          clearcoatRoughness: 0.15,
          envMapIntensity: 1.5,
          depthWrite: false,
        })

        newMat.attenuationColor = new THREE.Color('#F88863')
        newMat.attenuationDistance = 2.5
        newMat.userData.isGlass = true
        applyGlassScanMaterial(newMat)
        child.renderOrder = 10
      } else {
        newMat = new THREE.MeshPhysicalMaterial({
          map: oldMat.map || null,
          normalMap: oldMat.normalMap || null,
          roughnessMap: oldMat.roughnessMap || null,
          metalnessMap: oldMat.metalnessMap || null,
          color: '#ffffff',
          roughness: 0.8,
          metalness: 0.0,
          clearcoat: 0.5,
          clearcoatRoughness: 0.25,
          transmission: 0.0,
          transparent: false,
          envMapIntensity: 1.2,
        })

        applyScanMaterial(newMat)
      }

      newMat.needsUpdate = true
      child.material = newMat
      materialCache.set(oldMat.uuid, newMat)
    })

    groupRef.current.visible = true
  }, [modelScene])

  useFrame((state) => {
    sharedScanUniforms.uTime.value = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y = getMappedModelRotation(scrollProgress, state.clock.elapsedTime)
      groupRef.current.position.y = getMappedModelY(scrollProgress)
      sharedScanUniforms.uScanPosition.value = getMappedScanPosition(scrollProgress)
    }
  })

  return (
    <group ref={groupRef} scale={1}>
      <primitive object={modelScene} />
    </group>
  )
}

useGLTF.preload(ASSETS.models.hero)
