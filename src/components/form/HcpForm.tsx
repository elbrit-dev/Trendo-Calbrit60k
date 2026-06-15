import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, type KeyboardEvent, type ReactNode } from 'react'
import {
  hcpSchema,
  type HcpFormValues,
  TITLES,
  SPECIALIZATIONS,
  CLINICAL_INTERESTS,
  PRODUCTS_OF_INTEREST,
  REQUESTS,
} from './schema'
import { Field, OptionGroup, fieldClass, selectClass, labelCls } from './ui'
import { ChevronDown, ShieldCheck } from '../Icons'
import { submitForm, RateLimitError } from '../../lib/submit'
import { Question, WizardShell } from './Wizard'

const ATTEND = ['Yes', 'No', 'Undecided'] as const

type FieldName = keyof HcpFormValues

export default function HcpForm({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void
  onBack: () => void
}) {
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [step, setStep] = useState(0)
  const [dir, setDir] = useState(1)

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors, isSubmitting },
  } = useForm<HcpFormValues>({
    resolver: zodResolver(hcpSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
    defaultValues: {
      title: 'Dr.',
      clinicalInterests: [],
      products: [],
      requests: [],
    },
  })

  const specializationIsOther = watch('specialization') === 'Other'
  const clinicalIsOther = (watch('clinicalInterests') ?? []).includes('Other')

  // Each step = the field(s) it must validate + the question it renders.
  const steps: { fields: FieldName[]; node: ReactNode }[] = [
    {
      fields: ['title', 'fullName'],
      node: (
        <Question index={1} title="Let's start with your name">
          <div className="grid gap-5 sm:grid-cols-[140px_1fr]">
            <Field id="hcp-title" label="Title" required error={errors.title?.message}>
              <div className="relative">
                <select id="hcp-title" className={selectClass(!!errors.title)} {...register('title')}>
                  {TITLES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
              </div>
            </Field>
            <Field id="hcp-fullName" label="Full name" required error={errors.fullName?.message}>
              <input
                id="hcp-fullName"
                type="text"
                autoComplete="name"
                autoFocus
                className={fieldClass(!!errors.fullName)}
                aria-invalid={!!errors.fullName}
                {...register('fullName')}
              />
            </Field>
          </div>
        </Question>
      ),
    },
    {
      fields: specializationIsOther ? ['specialization', 'specializationOther'] : ['specialization'],
      node: (
        <Question index={2} title="What's your specialization?">
          <div className="relative">
            <select
              id="hcp-specialization"
              defaultValue=""
              className={selectClass(!!errors.specialization)}
              aria-invalid={!!errors.specialization}
              {...register('specialization')}
            >
              <option value="" disabled>
                Select specialization
              </option>
              {SPECIALIZATIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-400" />
          </div>
          <FieldMsg msg={errors.specialization?.message} />

          {specializationIsOther && (
            <div className="mt-4">
              <Field
                id="hcp-specializationOther"
                label="Please specify your specialization"
                required
                error={errors.specializationOther?.message}
              >
                <input
                  id="hcp-specializationOther"
                  type="text"
                  autoFocus
                  className={fieldClass(!!errors.specializationOther)}
                  aria-invalid={!!errors.specializationOther}
                  {...register('specializationOther')}
                />
              </Field>
            </div>
          )}
        </Question>
      ),
    },
    {
      fields: ['hospital', 'city'],
      node: (
        <Question index={3} title="Where do you practise?">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="hcp-hospital" label="Hospital / clinic name" required error={errors.hospital?.message}>
              <input
                id="hcp-hospital"
                type="text"
                autoComplete="organization"
                autoFocus
                className={fieldClass(!!errors.hospital)}
                aria-invalid={!!errors.hospital}
                {...register('hospital')}
              />
            </Field>
            <Field id="hcp-city" label="City" required error={errors.city?.message}>
              <input
                id="hcp-city"
                type="text"
                autoComplete="address-level2"
                className={fieldClass(!!errors.city)}
                aria-invalid={!!errors.city}
                {...register('city')}
              />
            </Field>
          </div>
        </Question>
      ),
    },
    {
      fields: ['email', 'mobile'],
      node: (
        <Question index={4} title="How can we reach you?">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field id="hcp-email" label="Professional email" required error={errors.email?.message}>
              <input
                id="hcp-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoFocus
                className={fieldClass(!!errors.email)}
                aria-invalid={!!errors.email}
                {...register('email')}
              />
            </Field>
            <Field
              id="hcp-mobile"
              label="Mobile number"
              required
              error={errors.mobile?.message}
              hint="10-digit Indian mobile number"
            >
              <input
                id="hcp-mobile"
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
                maxLength={10}
                placeholder="9876543210"
                className={fieldClass(!!errors.mobile)}
                aria-invalid={!!errors.mobile}
                {...register('mobile')}
              />
            </Field>
          </div>
        </Question>
      ),
    },
    {
      fields: clinicalIsOther ? ['clinicalInterestsOther'] : [],
      node: (
        <Question index={5} title="Your clinical focus" hint="Optional — select any that apply">
          <OptionGroup
            legend="Areas of clinical interest"
            type="checkbox"
            options={CLINICAL_INTERESTS}
            registerProps={register('clinicalInterests')}
          />
          {clinicalIsOther && (
            <div className="mt-4">
              <Field
                id="hcp-clinicalInterestsOther"
                label="Please specify your other area of interest"
                required
                error={errors.clinicalInterestsOther?.message}
              >
                <input
                  id="hcp-clinicalInterestsOther"
                  type="text"
                  autoFocus
                  className={fieldClass(!!errors.clinicalInterestsOther)}
                  aria-invalid={!!errors.clinicalInterestsOther}
                  {...register('clinicalInterestsOther')}
                />
              </Field>
            </div>
          )}
          <div className="mt-6">
            <fieldset>
              <legend className={labelCls}>Products of interest</legend>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                {PRODUCTS_OF_INTEREST.map((p) => (
                  <label
                    key={p.name}
                    className="flex cursor-pointer items-start gap-2.5 rounded-lg border border-navy-200 bg-white px-3.5 py-2.5 transition hover:border-marine-300 has-[:checked]:border-marine-500 has-[:checked]:bg-marine-50/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-marine-500/40"
                  >
                    <input
                      type="checkbox"
                      value={p.name}
                      {...register('products')}
                      className="mt-0.5 h-4 w-4 flex-none rounded border-navy-300 text-marine-600 focus:ring-marine-500"
                    />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium text-navy-900">{p.name}</span>
                      <span className="block text-xs font-medium text-marine-700">{p.molecule}</span>
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          </div>
        </Question>
      ),
    },
    {
      fields: [],
      node: (
        <Question index={6} title="What would you like?" hint="Optional — select any that apply">
          <OptionGroup
            legend=""
            type="checkbox"
            options={REQUESTS}
            registerProps={register('requests')}
          />
        </Question>
      ),
    },
    {
      fields: ['attend', 'consent'],
      node: (
        <Question index={7} title="Will you attend TRENDO 2026?">
          <div className="flex flex-wrap gap-2">
            {ATTEND.map((opt) => (
              <label
                key={opt}
                className="flex cursor-pointer items-center gap-2 rounded-lg border border-navy-200 bg-white px-4 py-2.5 text-[15px] text-navy-800 transition hover:border-marine-300 has-[:checked]:border-marine-500 has-[:checked]:bg-marine-50/60"
              >
                <input
                  type="radio"
                  value={opt}
                  className="h-4 w-4 border-navy-300 text-marine-600 focus:ring-marine-500"
                  {...register('attend')}
                />
                {opt}
              </label>
            ))}
          </div>
          <FieldMsg msg={errors.attend?.message} />

          <div className="mt-6 border-t border-navy-100 pt-6">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                className="mt-0.5 h-5 w-5 flex-none rounded border-navy-300 text-marine-600 focus:ring-marine-500"
                aria-invalid={!!errors.consent}
                {...register('consent')}
              />
              <span className="text-sm leading-relaxed text-navy-700">
                I confirm I am a registered healthcare professional and consent to be contacted by
                Elbrit Life Sciences.
              </span>
            </label>
            <FieldMsg msg={errors.consent?.message} />
          </div>
        </Question>
      ),
    },
  ]

  const total = steps.length
  const isLast = step === total - 1

  const goNext = async () => {
    const fields = steps[step].fields
    const ok = fields.length === 0 || (await trigger(fields))
    if (!ok) return
    setDir(1)
    setStep((s) => Math.min(s + 1, total - 1))
  }

  const goBack = () => {
    setDir(-1)
    if (step === 0) {
      onBack()
      return
    }
    setStep((s) => Math.max(s - 1, 0))
  }

  // Enter advances instead of submitting (except on the last step).
  const onKeyDown = (e: KeyboardEvent<HTMLFormElement>) => {
    if (e.key !== 'Enter') return
    const target = e.target as HTMLElement
    if (target.tagName === 'TEXTAREA') return
    if (!isLast) {
      e.preventDefault()
      void goNext()
    }
  }

  const onValid = async (values: HcpFormValues) => {
    setSubmitError(null)
    if (values.website) {
      onSuccess()
      return
    }
    const { website: _hp, ...data } = values
    try {
      await submitForm('hcp', data)
      onSuccess()
    } catch (err) {
      setSubmitError(
        err instanceof RateLimitError
          ? err.message
          : 'Something went wrong while submitting. Please try again.',
      )
    }
  }

  return (
    <form onSubmit={handleSubmit(onValid)} onKeyDown={onKeyDown} noValidate>
      <span className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-marine-50 px-3 py-1 text-xs font-semibold text-marine-700">
        <ShieldCheck className="h-3.5 w-3.5" />
        For Healthcare Professionals
      </span>

      {/* Honeypot */}
      <div className="hp-field" aria-hidden="true">
        <label htmlFor="hcp-website">Company website</label>
        <input id="hcp-website" type="text" tabIndex={-1} autoComplete="off" {...register('website')} />
      </div>

      <WizardShell
        step={step}
        total={total}
        dir={dir}
        onBack={goBack}
        canGoBack
        isLast={isLast}
        isSubmitting={isSubmitting}
        onContinue={goNext}
      >
        {steps[step].node}
      </WizardShell>

      {submitError && (
        <p role="alert" className="mt-4 rounded-lg bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">
          {submitError}
        </p>
      )}
    </form>
  )
}

function FieldMsg({ msg }: { msg?: string }) {
  if (!msg) return null
  return (
    <p role="alert" className="mt-2 text-sm font-medium text-rose-600">
      {msg}
    </p>
  )
}
