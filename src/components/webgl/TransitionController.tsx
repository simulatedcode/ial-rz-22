'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useTransitionStore } from '@/store/useTransitionStore'
import { timelineRegistry } from '@/lib/global-timeline'
import { gsap } from 'gsap'

interface TransitionControllerProps {
  effectRef?: React.RefObject<any>
}

export default function TransitionController({ effectRef }: TransitionControllerProps) {
  const { phase, targetRoute } = useTransitionStore()
  const { scene } = useThree()

  useEffect(() => {
    const materials = new Set<THREE.MeshPhysicalMaterial>()

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const addMaterial = (m: THREE.Material) => {
          if (m instanceof THREE.MeshPhysicalMaterial) {
            materials.add(m)

            // 🔥 detect glass once
            if (m.userData.isGlass === undefined) {
              m.userData.isGlass = m.transmission > 0
            }
          }
        }

        if (Array.isArray(child.material)) {
          child.material.forEach(addMaterial)
        } else {
          addMaterial(child.material)
        }
      }
    })

    // Save original state
    materials.forEach((mat) => {
      if (mat.userData.originalTransparent === undefined) {
        mat.userData.originalTransparent = mat.transparent
      }
      if (mat.userData.originalTransmission === undefined) {
        mat.userData.originalTransmission = mat.transmission
      }
      if (mat.userData.originalRoughness === undefined) {
        mat.userData.originalRoughness = mat.roughness
      }
    })

    /* =====================================================
       🚪 EXIT
    ===================================================== */
    if (phase === 'exiting' && targetRoute) {
      const tl = timelineRegistry.getExitTimeline()
      if (tl) {
        // shader effect
        if (effectRef?.current) {
          const uniform = effectRef.current.uniforms.get('uThreshold')
          if (uniform) {
            tl.to(uniform, {
              value: 0.85,
              duration: 0.8,
              ease: 'power2.inOut',
            }, 0)
          }
        }

        materials.forEach((mat) => {
          gsap.killTweensOf(mat)
          const isGlass = mat.userData.isGlass === true

          if (isGlass) {
            // 🪐 GLASS EXIT (DO NOT TOUCH OPACITY)
            tl.to(mat, {
              transmission: 0.0,
              roughness: 0.6,
              duration: 0.8,
              ease: 'power2.inOut',
            }, 0)
          } else {
            // 🧱 SOLID EXIT
            tl.to(mat, {
              emissiveIntensity: 6.0,
              opacity: 0,
              duration: 0.8,
              ease: 'power2.inOut',
              onStart: () => {
                mat.transparent = true
              },
            }, 0)
          }
        })
      }
    }

    /* =====================================================
       🚀 ENTER
    ===================================================== */
    if (phase === 'entering') {
      const tl = timelineRegistry.getEnterTimeline()
      if (tl) {
        if (effectRef?.current) {
          const uniform = effectRef.current.uniforms.get('uThreshold')
          if (uniform) {
            tl.to(uniform, {
              value: 0.15,
              duration: 1.0,
              ease: 'power3.out',
            }, 0)
          }
        }

        materials.forEach((mat) => {
          gsap.killTweensOf(mat)
          const isGlass = mat.userData.isGlass === true

          if (isGlass) {
            // 🪐 GLASS ENTER
            mat.transmission = 0
            mat.roughness = 0.6

            tl.to(mat, {
              transmission: mat.userData.originalTransmission ?? 1,
              roughness: mat.userData.originalRoughness ?? 0.05,
              duration: 1.0,
              ease: 'power3.out',
            }, 0)
          } else {
            // 🧱 SOLID ENTER
            mat.transparent = true
            mat.opacity = 0
            mat.emissiveIntensity = 1.0

            tl.to(mat, {
              emissiveIntensity: 0.5,
              opacity: 1.0,
              duration: 1.0,
              ease: 'power3.out',
              onComplete: () => {
                mat.transparent = mat.userData.originalTransparent
              },
            }, 0)
          }
        })
      }
    }
  }, [phase, targetRoute, scene, effectRef])

  return null
}