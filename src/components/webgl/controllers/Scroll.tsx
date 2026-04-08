'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const START_CAMERA_POSITION = new THREE.Vector3(0, 0, 0)
const END_CAMERA_POSITION = new THREE.Vector3(0, 0, 0)
export const START_LOOK_AT = new THREE.Vector3(0, 0, 0)
const END_LOOK_AT = new THREE.Vector3(0, 0, 0)

export function ScrollController({
  modelRef,
}: {
  modelRef: React.RefObject<THREE.Group | null>
}) {
  const { camera, invalidate } = useThree()
  const initialModelPosition = useRef<THREE.Vector3 | null>(null)
  const initialModelRotation = useRef<THREE.Euler | null>(null)

  useEffect(() => {
    const model = modelRef?.current
    if (!model) return

    if (!initialModelPosition.current) {
      initialModelPosition.current = model.position.clone()
    }

    if (!initialModelRotation.current) {
      initialModelRotation.current = model.rotation.clone()
    }

    camera.position.copy(START_CAMERA_POSITION)
    camera.lookAt(START_LOOK_AT)
    invalidate()

    const hero = document.querySelector('#hero')
    if (!hero) return

    const lookAtTarget = START_LOOK_AT.clone()
    const modelPosition = initialModelPosition.current.clone()
    const modelRotation = initialModelRotation.current.clone()

    const tl = gsap.timeline({
      defaults: {
        ease: 'none',
      },
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
        onUpdate: () => {
          camera.lookAt(lookAtTarget)
          invalidate()
        },
      },
    })

    tl.to(camera.position, {
      x: END_CAMERA_POSITION.x,
      y: END_CAMERA_POSITION.y,
      z: END_CAMERA_POSITION.z,
    }, 0)

    tl.to(model.rotation, {
      y: modelRotation.y + Math.PI * 0.15,
    }, 0)

    tl.to(model.position, {
      y: 0,
    }, 0)

    tl.to(lookAtTarget, {
      x: END_LOOK_AT.x,
      y: END_LOOK_AT.y,
      z: END_LOOK_AT.z,
    }, 0)

    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })

    return () => {
      tl.scrollTrigger?.kill()
      tl.kill()

      camera.position.copy(START_CAMERA_POSITION)
      camera.lookAt(START_LOOK_AT)
      model.position.copy(modelPosition)
      model.rotation.copy(modelRotation)
      invalidate()
    }
  }, [camera, invalidate, modelRef])

  return null
}
