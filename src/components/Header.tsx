import { useEffect, useState } from 'react'
import { site } from '../data/site'
import { Menu, Close, ArrowRight } from './Icons'

const NAV = [
  { label: 'Calbrit 60K', href: '#calbrit' },
  { label: 'About', href: '#about' },
  { label: 'Products', href: '#products' },
  { label: 'Conference', href: '#conference' },
  { label: 'Register', href: '#register' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors ${
        scrolled ? 'bg-white/90 backdrop-blur' : 'bg-white'
      }`}
    >
      {/* Brand red top bar */}
      <div className="h-1 w-full bg-marine-500" />
      <div
        className={`mx-auto flex h-16 max-w-content items-center justify-between border-b px-5 sm:px-8 lg:px-12 xl:px-20 ${
          scrolled ? 'border-navy-100' : 'border-transparent'
        }`}
      >
        <a href="#top" className="flex items-center" aria-label={`${site.company} home`}>
          <img
            src="/assets/elbrit-logo.png"
            alt="Elbrit Life Sciences"
            className="h-9 w-auto sm:h-10"
            width={235}
            height={52}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded text-sm font-medium text-navy-700 transition-colors hover:text-marine-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500/50 focus-visible:ring-offset-2"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#conference"
            className="group inline-flex items-center gap-1.5 rounded-full bg-navy-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500 focus-visible:ring-offset-2"
          >
            Visit Us at TRENDO 2026
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-navy-800 hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <Close className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          id="mobile-menu"
          className="border-t border-navy-100 bg-white px-5 pb-6 pt-2 md:hidden"
          aria-label="Mobile"
        >
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-medium text-navy-800 hover:bg-navy-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marine-500"
            >
              {item.label}
            </a>
          ))}
          <a
            href="#conference"
            onClick={() => setOpen(false)}
            className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-navy-900 px-4 py-3 text-base font-semibold text-white"
          >
            Visit Us at TRENDO 2026
            <ArrowRight className="h-4 w-4" />
          </a>
        </nav>
      )}
    </header>
  )
}
