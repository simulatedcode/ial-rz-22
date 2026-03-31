'use client'

import React from 'react'
import styles from './GlobalCRTOverlay.module.css'

interface GlobalCRTOverlayProps {
  children: React.ReactNode
  className?: string
  showBezel?: boolean
}

/**
 * GlobalCRTOverlay
 * A standalone CSS-based CRT effect wrapper.
 * Provides scanlines, flicker, and vignette without WebGL.
 */
export const GlobalCRTOverlay: React.FC<GlobalCRTOverlayProps> = ({ 
  children, 
  className = "", 
  showBezel = false 
}) => {
  return (
    <div className={`${styles.container} ${className} ${showBezel ? styles.bezel : ''}`}>
      {/* The actual content (interactive UI) */}
      <div className={styles.content}>
        {children}
      </div>

      {/* Overlay Layers (Non-interactive) */}
      <div className={styles.overlay}>
        {/* Hardware Noise Grain */}
        <div className={`${styles.overlay} ${styles.noise}`} />

        {/* Phosphor Bloom layer */}
        <div className={`${styles.overlay} ${styles.bloom}`} />

        {/* Repeating scanline grid */}
        <div className={`${styles.overlay} ${styles.scanlines}`} />
        
        {/* Darkening at corners */}
        <div className={`${styles.overlay} ${styles.vignette}`} />
        
        {/* Subtle brightness flicker */}
        <div className={`${styles.overlay} ${styles.flicker}`} />
        
        {/* Slow moving light bar */}
        <div className={styles.monitorReflector} />
      </div>
    </div>
  )
}
