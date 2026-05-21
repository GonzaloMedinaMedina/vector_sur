import { notFound } from 'next/navigation'
import Link from 'next/link'
import sedesData from '@/data/sedes.json'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return sedesData.sedes.map(s => ({ slug: s.slug }))
}

export function generateMetadata({ params }: Props) {
  const sede = sedesData.sedes.find(s => s.slug === params.slug)
  if (!sede) return {}
  return {
    title: `${sede.nombre} — Vector Sur`,
    description: sede.descripcion,
  }
}

export default function SedePage({ params }: Props) {
  const sede = sedesData.sedes.find(s => s.slug === params.slug)
  if (!sede) notFound()

  const otrasSedes = sedesData.sedes.filter(s => s.slug !== params.slug)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Back */}
      <Link
        href="/"
        className="inline-flex items-center gap-2 font-orbitron text-xs text-neon/60 hover:text-neon tracking-widest mb-10 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver al inicio
      </Link>

      {/* Hero banner */}
      <div className="relative card-neon p-10 mb-12 overflow-hidden">
        {/* Corner decorations */}
        <div className="absolute top-4 left-4 w-6 h-6 border-t border-l border-neon/60" />
        <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-neon/60" />
        <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-neon/60" />
        <div className="absolute bottom-4 right-4 w-6 h-6 border-b border-r border-neon/60" />

        {/* Ambient glow */}
        <div className="absolute inset-0 bg-neon/3 pointer-events-none" />

        <div className="relative space-y-3">
          <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase">
            Sede · Vector Sur
          </p>
          <h1 className="font-orbitron text-4xl font-black neon-text">
            {sede.ciudad}
          </h1>
          <p className="text-gray-400 text-sm max-w-2xl leading-relaxed pt-2">
            {sede.descripcion}
          </p>
        </div>
      </div>

      <hr className="neon-line mb-12" />

      {/* Info grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {/* Dirección */}
        <div className="card-neon p-6 space-y-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-neon shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <h3 className="font-orbitron text-xs text-neon tracking-widest uppercase">Dirección</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{sede.direccion}</p>
        </div>

        {/* Horario */}
        <div className="card-neon p-6 space-y-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-neon shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="font-orbitron text-xs text-neon tracking-widest uppercase">Horario</h3>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">{sede.horario}</p>
        </div>

        {/* Contacto */}
        <div className="card-neon p-6 space-y-3">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-neon shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <h3 className="font-orbitron text-xs text-neon tracking-widest uppercase">Contacto</h3>
          </div>
          <a
            href={`mailto:${sede.contacto}`}
            className="text-gray-400 text-sm hover:text-neon transition-colors break-all"
          >
            {sede.contacto}
          </a>
        </div>
      </div>

      {/* Map placeholder — admin adds Google Maps embed src here */}
      {sede.mapaEmbed ? (
        <div className="mb-16 card-neon overflow-hidden h-72">
          <iframe
            src={sede.mapaEmbed}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            title={`Mapa de ${sede.ciudad}`}
          />
        </div>
      ) : (
        <div className="mb-16 card-neon h-40 flex items-center justify-center">
          <p className="font-orbitron text-xs text-gray-700 tracking-widest">
            — Mapa próximamente —
          </p>
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-wrap gap-4 mb-16">
        <Link href="/contacto" className="btn-neon px-8 py-3 text-sm">
          Contactar con esta sede
        </Link>
      </div>

      {/* Otras sedes */}
      <div className="space-y-6">
        <h2 className="font-orbitron text-sm tracking-widest text-gray-500 uppercase">Otras sedes</h2>
        <div className="flex flex-wrap gap-3">
          {otrasSedes.map(s => (
            <Link
              key={s.slug}
              href={`/sedes/${s.slug}`}
              className="font-orbitron text-xs px-5 py-2 border border-gray-800 text-gray-500 hover:border-neon/50 hover:text-neon transition-all tracking-widest"
            >
              {s.ciudad}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
