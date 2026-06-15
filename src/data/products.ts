export type Product = {
  name: string
  molecule: string
  positioning: string
  evidence?: string
}

// Copy kept factual to molecules — no approval claims, no dosing guidance.
export const products: Product[] = [
  {
    name: 'EMPABRIT 10 / 25',
    molecule: 'Empagliflozin',
    positioning:
      'Proven cardio-renal protection across CV death, HF (preserved & reduced EF), and CKD progression.',
    evidence: 'EMPA-REG OUTCOME · EMPEROR-Reduced / Preserved · EMPA-KIDNEY',
  },
  {
    name: 'EMPABRIT L 25 / 5',
    molecule: 'Empagliflozin + Linagliptin',
    positioning: 'Dual-mechanism FDC for the elderly diabetic with renal comorbidity.',
    evidence: 'SGLT2i + DPP-4 synergy',
  },
  {
    name: 'DAFAX TRIO',
    molecule: 'Dapagliflozin + Vildagliptin + Metformin',
    positioning: 'Triple FDC to overcome therapeutic inertia.',
    evidence: 'DECLARE-TIMI 58 · DAPA-HF · DAPA-CKD',
  },
  {
    name: 'LINATO-D 5 / 10',
    molecule: 'Linagliptin + Dapagliflozin',
    positioning: 'Renal-friendly DPP-4 + SGLT2i combination.',
  },
  {
    name: 'SITADOC M / VILZATO M / TENLITAB M',
    molecule: 'Sitagliptin / Vildagliptin / Teneligliptin + Metformin',
    positioning: 'Trusted DPP-4i + Metformin FDCs across the dosing spectrum.',
  },
]
