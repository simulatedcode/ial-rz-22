'use client'

import React from 'react'
import styles from './HUDBorder.module.css'

interface HUDBorderProps {
  children?: React.ReactNode
  className?: string
  /** Label displayed (rotated) on the left side */
  labelLeft?: string
  /** Label displayed (rotated) on the right side */
  labelRight?: string
  /** Top-center decorative label (e.g. Japanese text) */
  labelTop?: string
  /** Bottom-center decorative label */
  labelBottom?: string
  /** Corner bracket size in px */
  cornerSize?: number
  /** Thickness of each bracket line in px */
  strokeWidth?: number
  /** Color override for all HUD marks */
  color?: string
  /** Whether to animate the corners on mount */
  animated?: boolean
}

/**
 * HUDBorder
 *
 * A scanner / HUD-style border overlay inspired by tactical/sci-fi UI.
 * Renders corner marks and optional rotated side labels — all via CSS, no canvas/SVG needed.
 *
 * Usage:
 *   <HUDBorder labelLeft="COMING SOON" labelRight="COMING SOON" labelTop="ポスターシリーズ">
 *     <YourContent />
 *   </HUDBorder>
 */
export const HUDBorder: React.FC<HUDBorderProps> = ({
  children,
  className = '',
  labelLeft = '',
  labelRight = '',
  labelTop = '',
  labelBottom = '',
  animated = true,
}) => {
  return (
    <div
      className={[
        styles.wrapper,
        animated ? styles.animated : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* ── Corner Brackets ─────────────────────────────────── */}
      <span className={`${styles.corner} ${styles.tl}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.tr}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.bl}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.br}`} aria-hidden="true" />



      {/* ── Side Labels ─────────────────────────────────────── */}
      {labelTop && (
        <span className={`${styles.label} ${styles.labelTop}`}>
          {labelTop}
        </span>
      )}
      {labelBottom && (
        <span className={`${styles.label} ${styles.labelBottom}`}>
          {labelBottom}
        </span>
      )}
      {labelLeft && (
        <span className={`${styles.label} ${styles.labelLeft}`}>
          {labelLeft}
        </span>
      )}
      {labelRight && (
        <span className={`${styles.label} ${styles.labelRight}`}>
          {labelRight}
        </span>
      )}

      {/* ── Content ─────────────────────────────────────────── */}
      <div className={styles.content}>{children}</div>
    </div>
  )
}
