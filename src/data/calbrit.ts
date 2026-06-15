// CALBRIT 60K — content sourced from Elbrit's own Canva launch material.
// Factual to the molecule and the company's cited clinical references. HCP-facing.

export const calbrit = {
  name: 'Calbrit 60K',
  molecule: 'Cholecalciferol (Vitamin D3) 60,000 IU',
  form: 'Chewable Tablet',
  platform: 'HydroX Platform',
  platformSub: 'Nanoparticle delivery system',
  tagline: 'The next step in Vitamin D3 absorption.',
  intro:
    'A nano-sized Vitamin D3 chewable tablet built on the HydroX delivery platform — engineered for faster, fat-independent absorption to correct deficiency more reliably.',

  // Headline product stats
  stats: [
    { value: '2×', label: 'Faster & better absorption', sub: 'vs conventional softgel' },
    { value: '~157 nm', label: 'Nanoparticle Vitamin D3', sub: 'HydroX engineered' },
    { value: 'Fat-independent', label: 'Works without dietary fat', sub: 'no fat-based medium' },
    { value: 'Weekly once', label: 'Convenient dosing', sub: 'sugar-free · mint' },
  ],

  hydrox:
    'HydroX is a nano-delivery platform of ~157 nm Vitamin D3 particles engineered for rapid dispersion and efficient absorption without dependence on a fat-based medium. The nanoparticles traverse the aqueous intestinal environment and permeate the lipophilic intestinal membrane for enhanced uptake into systemic circulation.',

  // Particle-size comparison
  particle: {
    conventional: { label: 'Conventional D3', size: '~400,000 nm', desc: 'Large oil-based droplet' },
    calbrit: { label: 'Calbrit 60K', size: '~157 nm', desc: 'Hydrophilic shell · lipophilic layer · D3 core' },
  },

  // Clinical evidence (company-cited)
  clinical: {
    headline: 'Nanotechnology vs conventional D3 (softgel)',
    design: 'Randomized crossover · n = 24 · 8-week · open-label',
    metrics: [
      { value: '+43%', label: 'Peak plasma concentration (Cmax)', sub: 'nanoshots over softgels' },
      { value: '+36%', label: 'Total exposure (AUC₀–₁₂₀ₕ)', sub: 'nanoshots over softgels' },
    ],
    adherence:
      'Weekly dosing achieves ~83–93% adherence vs 60–75% for daily dosing in real-world settings — and raised 25(OH)D roughly 4× more than daily dosing over a 10-week period.',
    reference:
      'Marwaha RK, Verma M, Walekar A, Sonawane R, Trivedi C. Journal of Orthopaedics. 2022;35:64–68. DOI: 10.1016/j.jor.2022.11.003',
  },

  context: {
    stat: '50–90%',
    label: "of India's population is affected by Vitamin D deficiency",
    note: 'One of the highest deficiency rates globally.',
  },

  highlights: ['Sugar-free', 'Mint flavour', 'Chewable', 'Weekly once'],
} as const
