'use client'

import { useState, useEffect, useMemo, useSyncExternalStore } from 'react'
import TransitionLink from '@/components/ui/TransitionLink'
import ContactModal from '@/components/ui/Contact/ContactModal'

const SITE_CONFIG = {
  location: 'YK',
  timezone: 'Asia/Jakarta',
  latitude: -7.7549,
  longitude: 110.2909,
}

function formatCoordinate(value: number, type: 'lat' | 'lng'): string {
  const direction = type === 'lat' ? (value >= 0 ? 'N' : 'S') : (value >= 0 ? 'E' : 'W')
  return `${Math.abs(value).toFixed(4)}°${direction}`
}

export default function Header() {
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false
  )
  const [time, setTime] = useState('--:--')
  const [isContactOpen, setIsContactOpen] = useState(false)
  const utc = 'UTC+7'

  const coords = useMemo(() =>
    `${formatCoordinate(SITE_CONFIG.latitude, 'lat')}, ${formatCoordinate(SITE_CONFIG.longitude, 'lng')}`,
    [])

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
          onClick={() => setIsContactOpen(true)}
          className='hidden sm:flex items-center gap-2 font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground hover:text-accent transition-all duration-300 group cursor-pointer'
        >
          <div className="relative">
            <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"><path fill="currentColor" d="M22 9V7h-1V5h-1V4h-1V3h-2V2h-2V1H9v1H7v1H5v1H4v1H3v2H2v2H1v7h1v1h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1V9zm-1 1v4h-3v-4zm-5-6h1v1h2v2h1v1h-3V5h-1zm-2 14v2h-1v1h-2v-1h-1v-2H9v-2h6v2zm2-8v4H8v-4zM9 6h1V4h1V3h2v1h1v2h1v2H9zM4 7h1V5h2V4h1v1H7v3H4zm-1 7v-4h3v4zm2 5v-2H4v-1h3v3h1v1H7v-1zm14-2v2h-2v1h-1v-1h1v-3h3v1z"></path></svg>
            <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          {coords}
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
        onClick={() => setIsContactOpen(true)}
        className='hidden sm:flex items-center gap-2 font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground hover:text-accent transition-all duration-300 group cursor-pointer'
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"><path fill="currentColor" d="M22 9V7h-1V5h-1V4h-1V3h-2V2h-2V1H9v1H7v1H5v1H4v1H3v2H2v2H1v7h1v1h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1V9zm-1 1v4h-3v-4zm-5-6h1v1h2v2h1v1h-3V5h-1zm-2 14v2h-1v1h-2v-1h-1v-2H9v-2h6v2zm2-8v4H8v-4zM9 6h1V4h1V3h2v1h1v2h1v2H9zM4 7h1V5h2V4h1v1H7v3H4zm-1 7v-4h3v4zm2 5v-2H4v-1h3v3h1v1H7v-1zm14-2v2h-2v1h-1v-1h1v-3h3v1z"></path></svg>
          <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-primary rounded-full animate-pulse opacity-100 transition-opacity" />
        </div>
        {coords}
      </button>

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">
        {SITE_CONFIG.location}, {time} {utc}
      </div>
    </div>
  )
}
