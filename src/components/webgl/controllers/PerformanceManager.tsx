'use client'

import { useFrame } from '@react-three/fiber'
import { useRef, useEffect } from 'react'
import { useShaderStore } from '@/store/useShaderStore'

export function PerformanceManager() {
  const lastTimeRef = useRef(0)
  const setQuality = useShaderStore((state) => state.setQuality)
  
  useEffect(() => {
    lastTimeRef.current = performance.now()
  }, [])
  
  useFrame(() => {
    const now = performance.now()
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = now
      return
    }
    
    // Evaluate delta time
    const delta = now - lastTimeRef.current
    lastTimeRef.current = now
    
    // Throttled rough FPS calculation
    const currentFps = 1000 / delta
    
    const { quality } = useShaderStore.getState()
    
    // Adapt based on extreme FPS drops. 
    // We only downgrade. If you want upgrade logic, you'd add slow tiering up.
    if (currentFps < 25 && quality > 0.2) {
      setQuality(0.2)
    } else if (currentFps < 40 && quality > 0.5) {
      setQuality(0.5)
    }
  })

  return null
}
