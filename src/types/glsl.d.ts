/* eslint-disable @typescript-eslint/no-explicit-any */
declare module '*.glsl' {
  const content: string
  export default content
}

declare module '*.frag' {
  const content: string
  export default content
}

declare module '*.vert' {
  const content: string
  export default content
}

declare module '*.vert?raw' {
  const content: string
  export default content
}

declare module '*.frag?raw' {
  const content: string
  export default content
}

import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      primitive: any
    }
  }
}

