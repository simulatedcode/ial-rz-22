'use client'

import React from 'react'
import styles from './GlobalCRTOverlay.module.css'

interface GlobalCRTOverlayProps {
  children?: React.ReactNode
  className?: string
  showBezel?: boolean
}

export const GlobalCRTOverlay: React.FC<GlobalCRTOverlayProps> = ({
  children,
  className = "",
  showBezel = false
}) => {
  return (
    <div
      className={`${styles.container} ${className} ${showBezel ? styles.bezel : ''
        }`}
    >
      {/* OPTIONAL CONTENT (only if used as wrapper) */}
      {children && (
        <div className={styles.content}>
          {children}
        </div>
      )}

      {/* OVERLAY STACK */}
      <div className={styles.overlay}>
        <div className={`${styles.overlay} ${styles.noise}`} />
        <div className={`${styles.overlay} ${styles.bloom}`} />
        <div className={`${styles.overlay} ${styles.scanlines}`} />
        <div className={`${styles.overlay} ${styles.vignette}`} />
        <div className={`${styles.overlay} ${styles.flicker}`} />
        <div className={styles.monitorReflector} />
      </div>
    </div>
  )
}
