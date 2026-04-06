'use client'

import { useGLTF } from '@react-three/drei'
import { useEffect, useMemo } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js'
import { PixelationShader } from '../effects/PixelationEffect'
import { ASSETS } from './AssetLoader'
import { useModelStore } from '../../../store/useModelstore'

export default function Model() {
  const { scene } = useGLTF(ASSETS.models.hero)

  const { pcd } = useModelStore()
  const { gl, scene: threeScene, camera, size } = useThree()

  const composer = useMemo(() => {
    const comp = new EffectComposer(gl)
    const renderPass = new RenderPass(threeScene, camera)
    comp.addPass(renderPass)

    const pixelPass = new ShaderPass(PixelationShader)
    pixelPass.uniforms.uResolution.value.set(size.width, size.height)
    pixelPass.uniforms.uPixelSize.value = 16.0
    comp.addPass(pixelPass)

    return comp
  }, [gl, threeScene, camera])

  useEffect(() => {
    const pixelPass = composer.passes[1] as any
    if (pixelPass) {
      pixelPass.uniforms.uResolution.value.set(size.width, size.height)
    }
    composer.setSize(size.width, size.height)
  }, [size, composer])

  useFrame(() => {
    composer.render()
  }, 1)

  /* ------------------------------------------------------------ */
  /* 🔥 PROCESS ONLY WHEN READY */
  /* ------------------------------------------------------------ */
  const processedScene = useMemo(() => {
    const clone = scene.clone(true)

    if (!pcd) return clone

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return

      if (child.name !== 'Body') return

      // Allow frustum culling on other meshes, but disable it for Body because displacementMap pushes vertices out of bounds
      child.frustumCulled = false

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
      for (let i = 0; i < pcd.count; i++) {
        const px = pcd.positions[i * 3]
        const py = pcd.positions[i * 3 + 1]
        const pz = pcd.positions[i * 3 + 2]

        const uvX = Math.floor(((px - bbox.min.x) / size.x) * textureSize)
        const uvY = Math.floor(((py - bbox.min.y) / size.y) * textureSize)

        if (uvX < 0 || uvX >= textureSize || uvY < 0 || uvY >= textureSize) continue

        const idx = uvY * textureSize + uvX

        displacementData[idx] = (pz - bbox.min.z) / size.z

        const ci = idx * 4
        colorData[ci] = pcd.colors[i * 3] * 255
        colorData[ci + 1] = pcd.colors[i * 3 + 1] * 255
        colorData[ci + 2] = pcd.colors[i * 3 + 2] * 255
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
