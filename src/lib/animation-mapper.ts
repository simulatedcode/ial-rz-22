import * as THREE from 'three'

/**
 * ANIMATION CONFIGURATION
 * Centralizes all keyframe values in one place
 */

// Explicit scroll progress breakpoints for each section due to uneven physical scrolling distance.
// Section 1: Hero (progress 0.0)
// Section 2: Info (progress 0.333)
// Section 3: Pmem (progress 1.0)
export const PROGRESS_BREAKPOINTS = [0.0, 0.333, 1.0];

export const CAMERA_CONFIG = {
  // Waypoints for [Section 1, Section 2, Section 3]
  points: [
    new THREE.Vector3(0, 0, 4.2),  // Section 1: Hero
    new THREE.Vector3(0, 0, 1.6),  // Section 2: Info
    new THREE.Vector3(0, 0, 0.85),  // Section 3: Pmem (Zoom relatively close)
  ],
  lookAt: [
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(0, 0, 0),
  ]
}

export const MODEL_CONFIG = {
  rotation: [0, Math.PI * 0.15, Math.PI * 0.3], // Keep rotating
  x: [0, -0.3, 0], // Center -> Left -> Center
  y: [0, -0.6, -0.85], // Center -> Down -> Pulled down
  scan: [2.0, -2.0, -2.0], // Scan down, then stay out of view
}

// Helper to interpolate array of numbers with exact progress breakpoints + smooth easing
function lerpArray(arr: number[], progress: number): number {
  if (arr.length === 0) return 0;
  if (arr.length === 1) return arr[0];

  let i = 0;
  while (i < PROGRESS_BREAKPOINTS.length - 1 && progress > PROGRESS_BREAKPOINTS[i + 1]) {
    i++;
  }

  if (i >= arr.length - 1) return arr[arr.length - 1];
  if (progress <= PROGRESS_BREAKPOINTS[0]) return arr[0];

  const p0 = PROGRESS_BREAKPOINTS[i];
  const p1 = PROGRESS_BREAKPOINTS[i + 1];
  let t = (progress - p0) / (p1 - p0);

  // Smoothstep easing to prevent sharp direction changes ("bouncing")
  t = t * t * (3 - 2 * t);

  return arr[i] + (arr[i + 1] - arr[i]) * t;
}

// Helper to interpolate array of Vector3 with exact progress breakpoints + smooth easing
function lerpVectorArray(arr: THREE.Vector3[], progress: number, out: THREE.Vector3) {
  if (arr.length === 0) return;
  if (arr.length === 1) {
    out.copy(arr[0]);
    return;
  }

  let i = 0;
  while (i < PROGRESS_BREAKPOINTS.length - 1 && progress > PROGRESS_BREAKPOINTS[i + 1]) {
    i++;
  }

  if (i >= arr.length - 1) {
    out.copy(arr[arr.length - 1]);
    return;
  }
  if (progress <= PROGRESS_BREAKPOINTS[0]) {
    out.copy(arr[0]);
    return;
  }

  const p0 = PROGRESS_BREAKPOINTS[i];
  const p1 = PROGRESS_BREAKPOINTS[i + 1];
  let t = (progress - p0) / (p1 - p0);

  // Smoothstep easing to prevent sharp direction changes ("bouncing")
  t = t * t * (3 - 2 * t);

  out.lerpVectors(arr[i], arr[i + 1], t);
}

/**
 * PURE MAPPING FUNCTIONS
 * These should not have side effects. They take progress and return calculated values.
 */

export const getMappedCameraPosition = (scrollProgress: number, out: THREE.Vector3) => {
  lerpVectorArray(CAMERA_CONFIG.points, scrollProgress, out);
}

export const getMappedLookAt = (scrollProgress: number, out: THREE.Vector3) => {
  lerpVectorArray(CAMERA_CONFIG.lookAt, scrollProgress, out);
}

export const getMappedModelRotation = (scrollProgress: number, time: number) => {
  const baseRotation = lerpArray(MODEL_CONFIG.rotation, scrollProgress);
  const autoRotation = time * 0.15 // Consistent slow spin
  return baseRotation + autoRotation
}

export const getMappedModelY = (scrollProgress: number) => {
  return lerpArray(MODEL_CONFIG.y, scrollProgress);
}

export const getMappedModelX = (scrollProgress: number) => {
  return lerpArray(MODEL_CONFIG.x, scrollProgress);
}

export const getMappedScanPosition = (scrollProgress: number) => {
  return lerpArray(MODEL_CONFIG.scan, scrollProgress);
}

/**
 * TRANSITION MAPPING
 */
export const getTransitionUniforms = (transitionProgress: number, phase: 'entering' | 'exiting' | 'idle') => {
  if (phase === 'exiting') {
    return 0.15 + (0.85 - 0.15) * transitionProgress
  }
  if (phase === 'entering') {
    return 0.85 - (0.85 - 0.15) * transitionProgress
  }
  return 0.15
}

export const getMappedMaterialProps = (transitionProgress: number, phase: 'entering' | 'exiting' | 'idle', isGlass: boolean) => {
  if (phase === 'exiting') {
    if (isGlass) {
      return {
        transmission: 1.0 - transitionProgress,
        roughness: 0.05 + (0.6 - 0.05) * transitionProgress,
      }
    } else {
      return {
        emissiveIntensity: 0.5 + (6.0 - 0.5) * transitionProgress,
        opacity: 1.0 - transitionProgress,
      }
    }
  }

  if (phase === 'entering') {
    if (isGlass) {
      return {
        transmission: transitionProgress,
        roughness: 0.6 - (0.6 - 0.05) * transitionProgress,
      }
    } else {
      return {
        emissiveIntensity: 1.0 - 0.5 * transitionProgress,
        opacity: transitionProgress,
      }
    }
  }

  // Idle state
  return isGlass
    ? { transmission: 1.0, roughness: 0.05 }
    : { emissiveIntensity: 0.5, opacity: 1.0 }
}
