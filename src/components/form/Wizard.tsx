import type { ReactNode } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowRight, Spinner } from '../Icons'

/** A single Typeform-style question: a prominent prompt + its input(s). */
export function Question({
  index,
  title,
  hint,
  children,
}: {
  index?: number
  title: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div>
      <div className="flex items-baseline gap-2">
        {index != null && (
          <span className="text-sm font-semibold text-marine-600">{index}.</span>
        )}
        <h3 className="text-xl font-semibold leading-snug text-navy-900 sm:text-2xl">{title}</h3>
      </div>
      {hint && <p className="mt-2 text-sm text-navy-500">{hint}</p>}
      <div className="mt-6">{children}</div>
    </div>
  )
}

/**
 * Presentational chrome for a one-question-at-a-time flow: progress bar,
 * animated step transitions, and Back / Continue (or Submit) navigation.
 */
export function WizardShell({
  step,
  total,
  dir,
  onBack,
  canGoBack,
  isLast,
  isSubmitting,
  onContinue,
  continueLabel,
  children,
}: {
  step: number
  total: number
  dir: number
  onBack: () => void
  canGoBack: boolean
  isLast: boolean
  isSubmitting: boolean
  onContinue: () => void
  continueLabel?: string
  children: ReactNode
}) {
  const reduce = useReducedMotion()
  const pct = Math.round(((step + 1) / total) * 100)

  return (
    <div>
      {/* Progress */}
      <div className="mb-8 flex items-center gap-4">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100">
          <div
            className="h-full rounded-full bg-marine-500 transition-all duration-300 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <span className="whitespace-nowrap text-xs font-medium tabular-nums text-navy-400">
          {step + 1} / {total}
        </span>
      </div>

      {/* Question */}
      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step}
            custom={dir}
            initial={reduce ? false : { opacity: 0, y: dir >= 0 ? 24 : -24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: dir >= 0 ? -24 : 24 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex flex-wrap items-center gap-3">
        {canGoBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-700 transition hover:border-marine-300 hover:text-marine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500"
          >
            ← Back
          </button>
        )}
        <button
          type={isLast ? 'submit' : 'button'}
          onClick={isLast ? undefined : onContinue}
          disabled={isSubmitting}
          className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? (
            <>
              <Spinner className="h-5 w-5" />
              Submitting…
            </>
          ) : (
            <>
              {isLast ? 'Submit' : continueLabel ?? 'Continue'}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
        {!isLast && (
          <span className="hidden items-center text-xs text-navy-400 sm:inline-flex">
            press{' '}
            <kbd className="mx-1 rounded border border-navy-200 bg-navy-50 px-1.5 py-0.5 font-sans text-[11px] text-navy-500">
              Enter ↵
            </kbd>
          </span>
        )}
      </div>
    </div>
  )
}
