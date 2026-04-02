import { Suspense } from 'react'
import Model from './Hero3D/Model'
export default function MainScene() {
  return (
    <group>
      <Suspense fallback={null}>
        <Model />
      </Suspense>
    </group>
  )
}
