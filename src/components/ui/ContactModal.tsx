'use client'

import React, { useEffect, useRef } from 'react'
import HUDModal from './HUDModal'
import gsap from 'gsap'

interface ContactModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const contactData = [
    { cmd: 'fetch --email', label: 'EMAIL', value: 'loskepetos@gmail.com', link: 'mailto:loskepetos@gmail.com' },
    { cmd: 'fetch --linkedin', label: 'INSTAGRAM', value: 'linkedin.com/in/riza', link: 'https://linkedin.com/in/riza' },
    { cmd: 'fetch --location', label: 'LOCATION', value: 'YOGYAKARTA, ID', link: '#' },
    { cmd: 'sys --status', label: 'STATUS', value: 'OPERATIONAL', link: '#' },
  ]

  useEffect(() => {
    if (isOpen && containerRef.current) {
      const lines = containerRef.current.querySelectorAll('.terminal-line')
      gsap.fromTo(lines, 
        { opacity: 0, x: -10 },
        { 
          opacity: 1, 
          x: 0, 
          stagger: 0.1, 
          duration: 0.4, 
          ease: 'power2.out',
          delay: 0.5 
        }
      )
    }
  }, [isOpen])

  return (
    <HUDModal isOpen={isOpen} onClose={onClose} title="SESSION: GUEST_ACCESS">
      <div ref={containerRef} className="space-y-6 text-foreground/90 leading-relaxed max-w-full overflow-hidden">
        
        {/* Terminal Header Info */}
        <div className="terminal-line space-y-1">
          <p className="text-accent font-pixel text-[10px]">INITIALIZING_HANDSHAKE...</p>
          <div className="flex gap-4 text-[9px] text-muted-foreground uppercase">
            <span>ID: 0x93FF42</span>
            <span>IP: 127.0.0.1</span>
            <span>PORT: 8080</span>
          </div>
          <div className="h-px w-full bg-primary/20" />
        </div>

        {/* Auth Log */}
        <div className="terminal-line bg-primary/5 p-3 border-l-2 border-primary/40">
          <p className="text-[10px] text-primary mb-1">AUTH_LOG:</p>
          <p className="text-[9px] opacity-70">
            [OK] Fingerprint confirmed...<br />
            [OK] Accessing restricted data node...<br />
            [OK] Decryption complete.
          </p>
        </div>

        {/* Command List (Links) */}
        <div className="space-y-4 pt-2">
          {contactData.map((item, idx) => (
            <div key={idx} className="terminal-line group flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <span className="text-accent font-pixel text-[10px] shrink-0 whitespace-nowrap">
                guest@ial-xyz:~$ {item.cmd}
              </span>
              <a 
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 bg-white/5 hover:bg-accent/20 px-3 py-1.5 border border-white/10 hover:border-accent/40 transition-all duration-300 w-full sm:w-auto"
              >
                <span className="text-[9px] text-muted-foreground">{item.label}:</span>
                <span className="text-[11px] font-pixel group-hover:text-white">{item.value}</span>
                <svg className="w-3 h-3 opacity-40 group-hover:opacity-100 group-hover:translate-x-1 transition-all" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3m-2 16H5V5h7V3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7h-2z" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* ASCII/Status Separator */}
        <div className="terminal-line flex justify-center py-4 opacity-40">
           <pre className="text-[6px] leading-none font-mono whitespace-pre text-primary">
{` +---------------------------------+
 | [ ACCESS_KEY: V-04-99-A ]       |
 | [ SECURE_TUNNEL: ENABLED ]      |
 +---------------------------------+`}
           </pre>
        </div>

        {/* Final Prompt */}
        <div className="terminal-line flex items-center gap-2 pt-2 text-[10px] font-pixel text-accent/60">
          <span>guest@ial-xyz:~$</span>
          <div className="w-2 h-4 bg-accent animate-pulse" />
        </div>

      </div>
    </HUDModal>
  )
}
