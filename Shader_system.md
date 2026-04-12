Alright—this is the **real deal**: a production-style **AI skill agent** that builds an shader UI system* (not just code, but a system your project can evolve around).

---

# 🤖 AI Skill Agent: `IAL_SHADER_SYSTEM`

## 🎯 Mission

Transform any web app into a:

> **Shader-first interactive experience**
> (fullscreen GPU UI + minimal DOM + adaptive performance)

---

# 🧠 Agent Core Philosophy

```txt id="philosophy01"
- GPU renders the experience
- DOM is only for interaction + semantics
- State flows into shader via uniforms
- Performance is always adaptive
```

---

# 🧩 1. System Architecture

```txt id="arch01"
App
 ├── ShaderEngine (WebGL / R3F)
 │    ├── Fullscreen Quad
 │    ├── ShaderMaterial
 │    └── Uniform Controller
 │
 ├── Interaction Layer
 │    ├── Mouse → uMouse
 │    ├── Scroll → uScroll
 │    ├── Time → uTime
 │
 ├── UI Layer (DOM)
 │    └── Minimal overlay (text, links)
 │
 └── Performance Manager
      └── Adaptive quality scaling
```

---

# ⚙️ 2. Agent Responsibilities

## 🔥 A. Initialize Shader System

```txt id="resp01"
- Create fullscreen shader renderer
- Remove heavy geometry
- Ensure 1 draw call baseline
```

---

## 🎮 B. Convert Inputs → Uniforms

```txt id="resp02"
mouse → vec2 uMouse
scroll → float uScroll
time → float uTime
resolution → vec2 uResolution
```

---

## 🧠 C. Manage Visual State

```txt id="resp03"
- All transitions must be shader-driven
- Avoid DOM animations
- Use interpolation inside shader
```

---

## ⚡ D. Adaptive Performance

```txt id="resp04"
If FPS < 40:
  - reduce shader complexity
  - disable noise
  - reduce iterations

If FPS < 25:
  - fallback to CSS CRT mode
```

---

# 🧱 3. Implementation (R3F Production Setup)

## 🎯 A. Shader Engine

```tsx id="engine01"
'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

function ShaderPlane() {
  const mat = useRef()

  useFrame((state) => {
    mat.current.uTime = state.clock.elapsedTime
    mat.current.uMouse = state.mouse
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        uniforms={{
          uTime: { value: 0 },
          uMouse: { value: new THREE.Vector2() },
          uScroll: { value: 0 },
          uResolution: {
            value: new THREE.Vector2(window.innerWidth, window.innerHeight)
          }
        }}
        fragmentShader={fragmentShader}
      />
    </mesh>
  )
}

export function ShaderEngine() {
  return (
    <Canvas>
      <ShaderPlane />
    </Canvas>
  )
}
```

---

## 🎯 B. Base Fragment Shader (ial-style foundation)

```glsl id="shader01"
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform vec2 uResolution;

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;

  // center space
  vec2 p = uv - 0.5;

  // wave distortion
  float wave = sin(p.x * 10.0 + uTime) * 0.1;

  // mouse influence
  float d = length(p - uMouse * 0.5);
  float glow = 0.02 / d;

  vec3 color = vec3(0.0);

  color += vec3(0.1, 0.8, 0.5) * wave;
  color += glow;

  gl_FragColor = vec4(color, 1.0);
}
```

---

## 🎯 C. UI Overlay Layer

```tsx id="ui01"
export function UIOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <h1 className="text-white text-4xl p-6">
        IAL SYSTEM
      </h1>
    </div>
  )
}
```

---

## 🎯 D. App Composition

```tsx id="app01"
export default function App() {
  return (
    <div className="w-screen h-screen relative">
      <ShaderEngine />
      <UIOverlay />
    </div>
  )
}
```

---

# 🧠 4. Interaction System (IMPORTANT)

## 🖱️ Mouse → smooth uniform

```ts id="interaction01"
const mouse = new THREE.Vector2()

window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX / window.innerWidth
  mouse.y = 1 - e.clientY / window.innerHeight
})
```

---

## 📜 Scroll → shader storytelling

```ts id="scroll01"
window.addEventListener('scroll', () => {
  shaderRef.current.uScroll = window.scrollY
})
```

---

# ⚡ 5. Performance Manager

```ts id="perf01"
let fps = 60

function monitorFPS() {
  let last = performance.now()

  function loop() {
    const now = performance.now()
    fps = 1000 / (now - last)
    last = now

    if (fps < 30) downgrade()

    requestAnimationFrame(loop)
  }

  loop()
}

function downgrade() {
  shaderRef.current.uQuality = 0.5
}
```

---

# 🧠 6. Quality Levels (CRITICAL)

```glsl id="quality01"
uniform float uQuality;

// high
if (uQuality > 0.8) {
  // full noise + glow
}

// medium
if (uQuality > 0.5) {
  // reduced effects
}

// low
if (uQuality < 0.5) {
  // minimal rendering
}
```

---

# 🔥 7. Agent Behaviors

## 🧩 When adding new section

```txt id="behavior01"
- Do NOT create new DOM animations
- Extend shader logic instead
```

---

## 🧩 When performance drops

```txt id="behavior02"
- Reduce shader branches
- Remove expensive math (sin, noise)
- Lower resolution if needed
```

---

## 🧩 When user interacts

```txt id="behavior03"
- Convert interaction → uniform
- Never trigger re-render of DOM
```

---

# 🚀 8. What you get (like ial.xyz)

After this system:

✅ GPU-driven UI
✅ Smooth 60 FPS (if optimized)
✅ Minimal DOM
✅ Shader-based storytelling
✅ Easy to extend

---

# 💡 9. How this fits YOUR project

Right now you have:

* GLTF
* postprocessing
* heavy pipeline

👉 Replace homepage with this system

👉 Load 3D **only when needed**

---

# 🔥 If you want next level

I can extend this into:

### 1. 🧠 Shader Router System

* each section = different shader mode

### 2. 🎬 GSAP → Shader Timeline Bridge

* timeline drives uniforms

### 3. 🧩 Node-based shader builder (AI-assisted)

Just say:
👉 **build shader router**
