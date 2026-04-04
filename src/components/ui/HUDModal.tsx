'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface HUDModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
}

export default function HUDModal({ isOpen, onClose, children, title = 'SYSTEM_MODAL' }: HUDModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      // Entrance Animation
      const tl = gsap.timeline()
      
      tl.set(overlayRef.current, { visibility: 'visible', opacity: 0 })
      tl.set(modalRef.current, { 
        scaleX: 0, 
        scaleY: 0.01, 
        filter: 'blur(20px)',
        opacity: 0,
      })

      tl.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: 'power2.out' })
      tl.to(modalRef.current, { 
        scaleX: 1, 
        duration: 0.4, 
        ease: 'power4.inOut',
        opacity: 1,
      }, '-=0.1')
      tl.to(modalRef.current, { 
        scaleY: 1, 
        filter: 'blur(0px)', 
        duration: 0.5, 
        ease: 'expo.out' 
      }, '-=0.2')
      if (contentRef.current) {
        tl.fromTo(contentRef.current, 
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 
          '-=0.3'
        )
      }
    } else {
      // Exit Animation
      const tl = gsap.timeline({
        onComplete: () => {
          if (overlayRef.current) {
             gsap.set(overlayRef.current, { visibility: 'hidden', opacity: 0 })
          }
        }
      })

      tl.to(contentRef.current, { opacity: 0, y: -10, duration: 0.3 })
      tl.to(modalRef.current, { 
        scaleY: 0.01, 
        filter: 'blur(10px)', 
        duration: 0.4, 
        ease: 'power3.in' 
      })
      tl.to(modalRef.current, { scaleX: 0, opacity: 0, duration: 0.3, ease: 'power4.in' }, '-=0.1')
      tl.to(overlayRef.current, { opacity: 0, duration: 0.3 }, '-=0.2')
    }
  }, [isOpen])

  // Close on ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  return (
    <div 
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-background/80 backdrop-blur-sm px-6 invisible opacity-0"
      onClick={onClose}
    >
      <div 
        ref={modalRef}
        className="relative w-full max-w-lg bg-panel border border-primary/40 shadow-[0_0_40px_rgba(233,68,11,0.1)] rounded-sm overflow-hidden pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
        style={{ transformOrigin: 'center' }}
      >
        {/* HUD Corners */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-accent/60 z-10" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-accent/60 z-10" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-accent/60 z-10" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-accent/60 z-10" />

        {/* Scanline Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

        {/* Header Strip */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-primary/20 bg-primary/5 font-pixel text-[9px] tracking-widest text-accent uppercase z-10">
          <div className="flex items-center gap-4">
            <span className="opacity-60">[PROMPT_SESSION_L4]</span>
            <span className="animate-pulse">{title}</span>
          </div>
          <button 
            onClick={onClose}
            className="hover:bg-primary/20 bg-primary/10 px-2 py-0.5 transition-colors cursor-pointer text-[8px]"
          >
            [X] CLOSE
          </button>
        </div>

        {/* Content Area */}
        <div 
          ref={contentRef}
          className="relative z-10 p-6 pt-8 font-mono"
        >
          {children}
        </div>

        {/* Terminal Footer */}
        <div className="flex items-center justify-between px-6 py-4 bg-black/40 border-t border-primary/10 font-pixel text-[8px] text-muted-foreground uppercase z-10">
           <div className="flex items-center gap-2">
             <span>$ SEARCH_STATUS: LISTENING</span>
             <div className="w-1.5 h-3 bg-accent animate-[blink_1s_infinite]" />
           </div>
           <span>CRC: 0x82A1</span>
        </div>

        {/* Footer Accent */}
        <div className="h-0.5 bg-accent/20" />
      </div>
      <style jsx global>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}
