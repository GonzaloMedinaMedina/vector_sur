import { db } from '@/db'
import { torneos, jugadores } from '@/db/schema'
import { desc, asc } from 'drizzle-orm'
import ClasificacionAdmin from './ClasificacionAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminClasificacion() {
  const [torneosRaw, jugadoresResult] = await Promise.all([
    db.query.torneos.findMany({
      orderBy: [desc(torneos.anio), asc(torneos.fecha)],
      with: {
        clasificaciones: {
          with: { jugador: true },
          orderBy: (c, { asc }) => [asc(c.posicion)],
        },
      },
    }),
    db.select().from(jugadores).orderBy(asc(jugadores.nombre)),
  ])

  const torneosData = torneosRaw.map(t => ({
    ...t,
    fecha: t.fecha.toISOString().split('T')[0],
  }))

  return <ClasificacionAdmin torneos={torneosData} jugadores={jugadoresResult} />
}
