import { motion, useReducedMotion } from 'framer-motion'
import { site } from '../data/site'
import { ArrowRight } from './Icons'
import ParticleTextEffect, { type ParticleFrame } from './ParticleTextEffect'

const INDIA_IMG = '/assets/india-map-country-svgrepo-com.svg'

const HERO_FRAMES: ParticleFrame[] = [
  { kind: 'text', value: 'A pan-India', color: 'navy' },
  { kind: 'text', value: 'Celebrating 12 Years', color: 'marine' },
  { kind: 'image', src: INDIA_IMG, color: 'marine' },
]

export default function Hero() {
  const reduce = useReducedMotion()

  const fadeUp = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <section id="top" className="relative overflow-hidden bg-white">
      <div className="mx-auto grid max-w-content items-center gap-12 px-5 pb-16 pt-12 sm:px-8 lg:px-12 xl:px-20 lg:grid-cols-2 lg:gap-8 lg:pb-24 lg:pt-20">
        <div>
          <motion.span
            {...fadeUp(0)}
            className="inline-flex items-center gap-2 rounded-full border border-marine-200 bg-marine-50 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide text-marine-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-marine-500" />
            {site.conference.name} · {site.conference.fullName}
          </motion.span>

          <motion.h1
            {...fadeUp(0.08)}
            className="mt-6 text-4xl font-semibold leading-[1.08] text-navy-900 sm:text-5xl lg:text-6xl"
          >
            Cardio-Reno-Metabolic
            <br className="hidden sm:block" /> Care, Reimagined.
          </motion.h1>

          <motion.p {...fadeUp(0.16)} className="mt-5 max-w-xl text-lg leading-relaxed text-navy-600">
            Meet Elbrit Life Sciences at {site.conference.name} — the {site.conference.fullName}.
          </motion.p>

          <motion.div {...fadeUp(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#register"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3.5 text-base font-semibold text-white shadow-sm transition hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500 focus-visible:ring-offset-2"
            >
              Register Your Interest
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#products"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-navy-200 bg-white px-6 py-3.5 text-base font-semibold text-navy-800 transition hover:border-marine-300 hover:text-marine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500 focus-visible:ring-offset-2"
            >
              Explore Our Diabetes Portfolio
            </a>
          </motion.div>

          <motion.a
            {...fadeUp(0.32)}
            href="#calbrit"
            className="group mt-6 inline-flex items-center gap-3 rounded-2xl border border-azure-200 bg-azure-50/70 px-4 py-3 transition hover:border-azure-300 hover:bg-azure-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500"
          >
            <span className="inline-flex items-center rounded-lg bg-amber60k-500 px-2 py-1 text-xs font-bold uppercase tracking-wide text-white">
              Launching
            </span>
            <span className="text-sm font-semibold text-navy-800">
              <span className="text-azure-700">Calbrit 60K</span> — nano Vitamin D3, debuting at TRENDO 2026
            </span>
            <ArrowRight className="h-4 w-4 flex-none text-azure-600 transition-transform group-hover:translate-x-0.5" />
          </motion.a>
        </div>

        <motion.div
          initial={reduce ? false : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto flex w-full max-w-md flex-col items-center lg:max-w-none"
        >
          {/* Particle field cycles: "A pan-India" -> "Celebrating 12 Years" -> India map -> loop */}
          {reduce ? (
            <div className="text-center">
              <img src={INDIA_IMG} alt="Map of India" className="mx-auto w-2/3 object-contain" />
              <p className="mt-4 text-2xl font-semibold text-navy-900">
                A <span className="text-marine-600">pan-India</span> presence ·{' '}
                <span className="text-marine-600">Celebrating 12 Years</span>
              </p>
            </div>
          ) : (
            <ParticleTextEffect frames={HERO_FRAMES} className="w-full" />
          )}
        </motion.div>
      </div>
    </section>
  )
}
