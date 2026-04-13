'use client'

import { useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'

gsap.registerPlugin(ScrollTrigger)

export function ScrollController() {
  useLayoutEffect(() => {
    const timeline = gsap.to({}, {
      scrollTrigger: {
        trigger: document.documentElement,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          // ⚡ Access setter imperatively via getState() instead of a React selector.
          // The original pattern (useOrchestratorStore selector in the component) creates
          // a Zustand subscription that causes React to track this component.
          // setScrollProgress is called 60x/sec during scroll — this keeps it
          // entirely outside the React render cycle.
          useOrchestratorStore.getState().setScrollProgress(self.progress)
        },
      },
    })

    ScrollTrigger.refresh()

    return () => {
      timeline.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, []) // ⚡ No deps — getState() is stable, no re-run needed

  return null
}