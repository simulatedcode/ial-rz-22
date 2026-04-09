import * as THREE from 'three'

/**
 * ANIMATION CONFIGURATION
 * Centralizes all keyframe values in one place
 */
export const CAMERA_CONFIG = {
  start: new THREE.Vector3(0, 0, 4.2),
  end: new THREE.Vector3(0.5, 0.2, 1.8),
  lookAtStart: new THREE.Vector3(0, 0, 0),
  lookAtEnd: new THREE.Vector3(0.33, 0.15, 0),
}

export const MODEL_CONFIG = {
  rotationStart: 0,
  rotationEnd: Math.PI * 0.15,
  yStart: -0.2, // Adjust as needed
  yEnd: -0.4,
  scanStart: 2.0,
  scanEnd: -2.0,
}

/**
 * PURE MAPPING FUNCTIONS
 * These should not have side effects. They take progress and return calculated values.
 */

export const getMappedCameraPosition = (scrollProgress: number, out: THREE.Vector3) => {
  out.lerpVectors(CAMERA_CONFIG.start, CAMERA_CONFIG.end, scrollProgress)
}

export const getMappedLookAt = (scrollProgress: number, out: THREE.Vector3) => {
  out.lerpVectors(CAMERA_CONFIG.lookAtStart, CAMERA_CONFIG.lookAtEnd, scrollProgress)
}

export const getMappedModelRotation = (scrollProgress: number, time: number) => {
  const baseRotation = MODEL_CONFIG.rotationStart + (MODEL_CONFIG.rotationEnd - MODEL_CONFIG.rotationStart) * scrollProgress
  const autoRotation = time * 0.15 // Consistent slow spin
  return baseRotation + autoRotation
}

export const getMappedModelY = (scrollProgress: number) => {
  return MODEL_CONFIG.yStart + (MODEL_CONFIG.yEnd - MODEL_CONFIG.yStart) * scrollProgress
}

export const getMappedScanPosition = (scrollProgress: number) => {
  return MODEL_CONFIG.scanStart + (MODEL_CONFIG.scanEnd - MODEL_CONFIG.scanStart) * scrollProgress
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
