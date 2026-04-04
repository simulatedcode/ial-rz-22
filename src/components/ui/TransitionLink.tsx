'use client'

import React from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useTransitionStore } from '@/store/useTransitionStore'

interface TransitionLinkProps {
  href: string
  children: React.ReactNode
  className?: string
}

export default function TransitionLink({ href, children, className }: TransitionLinkProps) {
  const router = useRouter()
  const pathname = usePathname()
  const startExit = useTransitionStore((state) => state.startExit)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()

    // If already on the page, do nothing
    if (pathname === href) return

    // Trigger exit animation in the store
    startExit(href)

    // The actual routing logic will be handled by a side-effect (likely in a Template or a TransitionWatcher)
    // or we can wait here. Let's make it more robust by letting the store 'exiting' state be watched.
    // However, for this implementation, we'll assume the TransitionController or Template will handle the timing.
    // Actually, a common pattern is to have a small delay here if we want to ensure animations start.
    // But better to just set the state and let the 'TransitionController' or 'Template' execute the push after animation.
  }

  return (
    <a href={href} onClick={handleClick} className={className}>
      {children}
    </a>
  )
}
