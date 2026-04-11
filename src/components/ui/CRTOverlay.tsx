'use client'

import { useState, useEffect } from 'react'

type QualityLevel = 'off' | 'low' | 'medium' | 'high'

export default function CRTOverlay() {
  // Start with medium quality as default
  const [quality, setQuality] = useState<QualityLevel>('medium')
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch by waiting for client mount
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <>
      <div
        className="pointer-events-none fixed inset-0 z-9999 overflow-hidden"
        style={{ transform: 'translateZ(0)' }}
      >
        {/* 1. Vignette */}
        {quality !== 'off' && (
          <div
            className="absolute inset-0"
            style={{
              background: quality === 'low'
                ? 'radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.5) 100%)'
                : 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 80%, rgba(0,0,0,0.7) 100%)'
            }}
          />
        )}

        {/* 2. Scanlines */}
        {quality === 'high' && (
          <div
            className="absolute inset-0 opacity-[0.8] mix-blend-multiply"
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))',
              backgroundSize: '100% 4px, 6px 100%'
            }}
          />
        )}

        {quality === 'medium' && (
          <div
            className="absolute inset-0 opacity-40 mix-blend-multiply"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.4) 50%)',
              backgroundSize: '100% 4px'
            }}
          />
        )}

        {quality === 'low' && (
          <div
            className="absolute inset-0 opacity-[0.2]"
            style={{
              backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 1) 50%)',
              backgroundSize: '100% 6px'
            }}
          />
        )}

        {/* 3. Screen Bezel - Inner shadow */}
        {quality === 'high' && (
          <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]" />
        )}

        {/* 4. Flicker / Opacity animation */}
        {(quality === 'high' || quality === 'medium') && (
          <div
            className="absolute inset-0 bg-white"
            style={{
              mixBlendMode: 'overlay',
              animation: 'crt-flicker 0.15s infinite'
            }}
          />
        )}
      </div>

      {/* 5. Global Text Glow using pseudo-style injection */}
      <style suppressHydrationWarning>{`
        @keyframes crt-flicker {
          0% { opacity: 0.01; }
          5% { opacity: 0.02; }
          10% { opacity: 0.01; }
          15% { opacity: 0.03; }
          50% { opacity: 0.01; }
          100% { opacity: 0.03; }
        }

        body {
          text-shadow: ${quality === 'high'
          ? '0 0 3px var(--color-foreground), 0 0 8px var(--color-primary)'
          : quality === 'medium'
            ? '0 0 4px var(--color-primary)'
            : 'none'
        };
          transition: text-shadow 0.3s ease;
        }
      `}</style>

      {/* 6. Optional JS Dev Toggle (Interactive overlay) */}
      <div className="fixed bottom-4 right-4 z-10000 flex gap-2 font-mono text-[10px] uppercase text-(--color-ocean-300) opacity-40 hover:opacity-100 transition-opacity">
        <span className="my-auto">CRT:</span>
        {['off', 'low', 'medium', 'high'].map(level => (
          <button
            key={level}
            onClick={() => setQuality(level as QualityLevel)}
            className={`px-2 py-1 border transition-colors ${quality === level
              ? 'bg-(--color-ocean-300) text-(--color-ocean-950) border-(--color-ocean-300) shadow-[0_0_8px_var(--color-ocean-300)]'
              : 'border-(--color-ocean-800) hover:border-ocean-500'
              }`}
          >
            {level}
          </button>
        ))}
      </div>
    </>
  )
}
