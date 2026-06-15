import { z } from 'zod'

// --- Option lists ----------------------------------------------------------
export const TITLES = ['Dr.', 'Prof.', 'Other'] as const
export const SPECIALIZATIONS = [
  'Endocrinologist',
  'Diabetologist',
  'Consulting Physician',
  'Cardiologist',
  'Gynecologist',
  'Pediatrician',
  'General Practitioner',
  'Other',
] as const
export const CITIES = [
  'Chennai',
  'Coimbatore',
  'Madurai',
  'Trichy',
  'Salem',
  'Puducherry',
  'Other',
] as const
export const CLINICAL_INTERESTS = [
  'Type 2 Diabetes',
  'Cardio-Renal Protection',
  'Heart Failure',
  'CKD',
  'Obesity',
  'Thyroid',
  'PCOS',
  'Bone Health',
  'Other',
] as const
export const PRODUCTS_OF_INTEREST = [
  { name: 'Calbrit 60K', molecule: 'Cholecalciferol (Vitamin D3)' },
  { name: 'EMPABRIT 10 / 25', molecule: 'Empagliflozin' },
  { name: 'EMPABRIT L 25 / 5', molecule: 'Empagliflozin + Linagliptin' },
  { name: 'DAFAX TRIO', molecule: 'Dapagliflozin + Vildagliptin + Metformin' },
  { name: 'LINATO-D 5 / 10', molecule: 'Linagliptin + Dapagliflozin' },
  { name: 'SITADOC M', molecule: 'Sitagliptin + Metformin' },
  { name: 'VILZATO M', molecule: 'Vildagliptin + Metformin' },
  { name: 'TENLITAB M', molecule: 'Teneligliptin + Metformin' },
] as const
export const REQUESTS = [
  'Scientific Literature',
  'Product Samples',
  'MR Visit',
  'Invitation to CME',
  'Joint Patient Case Discussion',
] as const
export const PUBLIC_ROLES = [
  'Patient',
  'Caregiver / Family Member',
  'Pharmacy / Chemist',
  'Medical Student',
  'Medical Representative',
  'Distributor / Stockist Inquiry',
  'Career Inquiry',
  'Journalist / Media',
  'Other',
] as const

// --- Shared validators ------------------------------------------------------
const indianMobile = z
  .string()
  .min(1, 'Mobile number is required')
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number')

const email = z.string().min(1, 'Email is required').email('Enter a valid email address')

// Honeypot — must stay empty. Bots that auto-fill every field will trip this.
const honeypot = z.string().max(0).optional()

// --- HCP form (Form A) ------------------------------------------------------
export const hcpSchema = z
  .object({
    title: z.enum(TITLES),
    fullName: z.string().min(1, 'Full name is required'),
    specialization: z.string().min(1, 'Please select your specialization'),
    specializationOther: z.string().optional(),
    hospital: z.string().min(1, 'Hospital / clinic name is required'),
    city: z.string().min(1, 'City is required'),
    email,
    mobile: indianMobile,
    clinicalInterests: z.array(z.string()).optional().default([]),
    clinicalInterestsOther: z.string().optional(),
    products: z.array(z.string()).optional().default([]),
    requests: z.array(z.string()).optional().default([]),
    attend: z.enum(['Yes', 'No', 'Undecided'], {
      errorMap: () => ({ message: 'Please let us know if you will attend' }),
    }),
    consent: z.literal(true, {
      errorMap: () => ({ message: 'Please confirm your HCP status and consent to continue' }),
    }),
    website: honeypot,
  })
  .superRefine((val, ctx) => {
    if (val.specialization === 'Other' && !val.specializationOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['specializationOther'],
        message: 'Please enter your specialization',
      })
    }
    if (val.clinicalInterests?.includes('Other') && !val.clinicalInterestsOther?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['clinicalInterestsOther'],
        message: 'Please specify your other area of interest',
      })
    }
  })

export type HcpFormValues = z.infer<typeof hcpSchema>

// --- Public form (Form B) ---------------------------------------------------
export const publicSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  role: z.string().min(1, 'Please select an option'),
  city: z.string().min(1, 'City is required'),
  email,
  mobile: indianMobile,
  reason: z
    .string()
    .min(1, 'Please tell us the reason for your inquiry')
    .max(500, 'Please keep this under 500 characters'),
  consent: z.literal(true, {
    errorMap: () => ({ message: 'Please consent to be contacted to continue' }),
  }),
  website: honeypot,
})

export type PublicFormValues = z.infer<typeof publicSchema>
