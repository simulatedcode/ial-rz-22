import { create } from 'zustand'

interface ShaderState {
  quality: number
  mouse: { x: number; y: number }
  
  setQuality: (quality: number) => void
  setMouse: (x: number, y: number) => void
}

export const useShaderStore = create<ShaderState>((set) => ({
  quality: 1.0,
  mouse: { x: 0, y: 0 },
  
  setQuality: (quality) => {
    set({ quality })
  },
  
  setMouse: (x, y) => {
    set({ mouse: { x, y } })
  },
}))
