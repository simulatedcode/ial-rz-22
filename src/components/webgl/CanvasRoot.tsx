'use client'

import { Canvas } from '@react-three/fiber'
import Effects from '@/graphics/passed/Effects'
import Scene from './Scene'

export default function CanvasRoot() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <color attach="background" args={['#000']} />

      {/* Example content */}
      <Scene />
      <ambientLight intensity={1} />

      {/* CRT applied globally */}
      <Effects />
    </Canvas>
  )
}
