import { site } from '../data/site'

export default function About() {
  return (
    <section id="about" className="border-y border-navy-100 bg-navy-50/40">
      <div className="mx-auto max-w-content px-5 py-16 sm:px-8 lg:px-12 xl:px-20 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-marine-600">
              About Elbrit
            </p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-navy-900 sm:text-4xl">
              Evidence-led medicine, built around the patient.
            </h2>
          </div>
          <div>
            <p className="text-lg leading-relaxed text-navy-700">
              Elbrit Life Sciences is a pharmaceutical company founded in 2014 with the vision of
              “Making Lives Better” by providing quality healthcare to patients. It is an
              innovation-driven company specializing in the discovery, development, manufacturing,
              and marketing of prescription drugs, with a strong focus on cardiovascular, diabetes,
              neurology, and nutraceuticals markets.
            </p>
            <div className="mt-7">
              <p className="text-sm font-medium text-navy-500">Therapeutic focus areas</p>
              <ul className="mt-3 flex flex-wrap gap-2.5">
                {site.therapeuticAreas.map((area) => (
                  <li
                    key={area}
                    className="rounded-full border border-navy-200 bg-white px-4 py-1.5 text-sm font-medium text-navy-800"
                  >
                    {area}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
