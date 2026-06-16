import { useEffect, useRef, useState } from 'react'
import type { SelectorPanel } from './InteractiveSelector'

/**
 * 3D circular (cylinder) gallery — the Calbrit slides arranged around a ring in
 * perspective. Drag / swipe to rotate; it auto-rotates slowly when idle.
 * Works on touch and mouse. Inspired by ravikatiyar162/circular-gallery, but
 * driven by pointer drag instead of page scroll so it doesn't spin the gallery
 * as the rest of the page scrolls.
 */
export default function CircularGallery({ panels }: { panels: SelectorPanel[] }) {
  const [rotation, setRotation] = useState(0)
  const [active, setActive] = useState(0)
  const draggingRef = useRef(false)
  const interactingRef = useRef(false)
  const lastXRef = useRef(0)
  const movedRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const idleTimerRef = useRef<number | null>(null)
  const reduceRef = useRef(false)

  const count = panels.length
  const anglePer = 360 / count

  useEffect(() => {
    reduceRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  // Gentle auto-rotation while idle.
  useEffect(() => {
    const tick = () => {
      if (!draggingRef.current && !interactingRef.current && !reduceRef.current) {
        setRotation((r) => r + 0.12)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  // Keep the front-facing panel's index in sync for the caption.
  useEffect(() => {
    const norm = ((-rotation / anglePer) % count + count) % count
    setActive(Math.round(norm) % count)
  }, [rotation, anglePer, count])

  const pauseAuto = () => {
    interactingRef.current = true
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current)
    idleTimerRef.current = window.setTimeout(() => {
      interactingRef.current = false
    }, 3000)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    movedRef.current = 0
    lastXRef.current = e.clientX
    pauseAuto()
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return
    const dx = e.clientX - lastXRef.current
    lastXRef.current = e.clientX
    movedRef.current += Math.abs(dx)
    setRotation((r) => r + dx * 0.45)
  }
  const onPointerUp = () => {
    draggingRef.current = false
    pauseAuto()
  }

  const goTo = (i: number) => {
    pauseAuto()
    // Rotate so panel i faces front, taking the shortest path.
    setRotation((r) => {
      const target = -i * anglePer
      const diff = ((target - r) % 360 + 540) % 360 - 180
      return r + diff
    })
  }

  return (
    <div className="w-full">
      <div
        className="relative mx-auto flex touch-pan-y items-center justify-center"
        style={{ perspective: '1600px' }}
      >
        <div
          className="relative h-[340px] w-[230px] cursor-grab [--radius:230px] active:cursor-grabbing sm:h-[420px] sm:w-[300px] sm:[--radius:330px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
            willChange: 'transform',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {panels.map((p, i) => {
            const itemAngle = i * anglePer
            const rel = (((itemAngle + rotation) % 360) + 360) % 360
            const norm = rel > 180 ? 360 - rel : rel
            const opacity = Math.max(0.22, 1 - norm / 170)
            const isFront = norm < anglePer / 2
            return (
              <div
                key={p.image}
                role="group"
                aria-label={p.title}
                className="absolute inset-0"
                style={{
                  transform: `rotateY(${itemAngle}deg) translateZ(var(--radius))`,
                  opacity,
                  transition: draggingRef.current ? 'none' : 'opacity 0.3s linear',
                }}
              >
                <div className="relative h-full w-full overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card">
                  <img
                    src={p.image}
                    alt={p.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden'
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/85 via-navy-900/40 to-transparent p-4 text-white">
                    <div className="flex items-center gap-2">
                      <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25 backdrop-blur">
                        <p.Icon className="h-4 w-4" />
                      </span>
                      <span className="block truncate text-sm font-semibold leading-tight">
                        {p.title}
                      </span>
                    </div>
                    <p
                      className={`mt-1 truncate text-[11px] text-white/85 transition-opacity ${
                        isFront ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {p.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hint + dot navigation */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-navy-400">
          Drag to rotate
        </p>
        <div className="flex items-center gap-2">
          {panels.map((p, i) => (
            <button
              key={p.image}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Show ${p.title}`}
              aria-pressed={i === active}
              className={`h-2.5 rounded-full transition-all ${
                i === active ? 'w-6 bg-azure-600' : 'w-2.5 bg-navy-200 hover:bg-navy-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
