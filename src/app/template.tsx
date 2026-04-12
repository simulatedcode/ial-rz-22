'use client'

import React, { useEffect, useRef } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import gsap from 'gsap'
import { useTransitionStore } from '@/store/useTransitionStore'
import { timelineRegistry } from '@/lib/global-timeline'

export default function Template({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  
  const { phase, targetRoute, startEnter, setIdle } = useTransitionStore()

  // Handle Exit Animation when targetRoute changes
  useEffect(() => {
    if (phase === 'exiting' && targetRoute) {
      // Execute the actual routing after the exit animation
      const tl = timelineRegistry.createExitTimeline(
        () => console.log('Starting Exit Animation...'),
        () => {
          console.log('Exit Animation Complete, pushing to', targetRoute)
          router.push(targetRoute)
        }
      )

      // Add DOM animations to the timeline
      tl.to(containerRef.current, {
        opacity: 0,
        y: -10,
        filter: 'blur(10px)',
        duration: 0.5,
        ease: 'power2.inOut',
      })

      // Start the exit timeline
      tl.play()
    }
  }, [phase, targetRoute, router])

  // Handle Entrance Animation when the component mounts (on a new route)
  useEffect(() => {
    // Only trigger if we are not in an idle state or if we just navigated
    // When a page loads, we want to animate in.
    
    const tl = timelineRegistry.createEnterTimeline(
      () => {
        startEnter()
      },
      () => {
        setIdle()
      }
    )

    // Set initial state
    gsap.set(containerRef.current, {
      opacity: 0,
      y: 10,
      filter: 'blur(10px)',
    })

    // Add DOM animations to the timeline
    tl.to(containerRef.current, {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      duration: 0.8,
      ease: 'power3.out',
      delay: 0.2, // Small delay for WebGL focus
    })

    // Start the entrance timeline
    tl.play()

    return () => {
      tl.kill()
    }
  }, [pathname, startEnter, setIdle])

  return (
    <div ref={containerRef} className="w-full min-h-screen">
      {children}
    </div>
  )
}
