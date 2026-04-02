'use client'

import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { ASSETS } from './AssetLoader'
import { useModelStore } from '../../../store/useModelstore'

export default function Model() {
  const { scene } = useGLTF(ASSETS.models.hero)

  const { pcd, loadPCD } = useModelStore()

  /* ------------------------------------------------------------ */
  /* 🔥 LOAD ONCE */
  /* ------------------------------------------------------------ */
  useEffect(() => {
    loadPCD()
  }, [loadPCD])

  /* ------------------------------------------------------------ */
  /* 🔥 PROCESS ONLY WHEN READY */
  /* ------------------------------------------------------------ */
  const processedScene = useMemo(() => {
    const clone = scene.clone(true)

    if (!pcd) return clone

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      if (child.name !== 'Body') return

      const geometry = child.geometry.clone()

      const bbox = new THREE.Box3().setFromBufferAttribute(
        geometry.getAttribute('position')
      )

      const size = new THREE.Vector3()
      bbox.getSize(size)

      const textureSize = 256

      const displacementData = new Float32Array(textureSize * textureSize)
      const colorData = new Uint8Array(textureSize * textureSize * 4)

      // 🔥 FAST LOOP
      for (let i = 0; i < pcd.positions.length; i++) {
        const point = pcd.positions[i]
        const color = pcd.colors[i]

        const uvX = Math.floor(
          ((point.x - bbox.min.x) / size.x) * textureSize
        )
        const uvY = Math.floor(
          ((point.y - bbox.min.y) / size.y) * textureSize
        )

        if (uvX < 0 || uvX >= textureSize || uvY < 0 || uvY >= textureSize)
          continue

        const idx = uvY * textureSize + uvX

        displacementData[idx] =
          (point.z - bbox.min.z) / size.z

        const ci = idx * 4
        colorData[ci] = color.r * 255
        colorData[ci + 1] = color.g * 255
        colorData[ci + 2] = color.b * 255
        colorData[ci + 3] = 255
      }

      const displacementTexture = new THREE.DataTexture(
        displacementData,
        textureSize,
        textureSize,
        THREE.RedFormat,
        THREE.FloatType
      )
      displacementTexture.needsUpdate = true

      const colorTexture = new THREE.DataTexture(
        colorData,
        textureSize,
        textureSize,
        THREE.RGBAFormat
      )
      colorTexture.needsUpdate = true

      child.material = new THREE.MeshStandardMaterial({
        displacementMap: displacementTexture,
        displacementScale: 0.1,
        map: colorTexture,
      })
    })

    return clone
  }, [scene, pcd])

  return (
    <group scale={2}>
      <primitive object={processedScene} />
    </group>
  )
}

useGLTF.preload(ASSETS.models.hero)
