'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import sedesData from '@/data/sedes.json'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [sedesOpen, setSedesOpen] = useState(false)
  const pathname = usePathname()
  const sedesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sedesRef.current && !sedesRef.current.contains(e.target as Node)) {
        setSedesOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setSedesOpen(false)
  }, [pathname])

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/noticias', label: 'Noticias' },
    { href: '/videos', label: 'Videos' },
  ]

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  return (
    <nav className="fixed top-0 w-full z-50 bg-dark/90 backdrop-blur-md border-b border-neon/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 relative">
              <Image
                src="/logo.png"
                alt="Vector Sur"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-orbitron font-bold text-base tracking-widest neon-text">
              VECTOR SUR
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`font-orbitron text-xs tracking-widest uppercase transition-all duration-200 hover:neon-text ${
                  isActive(link.href) ? 'neon-text' : 'text-gray-400 hover:text-neon'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {/* Sedes dropdown */}
            <div
              ref={sedesRef}
              className="relative"
              onMouseEnter={() => setSedesOpen(true)}
              onMouseLeave={() => setSedesOpen(false)}
            >
              <button
                onClick={() => setSedesOpen(!sedesOpen)}
                className={`flex items-center gap-1 font-orbitron text-xs tracking-widest uppercase transition-all duration-200 hover:text-neon ${
                  pathname.startsWith('/sedes') ? 'neon-text' : 'text-gray-400'
                }`}
              >
                Sedes
                <svg
                  className={`w-3 h-3 transition-transform duration-200 ${sedesOpen ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {sedesOpen && (
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-52 pt-2">
                  <div className="bg-card border border-neon/30 shadow-neon-sm">
                    {sedesData.sedes.map((sede, i) => (
                      <Link
                        key={sede.slug}
                        href={`/sedes/${sede.slug}`}
                        className={`block px-4 py-3 font-orbitron text-xs tracking-wider text-gray-300 hover:text-neon hover:bg-neon/5 transition-colors ${
                          i < sedesData.sedes.length - 1 ? 'border-b border-neon/10' : ''
                        }`}
                      >
                        ▸ {sede.ciudad}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contacto — CTA button */}
            <Link href="/contacto" className="btn-neon text-xs px-5 py-2">
              Contacto
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-neon p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menú"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-card border-t border-neon/20 px-6 py-4 space-y-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`block font-orbitron text-xs tracking-widest uppercase py-3 border-b border-neon/10 transition-colors ${
                isActive(link.href) ? 'text-neon' : 'text-gray-400'
              }`}
            >
              {link.label}
            </Link>
          ))}

          <div className="border-b border-neon/10">
            <button
              onClick={() => setSedesOpen(!sedesOpen)}
              className="flex items-center justify-between w-full font-orbitron text-xs tracking-widest uppercase py-3 text-gray-400"
            >
              Sedes
              <svg
                className={`w-3 h-3 transition-transform ${sedesOpen ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {sedesOpen && (
              <div className="pl-4 pb-2 space-y-1">
                {sedesData.sedes.map(sede => (
                  <Link
                    key={sede.slug}
                    href={`/sedes/${sede.slug}`}
                    className="block font-orbitron text-xs tracking-wider text-gray-500 hover:text-neon py-2 transition-colors"
                  >
                    ▸ {sede.ciudad}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/contacto" className="block btn-neon text-xs text-center py-3 mt-2">
            Contacto
          </Link>
        </div>
      )}
    </nav>
  )
}
