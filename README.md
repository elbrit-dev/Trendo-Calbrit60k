# Elbrit Life Sciences × TRENDO 2026

A single-page, mobile-first lead-capture website for **Elbrit Life Sciences Pvt Ltd**, built for
**TRENDO 2026** — the 14th Annual Endocrine Conference of the Endocrine Society of Tamil Nadu and
Puducherry (ESTN).

## Stack

- **React 18 + Vite + TypeScript**
- **Tailwind CSS** (custom navy / teal / emerald clinical palette)
- **react-hook-form + zod** for validation
- **Framer Motion** for the hero entrance and the HCP ⇄ public form toggle

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (default http://localhost:5173).

```bash
npm run build     # type-check + production build to /dist
npm run preview   # preview the production build
```

## Project structure

```
src/
  App.tsx                      # page composition + skip link
  data/
    site.ts                    # editable copy: conference dates, venue, contact (placeholders)
    products.ts                # diabetes portfolio cards
  lib/
    submit.ts                  # form submission layer (mocked) + client rate limiting
  components/
    Header.tsx Hero.tsx About.tsx Portfolio.tsx Conference.tsx Footer.tsx
    Icons.tsx                  # inline SVG icon set (no emoji)
    MoleculeGraphic.tsx        # abstract molecule illustration
    form/
      RegistrationForm.tsx     # binary HCP gate + animated toggle + success state
      HcpForm.tsx              # Form A (healthcare professionals)
      PublicForm.tsx           # Form B (general public)
      schema.ts                # zod schemas + option lists
      ui.tsx                   # shared accessible field primitives
```

## Editing content

Conference **dates** and **venue** are placeholders in [`src/data/site.ts`](src/data/site.ts).
Update them there once confirmed by the organisers. Product copy lives in
[`src/data/products.ts`](src/data/products.ts).

## Form endpoint contract

Both forms submit through `submitForm()` in [`src/lib/submit.ts`](src/lib/submit.ts).

**Currently mocked** (`console.log` + simulated latency) so the app runs out of the box.
To go live, set `USE_REAL_ENDPOINT = true` in that file. It then issues:

```
POST /api/submit
Content-Type: application/json
```

### Request body

```jsonc
{
  "formType": "hcp" | "public",   // which form was submitted
  "submittedAt": "2026-06-13T10:00:00.000Z",
  "data": { /* validated form fields (honeypot stripped) */ }
}
```

**`formType: "hcp"` data fields:** `title`, `fullName`, `specialization`, `registrationNumber`,
`hospital`, `city`, `cityOther?`, `email`, `mobile`, `clinicalInterests[]`, `products[]`,
`requests[]`, `attend` (`Yes|No|Undecided`), `consent` (`true`).

**`formType: "public"` data fields:** `fullName`, `role`, `city`, `email`, `mobile`, `reason`,
`consent` (`true`).

### Expected response

- `200 OK` → success state is shown.
- Any non-2xx → the form shows an inline error and lets the user retry.

### Spam protection

- **Honeypot**: a visually hidden `website` field. If filled (bot), the client shows success but
  sends nothing.
- **Rate limiting**: client blocks submissions made within 4s of the previous one.

> Server-side validation and storage are out of scope for this front-end. Re-validate all fields
> on the server and verify HCP registration numbers as appropriate before storing or contacting.

## Accessibility & compliance notes

- Labels, `aria-invalid`, `role="alert"` errors, keyboard navigation, visible focus rings, skip link.
- WCAG AA contrast across the navy/teal palette; `prefers-reduced-motion` respected.
- Product copy is factual to molecules; no approval claims, no patient-facing dosing/prescribing
  guidance. Samples/prescriber materials are gated to HCPs.
