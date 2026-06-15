import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useReducedMotion } from 'framer-motion'

// Detect WebGL support once on mount (SSR-safe-ish; runs client only).
function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const canvas = document.createElement('canvas')
    return (
      !!window.WebGLRenderingContext &&
      !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

/**
 * Should we render the immersive 3D scenes?
 * No when the user prefers reduced motion or WebGL is unavailable —
 * those users get the lightweight 2D fallback instead.
 */
export function useShow3D(): boolean {
  const reduce = useReducedMotion()
  const [webgl, setWebgl] = useState(false)
  useEffect(() => {
    setWebgl(detectWebGL())
  }, [])
  return webgl && !reduce
}

/**
 * Tracks whether an element is near the viewport. Used to pause WebGL render
 * loops when a canvas scrolls off-screen (saves GPU/battery, esp. on mobile).
 * Initialises `true` so the first frame always paints.
 */
export function useInView<T extends HTMLElement>(rootMargin = '150px') {
  const ref = useRef<T>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { rootMargin })
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])
  return [ref, inView] as const
}

/** Mounts its children only once it scrolls near the viewport (saves GPU on load). */
export function LazyVisible({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin: '250px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className={className} aria-hidden>
      {show && children}
    </div>
  )
}
