import { lazy, Suspense } from 'react'
import { site } from '../data/site'
import { Calendar, MapPin, Document, ArrowRight } from './Icons'
import { useShow3D, LazyVisible } from '../three/util'

const SceneBackdrop = lazy(() => import('../three/SceneBackdrop'))

const VISITOR_BENEFITS = [
  'Scientific monograph',
  'Latest guidelines summary',
  'Samples for prescribers',
]

export default function Conference() {
  const show3D = useShow3D()

  return (
    <section id="conference" className="relative overflow-hidden bg-navy-900 text-white">
      {show3D && (
        <LazyVisible className="pointer-events-none absolute inset-0 z-0">
          <Suspense fallback={null}>
            <SceneBackdrop variant="dark" />
          </Suspense>
        </LazyVisible>
      )}
      <div className="relative z-10 mx-auto max-w-content px-5 py-16 sm:px-8 lg:px-12 xl:px-20 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-marine-300">
              Visit Our Stall
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              {site.conference.name}
            </h2>
            <p className="mt-2 text-lg text-navy-200">{site.conference.fullName}</p>

            <dl className="mt-8 space-y-5">
              <div className="flex items-start gap-3.5">
                <Calendar className="mt-0.5 h-5 w-5 flex-none text-marine-300" />
                <div>
                  <dt className="text-sm font-medium text-navy-300">Dates</dt>
                  <dd className="text-base text-white">{site.conference.dates}</dd>
                </div>
              </div>
              <div className="flex items-start gap-3.5">
                <MapPin className="mt-0.5 h-5 w-5 flex-none text-marine-300" />
                <div>
                  <dt className="text-sm font-medium text-navy-300">Venue</dt>
                  <dd className="text-base text-white">{site.conference.venue}</dd>
                </div>
              </div>
            </dl>

            <p className="mt-8 max-w-lg text-lg leading-relaxed text-navy-100">
              Meet our medical affairs team for a one-on-one evidence discussion on Empagliflozin and
              the cardio-reno-metabolic continuum.
            </p>

            <a
              href="#register"
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-base font-semibold text-navy-900 transition hover:bg-marine-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-300 focus-visible:ring-offset-2 focus-visible:ring-offset-navy-900"
            >
              Register Your Interest
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="rounded-2xl border border-navy-700 bg-navy-800/60 p-8">
            <div className="flex items-center gap-2.5 text-marine-300">
              <Document className="h-5 w-5" />
              <h3 className="text-sm font-semibold uppercase tracking-wider">What visitors receive</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {VISITOR_BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-3 border-b border-navy-700 pb-4 last:border-0 last:pb-0">
                  <span className="h-2 w-2 flex-none rounded-full bg-marine-300" aria-hidden="true" />
                  <span className="text-base text-navy-50">{benefit}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-xs leading-relaxed text-navy-300">
              Samples and prescriber materials are available to registered healthcare professionals
              only.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
