# WebGL Shader Pipeline

This document covers the shader pipeline architecture and how to maintain/edit the effects.

## Architecture Overview

The project uses **postprocessing** library with React Three Fiber to create a custom shader pipeline:

```
SignalProcessor → TernaryPass → Output
```

### Pipeline Flow

1. **SignalProcessor** (`src/components/webgl/SignalProcessor.tsx`)
   - Reads scene color
   - Computes luminance
   - Encodes signal (-1 to 1 range)
   - Packs signal to alpha channel (0 to 1)
   - Preserves original RGB color

2. **TernaryPass** (`src/components/webgl/TernaryPass.tsx`)
   - Reads signal from alpha channel
   - Unpacks signal back to -1 to 1
   - Applies ternary threshold (-1, 0, +1)
   - Modulates brightness based on ternary value
   - Outputs final color

## File Structure

```
src/
├── shaders/
│   ├── signal-processor.ts   # Signal encoding shader
│   └── ternary-pass.ts       # Ternary effect shader
├── components/webgl/
│   ├── SignalProcessor.tsx   # Effect wrapper
│   ├── TernaryPass.tsx       # Effect wrapper
│   └── CanvasRoot.tsx        # EffectComposer setup
```

## How to Edit

### 1. Editing SignalProcessor Shader

Edit `src/shaders/signal-processor.ts`:

```typescript
export const signalProcessorShader = `
precision highp float;

// Uniforms available:
// uniform vec2 uResolution;
// uniform float uTime;

// Functions:
float luminance(vec3 color) { ... }
float encodeSignal(float lum) { ... }
float packSignal(float signal) { ... }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // inputColor.rgb - original scene color
    // inputColor.a   - alpha channel
    
    // outputColor.rgb - final color (passed to next effect)
    // outputColor.a   - signal value (passed to next effect)
}
`
```

**Key functions:**
- `luminance(color)` - computes perceptual luminance using standard weights
- `encodeSignal(lum)` - converts luminance to signal range (-1 to 1)
- `packSignal(signal)` - packs signal to alpha range (0 to 1)

**To change color encoding:**
```glsl
// In mainImage, modify before assigning to outputColor:
float lum = luminance(col);

// Custom encoding:
float signal = (lum - 0.5) * 2.0;  // basic
signal = tanh(signal * 1.2);       // with contrast
signal = pow(signal, 0.8);         // with gamma

float packed = packSignal(signal);
```

### 2. Editing TernaryPass Shader

Edit `src/shaders/ternary-pass.ts`:

```typescript
export const ternaryPassShader = `
precision highp float;

// Uniforms available:
// uniform float uThreshold;  // ternary threshold (default 0.15)
// uniform int uDebug;      // debug mode (0 or 1)

float unpackSignal(float v) { ... }
float toTernary(float x, float threshold) { ... }

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // inputColor.rgb - color from SignalProcessor
    // inputColor.a   - signal from SignalProcessor
    
    // Output modulation happens here
}
`
```

**Key functions:**
- `unpackSignal(v)` - converts alpha (0-1) back to signal (-1 to 1)
- `toTernary(x, threshold)` - applies threshold to get -1, 0, or +1

**To change ternary threshold:**
- Pass `threshold` prop to `<TernaryPass />` in CanvasRoot.tsx
- Default: `0.15` (values below threshold become 0)

**To change brightness modulation:**
```glsl
// Find this line in ternary-pass.ts:
col *= (1.0 + signedT * 0.15);

// Adjust 0.15 to change modulation strength:
// 0.0   = no modulation
// 0.15  = subtle (default)
// 0.30  = moderate
// 0.50  = strong
```

**To change contrast boost:**
```glsl
// Find this line:
col = pow(col, vec3(1.05));

// Adjust 1.05 to change contrast:
// 1.0   = no change
// 1.05  = subtle (default)
// 1.10  = more contrast
// 0.95  = reduce contrast
```

### 3. Debug Mode

Enable debug visualization:

1. In CanvasRoot.tsx, add `debug={1}` to TernaryPass:
```tsx
<TernaryPass threshold={0.15} debug={1} />
```

Debug colors:
- **Red**: positive signal (+1)
- **Green**: any active signal (not 0)
- **Blue**: negative signal (-1)

### 4. Adding New Uniforms

**In shader file:**
```glsl
uniform float uMyCustomValue;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // Use uMyCustomValue
    col *= uMyCustomValue;
}
```

**In component:**
```tsx
class MyEffect extends Effect {
  constructor({ myCustomValue = 1.0 }: { myCustomValue?: number } = {}) {
    super('MyEffect', shaderString, {
      uniforms: new Map([
        ['uMyCustomValue', new Uniform(myCustomValue)],
      ]),
    })
  }
}
```

**In React component:**
```tsx
interface MyPassProps {
  myCustomValue?: number
}

export const MyPass = forwardRef<MyEffect, MyPassProps>(
  ({ myCustomValue = 1.0 }, ref) => {
    const effect = useMemo(() => {
      return new MyEffect({ myCustomValue })
    }, [myCustomValue])

    return <primitive ref={ref} object={effect} dispose={null} />
  }
)
```

### 5. Adding New Effect to Pipeline

1. Create shader file in `src/shaders/`
2. Create component in `src/components/webgl/`
3. Add to EffectComposer in CanvasRoot.tsx

Example:
```tsx
// src/components/webgl/CanvasRoot.tsx
import { EffectComposer } from '@react-three/postprocessing'
import { SignalProcessor } from './SignalProcessor'
import { TernaryPass } from './TernaryPass'
import { MyNewPass } from './MyNewPass'

<EffectComposer>
  <SignalProcessor />
  <TernaryPass />
  <MyNewPass />
</EffectComposer>
```

## Common Modifications

### Change Luminance Weights
```glsl
// In signal-processor.ts
float luminance(vec3 color) {
    // Custom weights
    return dot(color, vec3(0.2126, 0.7152, 0.0722));  // BT.709
    // return dot(color, vec3(0.30, 0.59, 0.11));     // BT.601
}
```

### Invert Signal Direction
```glsl
// Before: positive signal = brighter
// After:  positive signal = darker
col *= (1.0 - signedT * 0.15);
```

### Add Color Tint
```glsl
// In ternary-pass.ts, before outputColor:
col = mix(col, col * vec3(1.2, 0.8, 1.0), abs(signedT));
```

### Disable Signal Processor (Passthrough)
```glsl
// In signal-processor.ts - keep original alpha
outputColor = inputColor;
```

### Adjust Signal Strength
```glsl
// In signal-processor.ts
float encodeSignal(float lum) {
    float signal = (lum - 0.5) * 2.0;
    signal = tanh(signal * 2.0);  // stronger contrast
    // or
    signal = tanh(signal * 0.5);  // weaker contrast
    return signal;
}
```

## Testing Changes

1. Run dev server:
   ```bash
   npm run dev
   ```

2. Open browser at `http://localhost:3000`

3. Make changes to shader files - hot reload should work

4. For debug mode, modify CanvasRoot.tsx:
   ```tsx
   <TernaryPass threshold={0.15} debug={1} />
   ```

## Troubleshooting

**Issue: Color looks wrong**
- Check signal is in alpha channel (not RGB)
- Verify TernaryPass reads from `inputColor.a`

**Issue: Effect not applying**
- Ensure effect is in EffectComposer
- Check uniform values are being passed

**Issue: Build errors**
- Ensure shader exports are template literals with backticks
- Check TypeScript is happy with imports
