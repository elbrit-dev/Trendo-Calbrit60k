import { useState, type ComponentType, type SVGProps } from 'react'

export type SelectorPanel = {
  image: string
  alt: string
  title: string
  description: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
}

/**
 * Responsive image selector for the Calbrit slides.
 *
 * - Mobile (<sm): a vertical stack of full-width cards. Each slide is shown in
 *   full (object-contain) with its label beneath — no hover required, nothing
 *   squashed into unreadable slivers.
 * - sm+: the expanding-panels interaction — the active panel (hover/click/focus)
 *   grows wide and shows the FULL slide; the rest collapse to thin strips.
 */
export default function InteractiveSelector({ panels }: { panels: SelectorPanel[] }) {
  const [active, setActive] = useState(0)

  return (
    <>
      {/* Mobile + tablet: stacked full-width cards */}
      <div className="flex flex-col gap-4 lg:hidden">
        {panels.map((p) => (
          <div
            key={p.title}
            className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card"
          >
            <div className="relative w-full bg-white">
              <img
                src={p.image}
                alt={p.alt}
                className="h-auto w-full object-contain"
                loading="lazy"
                decoding="async"
                onError={(e) => {
                  e.currentTarget.style.visibility = 'hidden'
                }}
              />
            </div>
            <div className="flex items-center gap-3 border-t border-navy-100 px-4 py-3">
              <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-navy-900 text-white">
                <p.Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold leading-tight text-navy-900">
                  {p.title}
                </span>
                <span className="block text-xs text-navy-500">{p.description}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* lg+: expanding-panels selector (desktop only) */}
      <div className="hidden h-[600px] w-full gap-3 lg:flex">
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
                  isActive ? 'object-contain p-3' : 'object-cover'
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
    </>
  )
}
