import type { ReactNode } from 'react'
import type { UseFormRegisterReturn } from 'react-hook-form'

export const labelCls = 'block text-sm font-medium text-navy-800'
export const requiredMark = <span className="text-rose-600" aria-hidden="true"> *</span>

export function fieldClass(hasError?: boolean): string {
  const baseCls =
    'w-full rounded-lg border bg-white px-3.5 py-2.5 text-[15px] text-navy-900 shadow-sm outline-none transition placeholder:text-navy-300 focus:ring-2'
  return hasError
    ? `${baseCls} border-rose-400 focus:border-rose-500 focus:ring-rose-500/30`
    : `${baseCls} border-navy-200 focus:border-marine-500 focus:ring-marine-500/30`
}

export const selectClass = (hasError?: boolean) => `${fieldClass(hasError)} appearance-none pr-10`

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs font-medium text-rose-600">
      {message}
    </p>
  )
}

interface FieldProps {
  id: string
  label: string
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}

export function Field({ id, label, required, error, hint, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className={labelCls}>
        {label}
        {required && requiredMark}
      </label>
      <div className="mt-1.5">{children}</div>
      {hint && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-navy-500">
          {hint}
        </p>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  )
}

interface OptionGroupProps {
  legend: string
  required?: boolean
  options: readonly string[]
  registerProps: UseFormRegisterReturn
  type: 'checkbox' | 'radio'
  error?: string
  columns?: 1 | 2
}

// Reusable checkbox / radio group. Multiple inputs share the same `name` via
// registerProps, so react-hook-form collects checked checkboxes into an array.
export function OptionGroup({
  legend,
  required,
  options,
  registerProps,
  type,
  error,
  columns = 2,
}: OptionGroupProps) {
  const errId = `${registerProps.name}-error`
  return (
    <fieldset aria-describedby={error ? errId : undefined}>
      <legend className={labelCls}>
        {legend}
        {required && requiredMark}
      </legend>
      <div className={`mt-2 grid gap-2 ${columns === 2 ? 'sm:grid-cols-2' : ''}`}>
        {options.map((opt) => (
          <label
            key={opt}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-navy-200 bg-white px-3.5 py-2.5 text-[15px] text-navy-800 transition hover:border-marine-300 has-[:checked]:border-marine-500 has-[:checked]:bg-marine-50/60 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-marine-500/40"
          >
            <input
              type={type}
              value={opt}
              {...registerProps}
              className={`${type === 'checkbox' ? 'rounded' : 'rounded-full'} h-4 w-4 flex-none border-navy-300 text-marine-600 focus:ring-marine-500`}
            />
            <span>{opt}</span>
          </label>
        ))}
      </div>
      <FieldError id={errId} message={error} />
    </fieldset>
  )
}
