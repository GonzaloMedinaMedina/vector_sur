import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function AdminDashboard() {
  const [noticias, videos, torneos, jugadores] = await Promise.all([
    prisma.noticia.count(),
    prisma.video.count(),
    prisma.torneo.count(),
    prisma.jugador.count(),
  ])

  const cards = [
    { href: '/admin/noticias', label: 'Noticias', count: noticias, action: 'Nueva noticia' },
    { href: '/admin/videos', label: 'Videos', count: videos, action: 'Nuevo video' },
    { href: '/admin/clasificacion', label: 'Torneos', count: torneos, action: 'Gestionar' },
    { href: '/admin/clasificacion', label: 'Jugadores', count: jugadores, action: 'Gestionar' },
  ]

  return (
    <div>
      <div className="mb-10">
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase mb-2">Panel de control</p>
        <h1 className="font-orbitron text-3xl font-black neon-text">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(card => (
          <Link key={card.label} href={card.href} className="card-neon p-6 flex flex-col gap-3 group">
            <p className="font-orbitron text-xs text-neon/60 tracking-widest uppercase">{card.label}</p>
            <p className="font-orbitron text-4xl font-black text-white group-hover:neon-text transition-colors">
              {card.count}
            </p>
            <p className="font-orbitron text-xs text-gray-600 tracking-wider group-hover:text-neon/60 transition-colors">
              {card.action} →
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/admin/noticias/nueva" className="btn-neon text-center py-3 font-orbitron text-xs tracking-widest">
          + Nueva Noticia
        </Link>
        <Link href="/admin/videos/nuevo" className="btn-neon text-center py-3 font-orbitron text-xs tracking-widest">
          + Nuevo Video
        </Link>
        <Link href="/admin/clasificacion" className="btn-neon text-center py-3 font-orbitron text-xs tracking-widest">
          + Gestionar Clasificación
        </Link>
      </div>
    </div>
  )
}
