import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { SelectorPanel } from './InteractiveSelector'
import { Close, ArrowRight } from './Icons'

/**
 * 3D circular (cylinder) gallery — the Calbrit slides arranged around a ring in
 * perspective. Drag / swipe to rotate; it auto-rotates slowly when idle. Click
 * a card (without dragging) to open a full-size lightbox carousel that pops in
 * with a 3D effect.
 */
export default function CircularGallery({ panels }: { panels: SelectorPanel[] }) {
  const [rotation, setRotation] = useState(0)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const draggingRef = useRef(false)
  const pointerDownRef = useRef(false)
  const interactingRef = useRef(false)
  const lastXRef = useRef(0)
  const movedRef = useRef(0)
  const downTimeRef = useRef(0)
  const rafRef = useRef<number | null>(null)
  const idleTimerRef = useRef<number | null>(null)
  const reduceRef = useRef(false)
  const lbStartX = useRef(0)

  const count = panels.length
  const anglePer = 360 / count

  useEffect(() => {
    reduceRef.current = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
  }, [])

  // Gentle auto-rotation while idle (paused while a lightbox is open).
  useEffect(() => {
    const tick = () => {
      if (!draggingRef.current && !interactingRef.current && !reduceRef.current && lightbox === null) {
        setRotation((r) => r + 0.12)
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [lightbox])

  // Keep the front-facing panel's index in sync.
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
    pointerDownRef.current = true
    draggingRef.current = false
    movedRef.current = 0
    downTimeRef.current = Date.now()
    lastXRef.current = e.clientX
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointerDownRef.current) return
    const dx = e.clientX - lastXRef.current
    lastXRef.current = e.clientX
    movedRef.current += Math.abs(dx)
    // Only a real drag (movement) takes over rotation — a still press/long-press
    // leaves the gallery circulating on its own.
    if (movedRef.current > 6) draggingRef.current = true
    if (draggingRef.current) {
      pauseAuto()
      setRotation((r) => r + dx * 0.45)
    }
  }
  const onPointerUp = () => {
    pointerDownRef.current = false
    if (draggingRef.current) {
      draggingRef.current = false
      pauseAuto()
    }
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

  const lbPrev = () => setLightbox((i) => (i === null ? i : (i - 1 + count) % count))
  const lbNext = () => setLightbox((i) => (i === null ? i : (i + 1) % count))

  // Keyboard controls + scroll lock while the lightbox is open.
  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      else if (e.key === 'ArrowLeft') lbPrev()
      else if (e.key === 'ArrowRight') lbNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, count])

  return (
    <div className="w-full">
      <div
        className="relative mx-auto flex touch-pan-y items-center justify-center"
        style={{ perspective: '2200px' }}
      >
        <div
          className="relative h-[340px] w-[230px] [--radius:230px] sm:h-[420px] sm:w-[300px] sm:[--radius:330px]"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateY(${rotation}deg)`,
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
            const opacity = Math.max(0.45, 1 - norm / 220)
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
                <button
                  type="button"
                  // Open only on a real click: negligible drag AND a quick press
                  // (a long-press or drag must not open the lightbox).
                  onClick={() => {
                    if (movedRef.current < 8 && Date.now() - downTimeRef.current < 300) {
                      setLightbox(i)
                    }
                  }}
                  aria-label={`Enlarge ${p.title}`}
                  className="block h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card outline-none focus-visible:ring-2 focus-visible:ring-azure-500"
                >
                  <img
                    src={p.image}
                    alt={p.alt}
                    className="absolute inset-0 h-full w-full object-cover"
                    draggable={false}
                    decoding="async"
                    onError={(e) => {
                      e.currentTarget.style.visibility = 'hidden'
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/85 via-navy-900/40 to-transparent p-4 text-left text-white">
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
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Hint + dot navigation */}
      <div className="mt-6 flex flex-col items-center gap-3">
        <p className="text-[11px] font-medium uppercase tracking-wider text-navy-400">
          Drag to rotate · click to enlarge
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

      {/* Lightbox carousel — pops in with a 3D effect */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            key="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-950/90 p-4 backdrop-blur-sm"
            style={{ perspective: '1400px' }}
            role="dialog"
            aria-modal="true"
            aria-label={panels[lightbox].title}
            onClick={() => setLightbox(null)}
          >
            <button
              type="button"
              onClick={() => setLightbox(null)}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <Close className="h-6 w-6" />
            </button>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                lbPrev()
              }}
              aria-label="Previous"
              className="absolute left-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:left-6"
            >
              <ArrowRight className="h-6 w-6 rotate-180" />
            </button>

            <motion.figure
              key={lightbox}
              initial={{ rotateX: -22, rotateY: 10, scale: 0.82, opacity: 0 }}
              animate={{ rotateX: 0, rotateY: 0, scale: 1, opacity: 1 }}
              exit={{ rotateX: 14, scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 220, damping: 22 }}
              className="flex max-h-[90vh] max-w-3xl flex-col items-center"
              style={{ transformStyle: 'preserve-3d' }}
              onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => {
                lbStartX.current = e.clientX
              }}
              onPointerUp={(e) => {
                const dx = e.clientX - lbStartX.current
                if (dx > 50) lbPrev()
                else if (dx < -50) lbNext()
              }}
            >
              <img
                src={panels[lightbox].image}
                alt={panels[lightbox].alt}
                className="max-h-[78vh] w-auto max-w-full select-none rounded-xl bg-white object-contain shadow-2xl"
                draggable={false}
              />
              <figcaption className="mt-4 text-center text-white">
                <p className="text-base font-semibold">{panels[lightbox].title}</p>
                <p className="text-sm text-white/70">{panels[lightbox].description}</p>
                <p className="mt-1 text-xs text-white/50">
                  {lightbox + 1} / {count}
                </p>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                lbNext()
              }}
              aria-label="Next"
              className="absolute right-3 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 sm:right-6"
            >
              <ArrowRight className="h-6 w-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
