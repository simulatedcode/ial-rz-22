'use client'

import { useState, useEffect, useMemo } from 'react'

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
  const [mounted, setMounted] = useState(false)
  const [time, setTime] = useState('--:--')
  const [utc, setUtc] = useState('UTC+0')

  const coords = useMemo(() => 
    `${formatCoordinate(SITE_CONFIG.latitude, 'lat')}, ${formatCoordinate(SITE_CONFIG.longitude, 'lng')}`,
  [])

  useEffect(() => {
    setMounted(true)
    
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', {
        timeZone: SITE_CONFIG.timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      }))
      setUtc(`UTC${now.getTimezoneOffset() <= 0 ? '+' : '-'}${Math.abs(Math.floor(now.getTimezoneOffset() / 60))}`)
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between mx-auto max-w-full px-4 sm:px-8 md:px-12 lg:px-22 py-6 sm:py-8 md:py-10 lg:py-14">
        <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">PROJECT XYZ</div>
        <div className='hidden sm:flex items-center gap-1 font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground'>
          <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"><path fill="currentColor" d="M22 9V7h-1V5h-1V4h-1V3h-2V2h-2V1H9v1H7v1H5v1H4v1H3v2H2v2H1v7h1v1h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1V9zm-1 1v4h-3v-4zm-5-6h1v1h2v2h1v1h-3V5h-1zm-2 14v2h-1v1h-2v-1h-1v-2H9v-2h6v2zm2-8v4H8v-4zM9 6h1V4h1V3h2v1h1v2h1v2H9zM4 7h1V5h2V4h1v1H7v3H4zm-1 7v-4h3v4zm2 5v-2H4v-1h3v3h1v1H7v-1zm14-2v2h-2v1h-1v-1h1v-3h3v1z"></path></svg>
          {coords}
        </div>
        <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">
          {SITE_CONFIG.location}, --:-- UTC+0
        </div>
      </div>
    )
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between mx-auto max-w-full px-4 sm:px-8 md:px-12 lg:px-22 py-6 sm:py-8 md:py-10 lg:py-14">
      <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">PROJECT XYZ</div>
      <div className='hidden sm:flex items-center gap-1 font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground'>
        <svg xmlns="http://www.w3.org/2000/svg" width={14} height={14} viewBox="0 0 24 24"><path fill="currentColor" d="M22 9V7h-1V5h-1V4h-1V3h-2V2h-2V1H9v1H7v1H5v1H4v1H3v2H2v2H1v7h1v1h1v2h1v1h1v1h2v1h2v1h6v-1h2v-1h2v-1h1v-1h1v-2h1v-2h1V9zm-1 1v4h-3v-4zm-5-6h1v1h2v2h1v1h-3V5h-1zm-2 14v2h-1v1h-2v-1h-1v-2H9v-2h6v2zm2-8v4H8v-4zM9 6h1V4h1V3h2v1h1v2h1v2H9zM4 7h1V5h2V4h1v1H7v3H4zm-1 7v-4h3v4zm2 5v-2H4v-1h3v3h1v1H7v-1zm14-2v2h-2v1h-1v-1h1v-3h3v1z"></path></svg>
        {coords}
      </div>
      <div className="font-pixel text-[10px] sm:text-xs tracking-widest text-muted-foreground">
        {SITE_CONFIG.location}, {time} {utc}
      </div>
    </div>
  )
}
