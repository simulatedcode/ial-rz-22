'use client'

import { useState, useEffect, useSyncExternalStore } from 'react'
import TransitionLink from '@/components/ui/TransitionLink'
import InformationModal from '@/components/ui/Contact/InformationModal'

const SITE_CONFIG = {
  location: 'YK',
  timezone: 'Asia/Jakarta',
}

export default function Header() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  )
  const [time, setTime] = useState('--:--')
  const [isInformationOpen, setIsInformationOpen] = useState(false)
  const utc = 'UTC+7'

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', {
        timeZone: SITE_CONFIG.timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
      }))
    }

    updateTime()
    const interval = setInterval(updateTime, 10000)

    return () => clearInterval(interval)
  }, [])

  const layoutClasses = 'fixed top-0 left-0 right-0 z-100 flex items-center justify-between mx-auto max-w-full px-8 py-8'

  if (!mounted) {
    return (
      <div className={layoutClasses}>
        <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">
          <TransitionLink href="/" className="text-muted-foreground hover:text-accent transition-colors">PRZOJECT XYZ</TransitionLink>
        </div>
        <nav className="hidden md:flex items-center gap-6 font-pixel text-[10px] sm:text-xs tracking-widest uppercase">
          <TransitionLink href="/history" className="text-muted-foreground hover:text-accent transition-colors">Data History</TransitionLink>
        </nav>
        <button
          onClick={() => setIsInformationOpen(true)}
          className='hidden sm:flex items-center font-pixel text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-all duration-300 cursor-pointer'
        >
          INFORMATION
        </button>
        <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">
          {SITE_CONFIG.location}, --:-- {utc}
        </div>
      </div>
    )
  }

  return (
    <div className={layoutClasses}>
      <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">
        <TransitionLink href="/" className="text-muted-foreground hover:text-accent transition-colors">PRZOJECT XYZ</TransitionLink>
      </div>
      <nav className="hidden md:flex items-center gap-6 font-pixel text-[10px] sm:text-xs tracking-widest uppercase">
        <TransitionLink href="/history" className="text-muted-foreground hover:text-accent transition-colors">Data History</TransitionLink>
      </nav>
      <button
        onClick={() => setIsInformationOpen(true)}
        className='hidden sm:flex items-center font-pixel text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-all duration-300 cursor-pointer'
      >
        INFORMATION
      </button>

      <InformationModal
        isOpen={isInformationOpen}
        onClose={() => setIsInformationOpen(false)}
      />
      <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">
        {SITE_CONFIG.location}, {time} {utc}
      </div>
    </div>
  )
}
