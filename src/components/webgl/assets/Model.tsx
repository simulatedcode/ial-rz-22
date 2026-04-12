'use client'

import { Environment, useGLTF, useTexture } from '@react-three/drei'
import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { ASSETS } from './AssetLoader'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'
import {
  getMappedModelRotation,
  getMappedModelY,
  getMappedModelX
} from '@/lib/animation-mapper'

export function Model() {
  const { scene } = useGLTF(ASSETS.models.hero)

  const groupRef = useRef<THREE.Group>(null)
  const modelRef = useRef<THREE.Group>(null)

  /* =========================
     🌍 ENV (NO CLONE)
  ========================= */
  const envMap = useTexture('/images/panorama.png')
  envMap.mapping = THREE.EquirectangularReflectionMapping
  envMap.colorSpace = THREE.SRGBColorSpace

  /* =========================
     ⚡ CLONE MATERIALS ONLY
  ========================= */
  const modelScene = useMemo(() => {
    const cloned = scene.clone()
    const materialMap = new Map<THREE.Material, THREE.Material>()

    cloned.traverse((child: any) => {
      if (!child.isMesh) return

      // Reuse materials instead of cloning per-mesh for performance
      if (!materialMap.has(child.material)) {
        const clonedMat = child.material.clone()
        clonedMat.castShadow = false
        clonedMat.receiveShadow = false
        materialMap.set(child.material, clonedMat)
      }

      child.material = materialMap.get(child.material)!

      child.castShadow = false
      child.receiveShadow = false
    })

    return cloned
  }, [scene])

  /* =========================
     🎯 AUTO CENTER (STABLE)
  ========================= */
  useLayoutEffect(() => {
    if (!modelRef.current) return

    const box = new THREE.Box3().setFromObject(modelRef.current)
    const center = new THREE.Vector3()
    box.getCenter(center)

    modelRef.current.position.sub(center)
  }, [])

  /* =========================
     🎨 MATERIAL PIPELINE (REMOVED SHADERS)
  ========================= */
  useLayoutEffect(() => {
    modelScene.traverse((child: any) => {
      if (!child.isMesh) return
      const mat = child.material
      if (!mat) return

      // Ensure correct color space for textures
      if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace
    })
  }, [modelScene])

  /* =========================
     🎬 ANIMATION
  ========================= */
  useFrame((state) => {
    const scroll = useOrchestratorStore.getState().scrollProgress

    if (groupRef.current) {
      groupRef.current.rotation.y =
        getMappedModelRotation(scroll, state.clock.elapsedTime)

      groupRef.current.position.y =
        getMappedModelY(scroll)

      groupRef.current.position.x =
        getMappedModelX(scroll)
    }
  })

  return (
    <>
      <Environment map={envMap} environmentIntensity={0.2} />

      {/* minimal lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 3, 3]} intensity={0.6} />

      <group ref={groupRef} scale={2}>
        <group ref={modelRef}>
          <primitive object={modelScene} />
        </group>
      </group>
    </>
  )
}

useGLTF.preload(ASSETS.models.hero)