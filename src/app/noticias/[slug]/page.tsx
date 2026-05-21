import { notFound } from 'next/navigation'
import Link from 'next/link'
import noticias from '@/data/noticias.json'

type Props = { params: { slug: string } }

export function generateStaticParams() {
  return noticias.noticias.map(n => ({ slug: n.slug }))
}

export function generateMetadata({ params }: Props) {
  const noticia = noticias.noticias.find(n => n.slug === params.slug)
  if (!noticia) return {}
  return {
    title: `${noticia.titulo} — Vector Sur`,
    description: noticia.resumen,
  }
}

export default function NoticiaPage({ params }: Props) {
  const noticia = noticias.noticias.find(n => n.slug === params.slug)
  if (!noticia) notFound()

  const parrafos = noticia.contenido.split('\n\n').filter(Boolean)

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Back */}
      <Link
        href="/noticias"
        className="inline-flex items-center gap-2 font-orbitron text-xs text-neon/60 hover:text-neon tracking-widest mb-10 transition-colors"
      >
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Volver a noticias
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-3 flex-wrap mb-5">
        <span className="font-orbitron text-xs text-neon/60 tracking-wider">
          {new Date(noticia.fecha).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <span className="text-gray-700">·</span>
        <span className="font-orbitron text-xs text-gray-600 tracking-wider border border-gray-800 px-2 py-0.5">
          {noticia.sede}
        </span>
      </div>

      {/* Title */}
      <h1 className="font-orbitron text-3xl font-black text-white leading-snug mb-6">
        {noticia.titulo}
      </h1>

      <hr className="neon-line mb-10" />

      {/* Content */}
      <article className="space-y-5 text-gray-400 leading-relaxed">
        {parrafos.map((parrafo, i) => (
          <p key={i} className="whitespace-pre-line">
            {parrafo}
          </p>
        ))}
      </article>

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-neon/10">
        <Link
          href="/noticias"
          className="font-orbitron text-xs text-neon/60 hover:text-neon tracking-widest transition-colors"
        >
          ← Todas las noticias
        </Link>
      </div>
    </div>
  )
}
