import { create } from 'zustand'
import * as THREE from 'three'
import { PCDLoader } from 'three/examples/jsm/loaders/PCDLoader.js'

type PCDData = {
  positions: THREE.Vector3[]
  colors: THREE.Color[]
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
      const positions: THREE.Vector3[] = []
      const colors: THREE.Color[] = []

      const posAttr = points.geometry.getAttribute('position')
      const colAttr = points.geometry.getAttribute('color')

      for (let i = 0; i < posAttr.count; i++) {
        positions.push(
          new THREE.Vector3(
            posAttr.getX(i),
            posAttr.getY(i),
            posAttr.getZ(i)
          )
        )

        if (colAttr) {
          colors.push(
            new THREE.Color(
              colAttr.getX(i),
              colAttr.getY(i),
              colAttr.getZ(i)
            )
          )
        } else {
          colors.push(new THREE.Color('#9BBEC0'))
        }
      }

      set({
        pcd: { positions, colors },
        isReady: true,
      })
    })
  },
}))
