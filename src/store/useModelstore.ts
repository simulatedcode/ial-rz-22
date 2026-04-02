import { create } from 'zustand'
import * as THREE from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'

type PCDData = {
  positions: Float32Array
  colors: Float32Array
  count: number
}

type ModelStore = {
  pcd: PCDData | null
  isReady: boolean
  loadPCD: () => void
}

export const useModelStore = create<ModelStore>((set, get) => ({
  pcd: null,
  isReady: false,

  loadPCD: () => {
    // 🔥 prevent double load
    if (get().pcd) return

    const loader = new PCDLoader()

    loader.load('/model/sample.pcd', (points) => {
      const posAttr = points.geometry.getAttribute('position')
      const colAttr = points.geometry.getAttribute('color')

      const positions = posAttr.array as Float32Array
      
      let colors: Float32Array
      if (colAttr) {
        colors = colAttr.array as Float32Array
      } else {
        // Fallback color #9BBEC0 ≈ (0.6078, 0.7451, 0.7529)
        colors = new Float32Array(posAttr.count * 3)
        for (let i = 0; i < posAttr.count; i++) {
          colors[i * 3] = 0.6078
          colors[i * 3 + 1] = 0.7451
          colors[i * 3 + 2] = 0.7529
        }
      }

      set({
        pcd: { positions, colors, count: posAttr.count },
        isReady: true,
      })
    })
  },
}))
