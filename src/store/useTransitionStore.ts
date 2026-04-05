import { create } from 'zustand'

export type TransitionPhase = 'idle' | 'exiting' | 'entering'

interface TransitionState {
  phase: TransitionPhase
  targetRoute: string | null
  
  // Actions
  startExit: (targetRoute: string) => void
  startEnter: () => void
  setIdle: () => void
}

export const useTransitionStore = create<TransitionState>((set) => ({
  phase: 'idle',
  targetRoute: null,

  startExit: (targetRoute: string) => set({ phase: 'exiting', targetRoute }),
  startEnter: () => set({ phase: 'entering', targetRoute: null }),
  setIdle: () => set({ phase: 'idle', targetRoute: null }),
}))
