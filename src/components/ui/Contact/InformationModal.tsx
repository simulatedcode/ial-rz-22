'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import HUDModal from './HUDModal'

interface InformationModalProps {
  isOpen: boolean
  onClose: () => void
}

const ARTIST_INFORMATION = [
  {
    label: 'PROFILE',
    value: 'PRZOJECT XYZ / DIGITAL FIELD NOTES',
  },
  {
    label: 'BASE',
    value: 'YOGYAKARTA, INDONESIA',
  },
  {
    label: 'FOCUS',
    value: 'WEB EXPERIMENTS, MOTION, INTERACTION SYSTEMS',
  },
  {
    label: 'STATUS',
    value: 'ARCHIVE OPEN FOR EXPLORATION',
  },
]

const CONTACT_INFORMATION = [
  {
    label: 'EMAIL',
    value: 'loskepetos@gmail.com',
  },
  {
    label: 'INSTAGRAM',
    value: '@keppett',
  },
  {
    label: 'LOCATION',
    value: 'YOGYAKARTA, INDONESIA',
  },
  {
    label: 'COORDINATES',
    value: '-7.7549, 110.2909',
  },
]

export default function InformationModal({ isOpen, onClose }: InformationModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const lines = containerRef.current.querySelectorAll('.terminal-line')
      gsap.fromTo(
        lines,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          stagger: 0.08,
          duration: 0.45,
          ease: 'power2.out',
          delay: 0.35,
        }
      )
    }
  }, [isOpen])

  return (
    <HUDModal
      isOpen={isOpen}
      onClose={onClose}
      title="SESSION: INFORMATION"
      modalClassName="w-full mx-auto"
    >
      <div ref={containerRef} className="flex h-full flex-col justify-between gap-6 text-foreground/90">
        <div className="terminal-line grid h-full gap-4 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="flex h-full flex-col gap-4 border border-primary/15 bg-primary/5 p-5">
            <div className="space-y-2 border-b border-primary/10 pb-4">
              <p className="font-pixel text-[10px] text-accent">ARTIST_INFORMATION / PUBLIC_CHANNEL</p>
              <p className="max-w-xl text-[11px] leading-relaxed text-muted-foreground">
                A compact overview of the archive, its current position in culture, and the type of work driving this system.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {ARTIST_INFORMATION.map((item) => (
                <div key={item.label} className="terminal-line border border-primary/15 bg-black/20 p-4">
                  <p className="mb-2 font-pixel text-[9px] tracking-widest text-accent/80">{item.label}</p>
                  <p className="text-[11px] leading-relaxed text-foreground/90">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="terminal-line mt-auto border border-white/10 bg-black/20 p-4">
              <p className="mb-2 font-pixel text-[9px] tracking-widest text-primary">READOUT</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Built as a living portfolio: part archive, part interface experiment, part transmission log. Each section is meant to feel like a discovered artifact rather than a static page.
              </p>
            </div>
          </section>

          <section className="flex h-full flex-col gap-4 border border-primary/15 bg-black/20 p-5">
            <div className="space-y-2 border-b border-primary/10 pb-4">
              <p className="font-pixel text-[10px] text-accent">CONTACT_INFORMATION / SIGNAL_MAP</p>
              <p className="text-[11px] leading-relaxed text-muted-foreground">
                Direct channels, geographic anchor, and coordinate readout for the current transmission point.
              </p>
            </div>

            <div className="space-y-3">
              {CONTACT_INFORMATION.map((item) => (
                <div key={item.label} className="terminal-line border border-white/10 bg-primary/5 p-4">
                  <p className="mb-2 font-pixel text-[9px] tracking-widest text-primary">{item.label}</p>
                  <p className="text-[11px] leading-relaxed text-foreground/90">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="terminal-line mt-auto border border-primary/15 bg-primary/5 p-4">
              <p className="mb-2 font-pixel text-[9px] tracking-widest text-primary">CHANNELS</p>
              <div className="space-y-1 text-[10px] text-muted-foreground">
                <p>HISTORY / documented outputs</p>
                <p>WEBGL / spatial interactions</p>
                <p>MOTION / responsive transitions</p>
              </div>
            </div>
          </section>
        </div>

        <div className="terminal-line flex items-center justify-between border-t border-primary/10 pt-3 font-pixel text-[9px] uppercase text-accent/60">
          <span>guest@przoject-xyz:~$ info --open</span>
        </div>
      </div>
    </HUDModal>
  )
}
