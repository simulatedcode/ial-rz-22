# Agent Guidelines for ial-xyz

## Project Overview

This is a Next.js 16.2.1 application with React 19, TypeScript, and Three.js/React Three Fiber for WebGL graphics. The project uses Tailwind CSS 4 for styling and Zustand for state management.

## Build Commands

```bash
# Development server (includes turbopack)
npm run dev

# Production build
npm run build

# Start production server
npm run start

# Lint code
npm run lint

# Run a single test (if testing framework is added)
# No test framework currently configured
```

## Dependencies

- **React**: 19.2.4
- **Next.js**: 16.2.1
- **Three.js**: 0.183.2 (@react-three/fiber, @react-three/drei, @react-three/postprocessing)
- **Styling**: Tailwind CSS 4 with @tailwindcss/postcss
- **State**: Zustand 5.0.12
- **Animation**: GSAP 3.14.2 with ScrollTrigger
- **Scroll**: Lenis 1.3.21

## Code Style Guidelines

### TypeScript

- Strict mode enabled in `tsconfig.json`
- Use explicit return types for functions when not obvious
- Use `interface` for object shapes, `type` for unions/intersections
- Enable strict null checks - always handle null/undefined

### Naming Conventions

- **Components**: PascalCase (e.g., `HomeFilter.tsx`, `CanvasRoot.tsx`)
- **Files**: kebab-case for utilities, PascalCase for components
- **CSS Modules**: component-name.module.css
- **Directories**: lowercase (e.g., `components/ui/`, `lib/`)
- **Constants**: SCREAMING_SNAKE_CASE
- **Interfaces**: PascalCase with `I` prefix optional (prefer descriptive names like `UserConfig`)

### Import Organization

Order imports as:
1. Node built-ins (path, crypto, etc.)
2. External libraries (next, react, three, gsap, zustand)
3. Alias imports (@/...)
4. Relative imports (../, ./)
5. Type imports (import type)

```typescript
import { useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { useStore } from '@/lib/store'
import type { ComponentProps } from '@/types'
import Header from '@/components/ui/Header'
```

### Path Aliases

Use `@/` prefix for imports from `src/`:
```typescript
import { HomeFilter } from '@/components/ui/HomeFilter'
import { gsap } from '@/lib/gsap'
```

The alias is configured in `tsconfig.json`:
```json
"paths": { "@/*": ["*"] }
```

### React/Next Patterns

- Use `'use client'` directive for client-side components
- Use Next.js App Router conventions (server components by default)
- Extract client logic to separate components when needed
- Use `tsx` for files containing JSX, `ts` for pure TypeScript

### Error Handling

- Use try/catch for async operations
- Handle errors gracefully with user feedback
- Log errors appropriately for debugging
- Type error boundaries explicitly

### CSS/Styling

- Use Tailwind CSS utility classes in components
- Use CSS Modules for component-specific styles (`*.module.css`)
- Follow Tailwind 4 configuration (CSS-first config in `globals.css`)
- Use CSS custom properties for theme values

### WebGL/GLSL

- GLSL files use type declarations in `src/types/glsl.d.ts`
- Webpack handles `.glsl`, `.vert`, `.frag` files as asset/source
- Use React Three Fiber patterns for 3D components
- Keep WebGL logic isolated in `components/webgl/` directory

### Linting

- ESLint configured with `eslint-config-next` (core-web-vitals, typescript)
- Run `npm run lint` before committing
- ESLint config: `eslint.config.mjs`

### File Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── page.tsx
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/           # UI components
│   └── webgl/        # Three.js/React Three Fiber components
├── lib/              # Utilities and libraries (gsap.ts, store.ts)
└── types/            # TypeScript type declarations
```

### Common Issues to Avoid

- Do not use `any` type - use `unknown` and narrow appropriately
- Avoid inline styles - use Tailwind classes or CSS modules
- Don't forget to handle loading states for async operations
- Use proper TypeScript strictness (no implicit any)

### Testing

- No test framework currently configured
- Consider adding Vitest or Jest if tests are needed
- Follow existing component patterns when adding tests

### Git Conventions

- Use meaningful commit messages
- Keep commits atomic and focused
- Run lint before pushing