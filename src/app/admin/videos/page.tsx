import { db } from '@/db'
import { videos } from '@/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminVideos() {
  const result = await db.select().from(videos).orderBy(desc(videos.fecha))

  return (
    <div>
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase mb-2">Admin</p>
          <h1 className="font-orbitron text-2xl font-black neon-text">Videos</h1>
        </div>
        <Link href="/admin/videos/nuevo" className="btn-neon px-6 py-2 font-orbitron text-xs tracking-widest">
          + Nuevo
        </Link>
      </div>

      {result.length === 0 ? (
        <p className="text-gray-600 font-orbitron text-xs tracking-widest text-center py-16">Sin videos</p>
      ) : (
        <div className="space-y-3">
          {result.map(v => (
            <div key={v.id} className="card-neon p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-orbitron text-xs text-neon/50 tracking-wider mb-1">
                  {new Date(v.fecha).toLocaleDateString('es-ES')} · youtube:{v.youtubeId}
                </p>
                <p className="text-white font-medium truncate">{v.titulo}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href={`https://www.youtube.com/watch?v=${v.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-orbitron text-xs text-gray-600 hover:text-gray-300 tracking-wider transition-colors"
                >
                  Ver ↗
                </a>
                <Link
                  href={`/admin/videos/${v.id}`}
                  className="font-orbitron text-xs text-neon/60 hover:text-neon tracking-wider transition-colors border border-neon/20 hover:border-neon/60 px-3 py-1.5"
                >
                  Editar
                </Link>
                <DeleteButton id={v.id} tipo="videos" label="Eliminar" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
