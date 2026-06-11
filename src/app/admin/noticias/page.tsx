import { db } from '@/db'
import { noticias } from '@/db/schema'
import { desc } from 'drizzle-orm'
import Link from 'next/link'
import DeleteButton from '@/components/admin/DeleteButton'

export const dynamic = 'force-dynamic'

export default async function AdminNoticias() {
  const result = await db.select().from(noticias).orderBy(desc(noticias.fecha))

  return (
    <div>
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <div>
          <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase mb-2">Admin</p>
          <h1 className="font-orbitron text-2xl font-black neon-text">Noticias</h1>
        </div>
        <Link href="/admin/noticias/nueva" className="btn-neon px-6 py-2 font-orbitron text-xs tracking-widest">
          + Nueva
        </Link>
      </div>

      {result.length === 0 ? (
        <p className="text-gray-600 font-orbitron text-xs tracking-widest text-center py-16">Sin noticias</p>
      ) : (
        <div className="space-y-3">
          {result.map(n => (
            <div key={n.id} className="card-neon p-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex-1 min-w-0">
                <p className="font-orbitron text-xs text-neon/50 tracking-wider mb-1">
                  {new Date(n.fecha).toLocaleDateString('es-ES')} {n.sede && `· ${n.sede}`}
                </p>
                <p className="text-white font-medium truncate">{n.titulo}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/noticias/${n.slug}`}
                  target="_blank"
                  className="font-orbitron text-xs text-gray-600 hover:text-gray-300 tracking-wider transition-colors"
                >
                  Ver ↗
                </Link>
                <Link
                  href={`/admin/noticias/${n.id}`}
                  className="font-orbitron text-xs text-neon/60 hover:text-neon tracking-wider transition-colors border border-neon/20 hover:border-neon/60 px-3 py-1.5"
                >
                  Editar
                </Link>
                <DeleteButton id={n.id} tipo="noticias" label="Eliminar" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
