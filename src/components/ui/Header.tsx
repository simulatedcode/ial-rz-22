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

  const layoutClasses = 'fixed inset-x-0 top-0 z-100 mx-auto max-w-full px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-8'
  const gridClasses = 'grid grid-cols-12 items-start gap-x-4 gap-y-2 sm:items-center sm:gap-y-3'
  const textClasses = 'font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground'
  const linkClasses = 'text-muted-foreground hover:text-accent transition-colors'
  const infoButtonClasses = 'inline-flex items-center font-pixel text-[10px] sm:text-xs tracking-widest uppercase text-muted-foreground hover:text-accent transition-all duration-300 cursor-pointer'
  const mobileNavClasses = 'inline-flex items-center font-pixel text-[10px] tracking-widest uppercase text-muted-foreground transition-colors hover:text-accent'
  const displayTime = mounted ? time : '--:--'

  return (
    <div className={layoutClasses}>
      <div className={gridClasses}>
        <div className={`col-span-12 sm:col-span-4 md:col-span-3 text-left ${textClasses}`}>
          <TransitionLink href="/" className={linkClasses}>PRZOJECT XYZ</TransitionLink>
        </div>

        <nav className="col-span-12 flex flex-col items-start gap-2 sm:hidden">
          <TransitionLink href="/history" className={mobileNavClasses}>Data History</TransitionLink>
        </nav>

        <nav className="hidden md:flex md:col-span-3 items-center justify-center gap-6 font-pixel text-[10px] sm:text-xs tracking-widest uppercase">
          <TransitionLink href="/history" className={linkClasses}>Data History</TransitionLink>
        </nav>

        <button
          onClick={() => setIsInformationOpen(true)}
          className={`col-span-12 sm:col-span-4 md:col-span-3 justify-self-start md:justify-self-center text-left ${infoButtonClasses}`}
        >
          INFORMATION
        </button>

        <div className={`col-span-12 sm:col-span-4 md:col-span-3 justify-self-start text-left md:justify-self-end md:text-right ${textClasses}`}>
          {SITE_CONFIG.location}, {displayTime} {utc}
        </div>

        <InformationModal
          isOpen={isInformationOpen}
          onClose={() => setIsInformationOpen(false)}
        />
      </div>
    </div>
  )
}
