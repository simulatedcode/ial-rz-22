import gsap from 'gsap'

/**
 * Global timeline registry for the WebGL and DOM transitions.
 * Allows components to register their own timelines that need to be
 * synchronized with the global sequence.
 */

type TransitionTimeline = gsap.core.Timeline

class GlobalTimelineRegistry {
  private static instance: GlobalTimelineRegistry
  private exitTimeline: TransitionTimeline | null = null
  private enterTimeline: TransitionTimeline | null = null

  private constructor() {
    // Hidden singleton
  }

  static getInstance() {
    if (!GlobalTimelineRegistry.instance) {
      GlobalTimelineRegistry.instance = new GlobalTimelineRegistry()
    }
    return GlobalTimelineRegistry.instance
  }

  createExitTimeline(onStart?: () => void, onComplete?: () => void) {
    if (this.exitTimeline) {
      this.exitTimeline.kill()
    }

    this.exitTimeline = gsap.timeline({
      paused: true,
      onStart,
      onComplete: () => {
        if (onComplete) onComplete()
        this.exitTimeline = null
      }
    })

    return this.exitTimeline
  }

  createEnterTimeline(onStart?: () => void, onComplete?: () => void) {
    if (this.enterTimeline) {
      this.enterTimeline.kill()
    }

    this.enterTimeline = gsap.timeline({
      paused: true,
      onStart,
      onComplete: () => {
        if (onComplete) onComplete()
        this.enterTimeline = null
      }
    })

    return this.enterTimeline
  }

  getExitTimeline() {
    return this.exitTimeline
  }

  getEnterTimeline() {
    return this.enterTimeline
  }
}

export const timelineRegistry = GlobalTimelineRegistry.getInstance()
