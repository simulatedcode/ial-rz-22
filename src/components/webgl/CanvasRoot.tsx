'use client'

import { Canvas } from '@react-three/fiber'
import Scene from './Scene'

export default function CanvasRoot() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <color attach="background" args={['#000']} />
      <ambientLight intensity={1} />
    </Canvas>
  )
}
