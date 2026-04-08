'use client'

import { useEffect } from 'react'
import { useTransitionStore } from '@/store/useTransitionStore'
import { useOrchestratorStore } from '@/store/useOrchestratorStore'
import { timelineRegistry } from '@/lib/global-timeline'

export function TransitionController() {
  const { phase, targetRoute } = useTransitionStore()
  const setTransitionProgress = useOrchestratorStore((state) => state.setTransitionProgress)

  useEffect(() => {
    if (phase === 'exiting' && targetRoute) {
      const tl = timelineRegistry.getExitTimeline()
      if (tl) {
        setTransitionProgress(0)
        tl.to({ p: 0 }, {
          p: 1,
          duration: 0.8,
          ease: 'power2.inOut',
          onUpdate: function() {
            setTransitionProgress(this.targets()[0].p)
          }
        }, 0)
      }
    }

    if (phase === 'entering') {
      const tl = timelineRegistry.getEnterTimeline()
      if (tl) {
        setTransitionProgress(0)
        tl.to({ p: 0 }, {
          p: 1,
          duration: 1.4,
          ease: 'power3.out',
          onUpdate: function() {
            setTransitionProgress(this.targets()[0].p)
          }
        }, 0)
      }
    }
  }, [phase, targetRoute, setTransitionProgress])

  return null
}