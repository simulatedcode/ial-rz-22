import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { useTransitionStore } from '@/store/useTransitionStore'
import { timelineRegistry } from '@/lib/global-timeline'
import * as THREE from 'three'

interface TransitionControllerProps {
  effectRef?: React.RefObject<any>
}

export default function TransitionController({ effectRef }: TransitionControllerProps) {
  const { phase, targetRoute } = useTransitionStore()
  const { scene } = useThree()

  useEffect(() => {
    // Collect unique materials
    const materials = new Set<THREE.MeshStandardMaterial>()
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const addMaterial = (m: THREE.Material) => {
          if (m instanceof THREE.MeshStandardMaterial) {
            materials.add(m)
          }
        }

        if (Array.isArray(child.material)) {
          child.material.forEach(addMaterial)
        } else {
          addMaterial(child.material)
        }
      }
    })

    // Save original transparency state
    materials.forEach((mat) => {
      if (mat.userData.originalTransparent === undefined) {
        mat.userData.originalTransparent = mat.transparent
      }
    })

    // Exit
    if (phase === 'exiting' && targetRoute) {
      const tl = timelineRegistry.getExitTimeline()
      if (tl) {
        if (effectRef?.current) {
          const uniform = effectRef.current.uniforms.get('uThreshold')
          if (uniform) tl.to(uniform, { value: 0.85, duration: 0.6, ease: 'power2.in' }, 0)
        }
        materials.forEach((mat) => {
          tl.to(mat, {
            emissiveIntensity: 6.0,
            opacity: 0,
            duration: 0.7,
            ease: 'power2.in',
            onStart: () => { mat.transparent = true }
          }, 0)
        })
      }
    }

    // Enter
    if (phase === 'entering') {
      const tl = timelineRegistry.getEnterTimeline()
      if (tl) {
        if (effectRef?.current) {
          const uniform = effectRef.current.uniforms.get('uThreshold')
          if (uniform) tl.to(uniform, { value: 0.15, duration: 1.2, ease: 'power3.out' }, 0.1)
        }
        materials.forEach((mat) => {
          mat.transparent = true
          mat.opacity = 0
          mat.emissiveIntensity = 2.0
          tl.to(mat, {
            emissiveIntensity: 0.5,
            opacity: 1,
            duration: 1.4,
            ease: 'power4.out',
            onComplete: () => { mat.transparent = mat.userData.originalTransparent }
          }, 0.3)
        })
      }
    }
  }, [phase, targetRoute, scene, effectRef])

  return null
}
