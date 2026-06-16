import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { calbrit } from '../data/calbrit'
import { useShow3D } from '../three/util'
import { Zap, Atom2, Droplet, Calendar, ArrowRight, Check, Sparkles, Beaker } from './Icons'
import { type SelectorPanel } from './InteractiveSelector'
import CircularGallery from './CircularGallery'

const NanoCanvas = lazy(() => import('../three/NanoCanvas'))

const STAT_ICONS = [Zap, Atom2, Droplet, Calendar]

// The 5 Calbrit 60K slides (public/assets/6–10.png), shown in the gallery.
const CALBRIT_PANELS: SelectorPanel[] = [
  {
    image: '/assets/6.png',
    alt: 'Calbrit 60K — Cholecalciferol Chewable Tablets 60,000 IU',
    title: 'Calbrit 60K',
    description: 'Cholecalciferol Chewable Tablets 60,000 IU',
    Icon: Sparkles,
  },
  {
    image: '/assets/7.png',
    alt: 'Nano in a convenient chewable form — powered by HydroX',
    title: 'Nano in a Chewable Form',
    description: 'Convenient nano Vitamin D3',
    Icon: Atom2,
  },
  {
    image: '/assets/8.png',
    alt: 'What is HydroX — a nanoparticle delivery system',
    title: 'The HydroX Platform',
    description: 'A nanoparticle delivery system',
    Icon: Beaker,
  },
  {
    image: '/assets/10.png',
    alt: 'Nanotechnology vs conventional D3 — bioavailability advantage',
    title: 'Nano vs Conventional D3',
    description: '+36% AUC · +43% Cmax over softgels',
    Icon: Zap,
  },
  {
    image: '/assets/9.png',
    alt: 'Particle size comparison and absorption of Calbrit 60K',
    title: 'Particle Size & Absorption',
    description: '~157 nm · rapid dispersion',
    Icon: Droplet,
  },
]

