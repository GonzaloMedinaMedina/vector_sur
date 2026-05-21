import Link from 'next/link'
import Image from 'next/image'
import sedesData from '@/data/sedes.json'

export default function Footer() {
  return (
    <footer className="bg-card border-t border-neon/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 relative">
                <Image src="/logo.png" alt="Vector Sur" fill className="object-contain" />
              </div>
              <span className="font-orbitron font-bold text-sm tracking-widest neon-text">
                VECTOR SUR
              </span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Comunidad de Infinity (Corvus Belli) en Andalucía. Torneos, partidas y eventos
              en La Línea, Málaga, Sevilla y Melilla.
            </p>
          </div>

          {/* Navegación */}
          <div>
            <h3 className="font-orbitron text-xs tracking-widest text-neon uppercase mb-4">Navegación</h3>
            <ul className="space-y-2">
              {[
                { href: '/', label: 'Inicio' },
                { href: '/noticias', label: 'Noticias' },
                { href: '/videos', label: 'Videos' },
                { href: '/contacto', label: 'Contacto' },
              ].map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-500 text-sm hover:text-neon transition-colors font-orbitron text-xs tracking-wider"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Sedes */}
          <div>
            <h3 className="font-orbitron text-xs tracking-widest text-neon uppercase mb-4">Sedes</h3>
            <ul className="space-y-2">
              {sedesData.sedes.map(sede => (
                <li key={sede.slug}>
                  <Link
                    href={`/sedes/${sede.slug}`}
                    className="text-gray-500 text-sm hover:text-neon transition-colors font-orbitron text-xs tracking-wider"
                  >
                    {sede.ciudad}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="neon-line my-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-gray-600 text-xs font-orbitron tracking-wider">
          <span>© {new Date().getFullYear()} Vector Sur. Todos los derechos reservados.</span>
          <span>
            Infinity es marca registrada de{' '}
            <a
              href="https://www.corvusbelli.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-neon/60 hover:text-neon transition-colors"
            >
              Corvus Belli
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
