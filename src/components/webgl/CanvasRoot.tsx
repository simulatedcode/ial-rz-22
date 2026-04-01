'use client'

import { Canvas } from '@react-three/fiber'
import { EffectComposer } from '@react-three/postprocessing'

import { SignalProcessor } from './SignalProcessor'
import { TernaryPass } from './TernaryPass'

export default function CanvasRoot() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      {/* 🔹 Scene */}
      <color attach="background" args={['#071213']} />
      <ambientLight intensity={1} />

      <mesh>
        <planeGeometry args={[2, 2]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* 🔥 PIPELINE */}
      <EffectComposer>

        {/* Stage 1 */}
        <SignalProcessor />

        {/* Stage 2 */}
        <TernaryPass
          threshold={0.25}
          debug={1}
        />

      </EffectComposer>
    </Canvas>
  )
}
