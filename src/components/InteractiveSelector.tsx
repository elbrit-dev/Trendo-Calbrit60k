import { useState, type ComponentType, type SVGProps } from 'react'

export type SelectorPanel = {
  image: string
  alt: string
  title: string
  description: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

/**
 * Expanding-panels image selector: the active panel (hover/click/focus) grows
 * wide and shows the FULL slide (object-contain on a white card, so nothing is
 * cropped); the rest collapse to thin strips showing a slice + their icon.
 */
export default function InteractiveSelector({ panels }: { panels: SelectorPanel[] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex h-[440px] w-full gap-2 sm:h-[600px] sm:gap-3">
      {panels.map((p, i) => {
        const isActive = i === active
        return (
          <button
            key={p.title}
            type="button"
            onMouseEnter={() => setActive(i)}
            onFocus={() => setActive(i)}
            onClick={() => setActive(i)}
            aria-pressed={isActive}
            aria-label={p.title}
            className="group relative h-full min-w-[3rem] overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card outline-none transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] focus-visible:ring-2 focus-visible:ring-azure-500 focus-visible:ring-offset-2"
            style={{ flexGrow: isActive ? 3.6 : 1 }}
          >
            <img
              src={p.image}
              alt={p.alt}
              className={`absolute inset-0 h-full w-full transition-all duration-500 ${
                isActive ? 'object-contain p-2 sm:p-3' : 'object-cover'
              }`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden'
              }}
            />

            {/* Bottom label — compact dark pills so the slide stays visible */}
            <div className="absolute inset-x-3 bottom-3 flex items-end gap-2">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-navy-900/85 text-white shadow ring-1 ring-white/20 backdrop-blur">
                <p.Icon className="h-5 w-5" />
              </span>
              <span
                className={`min-w-0 rounded-lg bg-navy-900/85 px-3 py-1.5 text-white shadow backdrop-blur transition-all duration-300 ${
                  isActive ? 'translate-x-0 opacity-100 delay-150' : 'pointer-events-none -translate-x-2 opacity-0'
                }`}
              >
                <span className="block truncate text-sm font-semibold leading-tight">{p.title}</span>
                <span className="block truncate text-[11px] text-white/80">{p.description}</span>
              </span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
