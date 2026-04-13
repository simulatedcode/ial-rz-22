'use client'

import { useOrchestratorStore } from '@/store/useOrchestratorStore'

export default function TimelineControl() {
  const { scrollProgress, transitionProgress, setScrollProgress, setTransitionProgress } = useOrchestratorStore()

  return (
    <div className="flex flex-col gap-4 p-3 border-b border-primary/20 bg-black/40 backdrop-blur-md">
      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-tighter text-muted-foreground">
          <span>Scroll Timeline</span>
          <span className="text-primary">{(scrollProgress * 100).toFixed(1)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={scrollProgress}
          onChange={(e) => setScrollProgress(parseFloat(e.target.value))}
          className="w-full accent-primary h-1 bg-white/10 rounded-none cursor-crosshair"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex justify-between items-center text-[10px] uppercase tracking-tighter text-muted-foreground">
          <span>Transition Phase</span>
          <span className="text-flame-500">{(transitionProgress * 100).toFixed(1)}%</span>
        </div>
        <input
          type="range"
          min="0"
          max="1"
          step="0.001"
          value={transitionProgress}
          onChange={(e) => setTransitionProgress(parseFloat(e.target.value))}
          className="w-full accent-flame-500 h-1 bg-white/10 rounded-none cursor-crosshair"
        />
      </div>
    </div>
  )
}
