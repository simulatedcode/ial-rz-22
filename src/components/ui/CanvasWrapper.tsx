'use client'

import dynamic from 'next/dynamic'

const CanvasRoot = dynamic(() => import('@/components/webgl/CanvasRoot'), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-[#050810]" />
})

export default function CanvasWrapper() {
  return <CanvasRoot />
}