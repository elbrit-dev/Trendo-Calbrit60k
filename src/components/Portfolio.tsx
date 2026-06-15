import { lazy, Suspense } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { products } from '../data/products'
import { Beaker } from './Icons'
import { useShow3D, LazyVisible } from '../three/util'

const SceneBackdrop = lazy(() => import('../three/SceneBackdrop'))

export default function Portfolio() {
  const reduce = useReducedMotion()
  const show3D = useShow3D()

  return (
    <section id="products" className="relative overflow-hidden bg-white">
      {show3D && (
        <LazyVisible className="pointer-events-none absolute inset-0 z-0 opacity-70">
          <Suspense fallback={null}>
            <SceneBackdrop variant="light" />
          </Suspense>
        </LazyVisible>
      )}
      <div className="relative z-10 mx-auto max-w-content px-5 py-16 sm:px-8 lg:px-12 xl:px-20 lg:py-24">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-marine-600">
            Featured at TRENDO 2026
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">
            Our Diabetes Portfolio
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-navy-600">
            A cardio-reno-metabolic range spanning SGLT2 inhibitors, DPP-4 inhibitors, and fixed-dose
            combinations — positioned by mechanism and supported by landmark evidence.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <motion.article
              key={product.name}
              initial={reduce ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col rounded-2xl border border-navy-100 bg-white p-6 shadow-card transition-shadow duration-200 hover:shadow-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-marine-50 text-marine-600">
                <Beaker className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-semibold text-navy-900">{product.name}</h3>
              <p className="mt-1 text-sm font-medium text-marine-700">{product.molecule}</p>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-navy-600">
                {product.positioning}
              </p>
              {product.evidence && (
                <div className="mt-5 border-t border-navy-100 pt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-sage-700">
                    Evidence
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-navy-700">{product.evidence}</p>
                </div>
              )}
            </motion.article>
          ))}
        </div>

        <p className="mt-8 max-w-3xl text-xs leading-relaxed text-navy-400">
          Product information is intended for registered healthcare professionals and is presented
          factually by molecule. It does not constitute prescribing advice or dosing guidance.
        </p>
      </div>
    </section>
  )
}
