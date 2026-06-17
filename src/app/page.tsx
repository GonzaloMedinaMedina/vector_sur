import Image from 'next/image'
import Link from 'next/link'
import { noticias } from '@/db/schema'
import { db } from '@/db'
import { desc } from 'drizzle-orm'

export default async function HomePage() {
    const ultimasNoticias = await db.select()
      .from(noticias)
      .orderBy(desc(noticias.fecha))
      .limit(3)

  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Ambient glow behind logo */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-96 h-96 rounded-full bg-neon/5 blur-[120px]" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-6">
          <div className="w-36 h-36 relative animate-pulse-neon">
            <Image src="/logo.png" alt="Vector Sur" fill className="object-contain drop-shadow-[0_0_30px_rgba(0,255,65,0.4)]" priority />
          </div>

          <div className="space-y-2">
            <h1 className="font-orbitron text-5xl sm:text-6xl lg:text-7xl font-black tracking-widest neon-text">
              VECTOR SUR
            </h1>
            <p className="font-orbitron text-sm sm:text-base tracking-[0.3em] text-gray-400 uppercase">
              Comunidad Infinity · Andalucía
            </p>
          </div>

          <hr className="neon-line w-48 my-2" />

          <p className="text-gray-400 max-w-xl text-sm sm:text-base leading-relaxed">
            Somos la comunidad oficial de{' '}
            <span className="text-neon font-semibold">Infinity</span> de Corvus Belli
            en Andalucía. Torneos, partidas, pintura y mucho más en{' '}
            La Línea, Málaga, Sevilla y Melilla.
          </p>

          <div className="flex flex-wrap gap-4 justify-center mt-2">
            <Link href="/noticias" className="btn-neon px-8 py-3 text-sm">
              Ver Noticias
            </Link>
            <Link
              href="/contacto"
              className="font-orbitron text-sm px-8 py-3 text-gray-400 border border-gray-700 hover:border-neon/50 hover:text-gray-200 transition-all tracking-widest"
            >
              Únete
            </Link>
          </div>
        </div>

        {/* Animated corner decorations */}
        <div className="absolute top-8 left-8 w-8 h-8 border-t border-l border-neon/40" />
        <div className="absolute top-8 right-8 w-8 h-8 border-t border-r border-neon/40" />
        <div className="absolute bottom-8 left-8 w-8 h-8 border-b border-l border-neon/40" />
        <div className="absolute bottom-8 right-8 w-8 h-8 border-b border-r border-neon/40" />
      </section>

      {/* ── SOBRE INFINITY ── */}
      <section className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="font-orbitron text-3xl font-bold section-heading">
                <span className="neon-text">¿Qué es</span>{' '}
                <span className="text-white">Infinity?</span>
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>
                  Infinity es un juego de miniaturas de ciencia ficción creado por{' '}
                  <strong className="text-gray-200">Corvus Belli</strong>, una empresa española
                  con sede en Vigo. Ambientado en un futuro distante de alta tecnología,
                  nanorobótica e inteligencias artificiales, el juego enfrenta a facciones
                  de todo el planeta en un conflicto por el dominio de la humanidad.
                </p>
                <p>
                  El sistema de reglas de Infinity destaca por ser altamente táctico y
                  reactivo: los jugadores interactúan durante el turno del rival, lo que
                  convierte cada partida en un duelo mental constante.
                </p>
                <p>
                  Las miniaturas de Infinity son reconocidas mundialmente por su{' '}
                  <strong className="text-gray-200">extraordinaria calidad artística</strong>,
                  combinando estética cyberpunk, manga y thrillers de espionaje.
                </p>
              </div>
              <a
                href="https://www.corvusbelli.com/infinity"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block btn-neon px-6 py-2 text-xs"
              >
                Web oficial de Corvus Belli ↗
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '⚔️', title: 'Alta Táctica', desc: 'Sistema ARO — reacciona durante el turno del enemigo' },
                { icon: '🎨', title: 'Arte Único', desc: 'Miniaturas de nivel artístico incomparable' },
                { icon: '🌍', title: 'Escenario Épico', desc: 'Universo rico en lore: facciones, política y transhumanismo' },
                { icon: '🏆', title: 'Competitivo', desc: 'Circuito de torneos nacional e internacional' },
              ].map(item => (
                <div key={item.title} className="card-neon p-5 space-y-2">
                  <div className="text-2xl">{item.icon}</div>
                  <h3 className="font-orbitron text-xs font-bold text-neon tracking-wider">{item.title}</h3>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ÚLTIMAS NOTICIAS ── */}
      <section className="py-24 px-4 bg-card/30">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex items-end justify-between">
            <h2 className="font-orbitron text-3xl font-bold section-heading">
              <span className="neon-text">Últimas</span>{' '}
              <span className="text-white">Noticias</span>
            </h2>
            <Link href="/noticias" className="font-orbitron text-xs text-neon/70 hover:text-neon tracking-widest transition-colors">
              Ver todas →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ultimasNoticias.length > 0 ? ultimasNoticias.map(noticia => (
              <Link
                key={noticia.id}
                href={`/noticias/${noticia.slug}`}
                className="card-neon p-6 flex flex-col gap-4 group"
              >
                <div className="flex items-center gap-2">
                  <span className="font-orbitron text-xs text-neon/60 tracking-wider">
                    {new Date(noticia.fecha).toLocaleDateString('es-ES', {
                      day: '2-digit', month: 'short', year: 'numeric',
                    })}
                  </span>
                  <span className="text-gray-700">·</span>
                  <span className="font-orbitron text-xs text-gray-600 tracking-wider">{noticia.sede}</span>
                </div>
                <h3 className="font-orbitron text-sm font-bold text-white group-hover:text-neon transition-colors leading-snug">
                  {noticia.titulo}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed flex-1">{noticia.resumen}</p>
                <span className="font-orbitron text-xs text-neon/60 group-hover:text-neon transition-colors tracking-wider">
                  Leer más →
                </span>
              </Link>
            )) : `No hay noticias nuevas`}
          </div>
        </div>
      </section>

      {/* ── SEDES CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="font-orbitron text-3xl font-bold">
            <span className="text-white">Encuéntranos</span>{' '}
            <span className="neon-text">cerca de ti</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed">
            Tenemos sedes activas en toda Andalucía y Melilla. Visítanos, conoce a la
            comunidad y empieza tu aventura en el universo de Infinity.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {['la-linea', 'malaga', 'sevilla', 'melilla'].map((slug, i) => (
              <Link
                key={slug}
                href={`/sedes/${slug}`}
                className="btn-neon px-6 py-2 text-xs"
              >
                {['La Línea', 'Málaga', 'Sevilla', 'Melilla'][i]}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
