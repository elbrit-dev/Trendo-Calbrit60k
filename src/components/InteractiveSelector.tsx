import { useState, type ComponentType, type SVGProps } from 'react'

export type SelectorPanel = {
  image: string
  alt: string
  title: string
  description: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

/**
 * Expanding-panels image selector for the Calbrit slides — horizontal on every
 * screen size. The active panel (tap on mobile, hover/click/focus on desktop)
 * grows wide and shows the FULL slide; the rest collapse to thin strips. Panels
 * sit flush, separated by thin dividers inside one rounded, bordered container.
 */
export default function InteractiveSelector({ panels }: { panels: SelectorPanel[] }) {
  const [active, setActive] = useState(0)

  return (
    <div className="flex h-[420px] w-full overflow-hidden rounded-2xl border border-navy-100 shadow-card sm:h-[520px] lg:h-[600px]">
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
            className="group relative h-full min-w-[2.5rem] overflow-hidden border-l border-navy-100 bg-white outline-none transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] first:border-l-0 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-azure-500 sm:min-w-[3rem]"
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
            <div className="absolute inset-x-2 bottom-2 flex items-end gap-2 sm:inset-x-3 sm:bottom-3">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-navy-900/85 text-white shadow ring-1 ring-white/20 backdrop-blur sm:h-9 sm:w-9">
                <p.Icon className="h-4 w-4 sm:h-5 sm:w-5" />
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
