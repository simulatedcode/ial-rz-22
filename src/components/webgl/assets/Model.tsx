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
  getMappedModelX,
  getMappedScanPosition
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

    cloned.traverse((child: any) => {
      if (!child.isMesh) return

      child.material = child.material.clone()

      // disable heavy stuff
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
     🎨 MATERIAL PIPELINE
  ========================= */
  useLayoutEffect(() => {
    modelScene.traverse((child: any) => {
      if (!child.isMesh) return

      const mat = child.material
      if (!mat || mat.userData.processed) return

      // minimal fix only
      if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace

      const isGlass =
        mat.transmission > 0 || mat.transparent || mat.opacity < 1

      if (isGlass) {
        applyGlassScanMaterial(mat)
        child.renderOrder = 10
      } else {
        applyScanMaterial(mat)
      }

      mat.userData.processed = true
    })
  }, [modelScene])

  /* =========================
     🎬 ANIMATION
  ========================= */
  useFrame((state) => {
    const scroll = useOrchestratorStore.getState().scrollProgress

    sharedScanUniforms.uTime.value = state.clock.elapsedTime

    if (groupRef.current) {
      groupRef.current.rotation.y =
        getMappedModelRotation(scroll, state.clock.elapsedTime)

      groupRef.current.position.y =
        getMappedModelY(scroll)

      groupRef.current.position.x =
        getMappedModelX(scroll)

      sharedScanUniforms.uScanPosition.value =
        getMappedScanPosition(scroll)
    }
  })

  return (
    <>
      <Environment map={envMap} environmentIntensity={0.2} />

      {/* minimal lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight position={[3, 3, 3]} intensity={0.4} />

      <group ref={groupRef} scale={2}>
        <group ref={modelRef}>
          <primitive object={modelScene} />
        </group>
      </group>
    </>
  )
}

useGLTF.preload(ASSETS.models.hero)