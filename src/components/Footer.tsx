import { site } from '../data/site'
import { Mail, Phone, MapPin, LinkedIn, ArrowRight } from './Icons'

export default function Footer() {
  return (
    <footer className="border-t border-navy-100 bg-white">
      <div className="mx-auto max-w-content px-5 py-14 sm:px-8 lg:px-12 xl:px-20">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <a href={site.website} target="_blank" rel="noopener noreferrer" aria-label={`${site.company} home`}>
              <img
                src="/assets/elbrit-logo.png"
                alt="Elbrit Life Sciences"
                className="h-11 w-auto"
                width={235}
                height={52}
                loading="lazy"
              />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-navy-500">
              Cardio-reno-metabolic care, reimagined. Proudly participating in {site.conference.name}.
            </p>
            <a
              href={site.website}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-marine-700 transition hover:text-marine-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500"
            >
              Home
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <address className="not-italic">
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-400">Contact</p>
            <ul className="mt-4 space-y-3 text-sm text-navy-700">
              <li>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    site.contact.addressLines.join(', '),
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2.5 hover:text-marine-700"
                >
                  <MapPin className="mt-0.5 h-4 w-4 flex-none text-marine-600" />
                  {site.contact.addressLines.join(', ')}
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2.5 hover:text-marine-700">
                  <Mail className="h-4 w-4 flex-none text-marine-600" />
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a href={`tel:${site.contact.phone.replace(/\s/g, '')}`} className="flex items-center gap-2.5 hover:text-marine-700">
                  <Phone className="h-4 w-4 flex-none text-marine-600" />
                  {site.contact.phone}
                </a>
              </li>
            </ul>
          </address>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-navy-400">Follow</p>
            <div className="mt-4 flex gap-3">
              <a
                href="https://www.linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Elbrit Life Sciences on LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy-200 text-navy-700 transition hover:border-marine-300 hover:text-marine-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500"
              >
                <LinkedIn className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-navy-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-navy-400">
            © {new Date().getFullYear()} {site.company}. All rights reserved.
          </p>
          <p className="text-xs font-medium text-navy-500">
            For healthcare professional use. This site does not provide medical advice.
          </p>
        </div>
      </div>
    </footer>
  )
}
