// Form submission layer → ERPNext (Frappe) Server Script endpoint.
//
// Posts to the `trendo_register` API method, which inserts a
// "Trendo Registration" record. Field keys below MUST match the DocType
// fieldnames (and the Server Script). Flip USE_REAL_ENDPOINT to false to mock.

export type FormType = 'hcp' | 'public'

export interface SubmitResult {
  ok: boolean
}

const USE_REAL_ENDPOINT = true
const ENDPOINT = 'https://uat.elbrit.org/api/method/trendo_register'

// --- Lightweight client-side rate limiting ---------------------------------
const MIN_SUBMIT_INTERVAL_MS = 4000
let lastSubmitAt = 0

export class RateLimitError extends Error {
  constructor() {
    super('Please wait a few seconds before submitting again.')
    this.name = 'RateLimitError'
  }
}

function joinList(v: unknown): string {
  if (Array.isArray(v)) return v.join(', ')
  return typeof v === 'string' ? v : ''
}

function str(v: unknown): string {
  return typeof v === 'string' ? v : ''
}

// Map form values → Trendo Registration DocType fieldnames.
function toErpPayload(formType: FormType, data: Record<string, unknown>) {
  return {
    form_type: formType === 'hcp' ? 'Doctor' : 'General Inquiry',
    title: str(data.title),
    full_name: str(data.fullName),
    specialization: str(data.specialization),
    specialization_other: str(data.specializationOther),
    hospital_clinic: str(data.hospital),
    city: str(data.city),
    professional_email: str(data.email),
    mobile_number: str(data.mobile),
    clinical_interests: joinList(data.clinicalInterests),
    clinical_interest_other: str(data.clinicalInterestsOther),
    products_of_interest: joinList(data.products),
    requests: joinList(data.requests),
    attend_trendo_2026: str(data.attend),
    role: str(data.role),
    reason: str(data.reason),
    consent: data.consent ? 1 : 0,
  }
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

  const payload = toErpPayload(formType, data)

  if (!USE_REAL_ENDPOINT) {
    // eslint-disable-next-line no-console
    console.log('[submitForm] (mock) POST', ENDPOINT, payload)
    await new Promise((resolve) => setTimeout(resolve, 700))
    return { ok: true }
  }

  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    throw new Error(`Submission failed (${res.status})`)
  }
  return { ok: true }
}
