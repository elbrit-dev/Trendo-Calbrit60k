// Form submission layer → Forms Pro (Frappe) endpoint.
//
// Posts to `forms_pro.api.submission.submit_form_response`, creating a
// Form Response under the Forms Pro form `FORM_ID`. The `fieldname` keys
// below MUST match the Fieldnames defined in the Forms Pro form builder.
// Flip USE_REAL_ENDPOINT to false to mock.

export type FormType = 'hcp' | 'public'

export interface SubmitResult {
  ok: boolean
}

const USE_REAL_ENDPOINT = true
// Same-origin path proxied to the Forms Pro endpoint (see netlify.toml /
// vite.config.ts). Avoids browser CORS and the preflight that was failing.
const ENDPOINT = '/api/forms_pro_submit'
// Forms Pro form docname (from the builder URL / submission payload).
const FORM_ID = '49oo5bdrt6'

// --- Lightweight client-side rate limiting ---------------------------------
const MIN_SUBMIT_INTERVAL_MS = 4000
let lastSubmitAt = 0

export class RateLimitError extends Error {
  constructor() {
    super('Please wait a few seconds before submitting again.')
    this.name = 'RateLimitError'
  }
}

// Multi-select fields are sent as arrays (Forms Pro stores them as lists).
function list(v: unknown): string[] {
  if (Array.isArray(v)) return v.map((x) => String(x))
  return typeof v === 'string' && v ? [v] : []
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

type FieldEntry = { fieldname: string; value: string | string[] }

// Map form values → Forms Pro form_data entries.
// `fieldname` must match the Fieldname defined in the Forms Pro form builder.
function toFormData(formType: FormType, data: Record<string, unknown>): FieldEntry[] {
  return [
    { fieldname: 'inquiry_type', value: formType === 'hcp' ? 'Doctor' : 'General Inquiry' },
    { fieldname: 'title', value: str(data.title) },
    { fieldname: 'full_name', value: str(data.fullName) },
    { fieldname: 'specialization', value: str(data.specialization) },
    { fieldname: 'specialization_other', value: str(data.specializationOther) },
    { fieldname: 'hospital_clinic', value: str(data.hospital) },
    { fieldname: 'city', value: str(data.city) },
    { fieldname: 'professional_email', value: str(data.email) },
    { fieldname: 'mobile_number', value: str(data.mobile) },
    { fieldname: 'clinical_interests', value: list(data.clinicalInterests) },
    { fieldname: 'clinical_interest_other', value: str(data.clinicalInterestsOther) },
    { fieldname: 'products_of_interest', value: list(data.products) },
    { fieldname: 'requests', value: list(data.requests) },
    { fieldname: 'attending_trendo_2026', value: str(data.attend) },
    { fieldname: 'role_public', value: str(data.role) },
    { fieldname: 'reason_for_inquiry', value: str(data.reason) },
    { fieldname: 'consent', value: data.consent ? '1' : '' },
  ]
}

export async function submitForm(
  formType: FormType,
  data: Record<string, unknown>,
): Promise<SubmitResult> {
  const now = Date.now()
  if (now - lastSubmitAt < MIN_SUBMIT_INTERVAL_MS) {
    throw new RateLimitError()
  }
  lastSubmitAt = now

  const body = {
    form_id: FORM_ID,
    form_data: toFormData(formType, data),
    submission_status: 'Submitted',
  }

  if (!USE_REAL_ENDPOINT) {
    // eslint-disable-next-line no-console
    console.log('[submitForm] (mock) POST', ENDPOINT, body)
    await new Promise((resolve) => setTimeout(resolve, 700))
    return { ok: true }
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) {
    // Surface the server's error body to help diagnose backend (e.g. 500) failures.
    const detail = await res.text().catch(() => '')
    // eslint-disable-next-line no-console
    console.error(`[submitForm] ${res.status} ${res.statusText}`, detail)
    throw new Error(`Submission failed (${res.status})`)
  }
  return { ok: true }
}
