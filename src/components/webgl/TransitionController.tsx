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
    // Collect meshes
    const meshes: THREE.Mesh[] = []
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) meshes.push(child)
    })

    // Exit
    if (phase === 'exiting' && targetRoute) {
      const tl = timelineRegistry.getExitTimeline()
      if (tl) {
        if (effectRef?.current) {
          const uniform = effectRef.current.uniforms.get('uThreshold')
          if (uniform) tl.to(uniform, { value: 0.85, duration: 0.6, ease: 'power2.in' }, 0)
        }
        meshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (mat) {
            tl.to(mat, {
              emissiveIntensity: 6.0,
              opacity: 0,
              duration: 0.7,
              ease: 'power2.in',
              onStart: () => { mat.transparent = true }
            }, 0)
          }
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
        meshes.forEach((mesh) => {
          const mat = mesh.material as THREE.MeshStandardMaterial
          if (mat) {
            mat.transparent = true
            mat.opacity = 0
            mat.emissiveIntensity = 8.0
            tl.to(mat, {
              emissiveIntensity: 0.5,
              opacity: 1,
              duration: 1.4,
              ease: 'power4.out',
              onComplete: () => { mat.transparent = false }
            }, 0.3)
          }
        })
      }
    }
  }, [phase, targetRoute, scene, effectRef])

  return null
}
