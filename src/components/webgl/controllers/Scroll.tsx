'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'

gsap.registerPlugin(ScrollTrigger)

export function ScrollController() {
  const setScrollProgress = useOrchestratorStore((state) => state.setScrollProgress)

  useLayoutEffect(() => {
    const hero = document.querySelector('#hero')
    if (!hero) return

    const timeline = gsap.to({}, {
      scrollTrigger: {
        trigger: hero,
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
        onUpdate: (self) => {
          setScrollProgress(self.progress)
        },
      },
    })

    ScrollTrigger.refresh()

    return () => {
      timeline.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [setScrollProgress])

  return null
}