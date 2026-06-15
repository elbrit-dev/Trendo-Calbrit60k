import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import HcpForm from './HcpForm'
import PublicForm from './PublicForm'
import { Check, ArrowRight, ShieldCheck } from '../Icons'

type Phase = 'gate' | 'hcp' | 'public'
type Status = 'idle' | 'success'

export default function RegistrationForm() {
  const [phase, setPhase] = useState<Phase>('gate')
  const [status, setStatus] = useState<Status>('idle')
  const reduce = useReducedMotion()

  return (
    <section id="register" className="bg-navy-50/40">
      <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8 lg:py-24">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-marine-600">
            Register / Inquiry
          </p>
          <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">
            Reserve your conversation with our team
          </h2>
        </div>

        <div className="mt-10 rounded-3xl border border-navy-100 bg-white p-6 shadow-card sm:p-9">
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={reduce ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="py-8 text-center"
                role="status"
                aria-live="polite"
              >
                <motion.div
                  initial={reduce ? false : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.05 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sage-100 text-sage-700"
                >
                  <Check className="h-8 w-8" />
                </motion.div>
                <h3 className="mt-6 text-2xl font-semibold text-navy-900">Thank you</h3>
                <p className="mx-auto mt-2 max-w-sm text-navy-600">
                  Your details have been received. Our team will reach out within 2 business days.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle')
                    setPhase('gate')
                  }}
                  className="mt-7 inline-flex items-center justify-center rounded-full border border-navy-200 px-5 py-2.5 text-sm font-semibold text-navy-800 transition hover:border-marine-300 hover:text-marine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500"
                >
                  Submit another response
                </button>
              </motion.div>
            ) : phase === 'gate' ? (
              <motion.div
                key="gate"
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              >
                <div className="flex items-baseline gap-2">
                  <span className="text-sm font-semibold text-marine-600">1.</span>
                  <h3 className="text-xl font-semibold leading-snug text-navy-900 sm:text-2xl">
                    Are you a registered healthcare professional?
                  </h3>
                </div>
                <p className="mt-2 text-sm text-navy-500">Choose one to begin.</p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <GateCard
                    icon={<ShieldCheck className="h-5 w-5" />}
                    title="Yes, I'm a Doctor"
                    subtitle="Healthcare professional registration"
                    onClick={() => setPhase('hcp')}
                  />
                  <GateCard
                    title="No, I'm not"
                    subtitle="General inquiry"
                    onClick={() => setPhase('public')}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={phase}
                initial={reduce ? false : { opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduce ? { opacity: 0 } : { opacity: 0, x: -16 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                {phase === 'hcp' ? (
                  <HcpForm onSuccess={() => setStatus('success')} onBack={() => setPhase('gate')} />
                ) : (
                  <PublicForm onSuccess={() => setStatus('success')} onBack={() => setPhase('gate')} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

function GateCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon?: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-center gap-4 rounded-2xl border border-navy-200 bg-white px-5 py-4 text-left transition hover:border-marine-400 hover:bg-marine-50/40 hover:shadow-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500"
    >
      {icon && (
        <span className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-marine-50 text-marine-600">
          {icon}
        </span>
      )}
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-navy-900">{title}</span>
        <span className="block text-sm text-navy-500">{subtitle}</span>
      </span>
      <ArrowRight className="h-5 w-5 flex-none text-navy-300 transition group-hover:translate-x-0.5 group-hover:text-marine-600" />
    </button>
  )
}
