import Link from 'next/link'
import { db } from '@/db'
import { noticias } from '@/db/schema'
import { desc } from 'drizzle-orm'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Noticias — Vector Sur',
  description: 'Torneos, eventos y novedades de la comunidad Vector Sur.',
}

export default async function NoticiasPage() {
  const result = await db.select().from(noticias).orderBy(desc(noticias.fecha))

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-14 space-y-3">
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase">Vector Sur</p>
        <h1 className="font-orbitron text-4xl font-black section-heading">
          <span className="neon-text">Noticias</span>
        </h1>
        <p className="text-gray-500 text-sm mt-6">
          Torneos, eventos y todo lo que ocurre en la comunidad.
        </p>
      </div>

      <hr className="neon-line mb-14" />

      {result.length === 0 ? (
        <div className="text-center py-24 text-gray-600 font-orbitron text-sm tracking-widest">
          — Sin noticias por el momento —
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {result.map(noticia => (
            <Link
              key={noticia.id}
              href={`/noticias/${noticia.slug}`}
              className="card-neon p-8 flex flex-col gap-5 group"
            >
              <div className="flex items-center gap-3 flex-wrap">
                <span className="font-orbitron text-xs text-neon/60 tracking-wider">
                  {new Date(noticia.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })}
                </span>
                <span className="text-gray-700">·</span>
                {noticia.sede && (
                  <span className="font-orbitron text-xs text-gray-600 tracking-wider border border-gray-800 px-2 py-0.5">
                    {noticia.sede}
                  </span>
                )}
              </div>

              <h2 className="font-orbitron text-base font-bold text-white group-hover:text-neon transition-colors leading-snug">
                {noticia.titulo}
              </h2>

              <p className="text-gray-500 text-sm leading-relaxed flex-1">{noticia.resumen}</p>

              <div className="flex items-center gap-2 font-orbitron text-xs text-neon/60 group-hover:text-neon transition-colors tracking-wider">
                <span>Leer noticia completa</span>
                <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
