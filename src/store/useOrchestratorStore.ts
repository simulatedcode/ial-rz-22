import { create } from 'zustand'

interface OrchestratorState {
  // Normalized progress values (0 to 1)
  scrollProgress: number
  transitionProgress: number
  
  // Actions
  setScrollProgress: (progress: number) => void
  setTransitionProgress: (progress: number) => void
}

export const useOrchestratorStore = create<OrchestratorState>((set) => ({
  scrollProgress: 0,
  transitionProgress: 0,

  setScrollProgress: (scrollProgress) => {
    set({ scrollProgress })
  },
  
  setTransitionProgress: (transitionProgress) => {
    set({ transitionProgress })
  },
}))
