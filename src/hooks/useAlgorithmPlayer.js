import { useEffect, useRef, useState, useMemo, useCallback } from 'react'

// This is the ONE place that turns a static array of algorithm "steps"
// into a live animation. Algorithms never touch the DOM or timers - they
// just hand back data. This hook owns the setInterval loop, play/pause/
// scrub/speed controls, and exposes the "current frame" for the canvas
// and panels to render.
export function useAlgorithmPlayer(steps, { intervalMs = 500 } = {}) {
  const [index, setIndex] = useState(-1) // -1 = nothing played yet
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState(intervalMs)
  const timerRef = useRef(null)

  const total = steps?.length || 0

  // Reset playback whenever a brand new steps array arrives.
  useEffect(() => {
    setIndex(total > 0 ? 0 : -1)
    setIsPlaying(total > 0)
  }, [steps])

  useEffect(() => {
    if (!isPlaying || total === 0) return undefined

    timerRef.current = setInterval(() => {
      setIndex((prev) => {
        if (prev >= total - 1) {
          setIsPlaying(false)
          return prev
        }
        return prev + 1
      })
    }, speed)

    return () => clearInterval(timerRef.current)
  }, [isPlaying, total, speed])

  const play = useCallback(() => {
    if (total === 0) return
    if (index >= total - 1) setIndex(0)
    setIsPlaying(true)
  }, [index, total])

  const pause = useCallback(() => setIsPlaying(false), [])

  const reset = useCallback(() => {
    setIsPlaying(false)
    setIndex(total > 0 ? 0 : -1)
  }, [total])

  const stepForward = useCallback(() => {
    setIsPlaying(false)
    setIndex((prev) => Math.min(prev + 1, total - 1))
  }, [total])

  const stepBack = useCallback(() => {
    setIsPlaying(false)
    setIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const frame = useMemo(() => (index >= 0 && steps ? steps[index] : null), [index, steps])

  const log = useMemo(() => {
    if (!steps || index < 0) return []
    return steps.slice(0, index + 1).map((s) => s.message)
  }, [steps, index])

  return {
    frame,
    index,
    total,
    isPlaying,
    isFinished: total > 0 && index >= total - 1,
    play,
    pause,
    reset,
    stepForward,
    stepBack,
    log,
    speed,
    setSpeed,
  }
}