export default function Calbrit60K() {
  const reduce = useReducedMotion()
  const show3D = useShow3D()

  const reveal = (delay = 0) => ({
    initial: reduce ? false : { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-80px' },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section
      id="calbrit"
      className="relative overflow-hidden bg-gradient-to-b from-white via-azure-50/50 to-white"
    >
      <div className="mx-auto max-w-content px-5 py-16 sm:px-8 lg:px-12 xl:px-20 lg:py-24">
        {/* Eyebrow */}
        <motion.div {...reveal()} className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber60k-500 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white shadow-sm">
            <Sparkle />
            Conference Launch Highlight
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-azure-700">
            New at TRENDO 2026
          </span>
        </motion.div>

        {/* Hero of the section */}
        <div className="mt-8 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
          <div>
            <motion.img
              {...reveal(0.05)}
              src="/assets/calbrit-60k-logo.jpg"
              alt="Calbrit 60K"
              className="h-auto w-60 sm:w-72 lg:w-80"
            />
            <motion.p {...reveal(0.1)} className="mt-4 text-lg font-medium text-navy-800">
              {calbrit.molecule} · {calbrit.form}
            </motion.p>
            <motion.p {...reveal(0.13)} className="mt-1 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-azure-700">
              <Atom2 className="h-4 w-4" /> Powered by the {calbrit.platform}
            </motion.p>
            <motion.p {...reveal(0.16)} className="mt-5 max-w-xl text-lg leading-relaxed text-navy-600">
              {calbrit.intro}
            </motion.p>

            {/* Stat tiles */}
            <motion.dl {...reveal(0.2)} className="mt-8 grid grid-cols-2 gap-3">
              {calbrit.stats.map((s, i) => {
                const Icon = STAT_ICONS[i] ?? Zap
                return (
                  <div
                    key={s.label}
                    className="rounded-2xl border border-azure-100 bg-white p-4 shadow-card"
                  >
                    <Icon className="h-5 w-5 text-azure-600" />
                    <dd className="mt-2 text-xl font-bold text-navy-900">{s.value}</dd>
                    <dt className="text-sm font-medium text-navy-700">{s.label}</dt>
                    <p className="mt-0.5 text-xs text-navy-400">{s.sub}</p>
                  </div>
                )
              })}
            </motion.dl>

            <motion.div {...reveal(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#register"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-azure-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-azure-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus-visible:ring-offset-2"
              >
                Reserve a Calbrit 60K detailing
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#calbrit-evidence"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-6 py-3.5 text-base font-semibold text-navy-800 transition hover:border-azure-300 hover:text-azure-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus-visible:ring-offset-2"
              >
                See the evidence
              </a>
            </motion.div>
          </div>

          {/* 3D nanoparticle / image fallback */}
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative mx-auto aspect-square w-full max-w-md lg:max-w-none"
          >
            {show3D ? (
              <Suspense
                fallback={
                  <img
                    src="/assets/calbrit-card-1.png"
                    alt="Calbrit 60K — the next step in Vitamin D3 absorption"
                    className="h-full w-full rounded-3xl object-cover shadow-card"
                    loading="lazy"
                    decoding="async"
                  />
                }
              >
                <NanoCanvas />
              </Suspense>
            ) : (
              <img
                src="/assets/calbrit-card-1.png"
                alt="Calbrit 60K — the next step in Vitamin D3 absorption"
                className="h-full w-full rounded-3xl object-cover shadow-card"
                loading="lazy"
                decoding="async"
              />
            )}
            {show3D && (
              <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-white/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-azure-700 backdrop-blur">
                HydroX nanoparticle · ~157 nm
              </p>
            )}
          </motion.div>
        </div>

        {/* Real product visuals from Canva — 3D circular gallery */}
        <motion.div {...reveal()} className="mt-14">
          <CircularGallery panels={CALBRIT_PANELS} />
        </motion.div>

        {/* HydroX explainer + particle comparison */}
        <div className="mt-14 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <motion.div {...reveal()}>
            <h3 className="text-2xl font-semibold text-navy-900">How the HydroX platform works</h3>
            <p className="mt-4 text-[15px] leading-relaxed text-navy-600">{calbrit.hydrox}</p>
            <ul className="mt-5 grid grid-cols-2 gap-2">
              {calbrit.highlights.map((h) => (
                <li key={h} className="flex items-center gap-2 text-sm font-medium text-navy-700">
                  <Check className="h-4 w-4 flex-none text-sage-600" />
                  {h}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            {...reveal(0.1)}
            className="rounded-3xl border border-azure-100 bg-white p-6 shadow-card sm:p-8"
          >
            <p className="text-xs font-semibold uppercase tracking-wider text-navy-400">
              Particle size comparison
            </p>
            <div className="mt-5 space-y-5">
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-medium text-navy-700">
                    {calbrit.particle.conventional.label}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-navy-500">
                    {calbrit.particle.conventional.size}
                  </span>
                </div>
                <div className="mt-2 h-3 w-full rounded-full bg-navy-100">
                  <div className="h-3 w-full rounded-full bg-navy-300" />
                </div>
                <p className="mt-1 text-xs text-navy-400">{calbrit.particle.conventional.desc}</p>
              </div>
              <div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm font-semibold text-azure-700">
                    {calbrit.particle.calbrit.label}
                  </span>
                  <span className="font-mono text-sm tabular-nums text-azure-700">
                    {calbrit.particle.calbrit.size}
                  </span>
                </div>
                <div className="mt-2 h-3 w-full rounded-full bg-azure-50">
                  <div className="h-3 w-[6%] min-w-[12px] rounded-full bg-azure-500" />
                </div>
                <p className="mt-1 text-xs text-navy-400">{calbrit.particle.calbrit.desc}</p>
              </div>
            </div>
            <p className="mt-5 rounded-lg bg-azure-50 px-3 py-2 text-xs font-medium text-azure-800">
              {calbrit.context.stat} {calbrit.context.label}. {calbrit.context.note}
            </p>
          </motion.div>
        </div>

        {/* Clinical evidence band */}
        <motion.div
          {...reveal()}
          id="calbrit-evidence"
          className="mt-14 overflow-hidden rounded-3xl bg-navy-900 p-7 text-white sm:p-10"
        >
          <p className="text-xs font-semibold uppercase tracking-wider text-azure-300">
            Clinical evidence
          </p>
          <h3 className="mt-2 text-2xl font-semibold sm:text-3xl">{calbrit.clinical.headline}</h3>
          <p className="mt-1 text-sm text-navy-200">{calbrit.clinical.design}</p>

          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {calbrit.clinical.metrics.map((m) => (
              <div key={m.label} className="rounded-2xl border border-navy-700 bg-navy-800/60 p-6">
                <p className="font-serif text-5xl font-semibold text-azure-300">{m.value}</p>
                <p className="mt-2 text-base font-medium text-white">{m.label}</p>
                <p className="text-sm text-navy-300">{m.sub}</p>
              </div>
            ))}
          </div>

          <p className="mt-7 max-w-3xl text-[15px] leading-relaxed text-navy-100">
            {calbrit.clinical.adherence}
          </p>
          <p className="mt-5 border-t border-navy-700 pt-4 text-xs leading-relaxed text-navy-400">
            {calbrit.clinical.reference}
          </p>
        </motion.div>

        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-navy-400">
          For registered healthcare professionals. Product information is presented factually to the
          molecule and the company's cited references; it is not prescribing advice or dosing
          guidance.
        </p>
      </div>
    </section>
  )
}

// Tiny inline sparkle used in the launch badge (kept local to avoid icon import churn)
function Sparkle() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 2l1.8 5.2L19 9l-5.2 1.8L12 16l-1.8-5.2L5 9l5.2-1.8L12 2z" />
    </svg>
  )
}
