import { db } from '@/db'
import { torneos } from '@/db/schema'
import { desc, asc } from 'drizzle-orm'
import ClasificacionClient from './ClasificacionClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Clasificación — Vector Sur',
  description: 'Clasificación anual y por torneo de la comunidad Vector Sur.',
}

export default async function ClasificacionPage() {
  const torneosRaw = await db.query.torneos.findMany({
    orderBy: [desc(torneos.anio), asc(torneos.fecha)],
    with: {
      clasificaciones: {
        with: { jugador: true },
        orderBy: (c, { asc }) => [asc(c.posicion)],
      },
    },
  })

  const torneosData = torneosRaw.map(t => ({
    ...t,
    fecha: t.fecha.toISOString().split('T')[0],
  }))

  const años = [...new Set(torneosData.map(t => t.anio))].sort((a, b) => b - a)

  return <ClasificacionClient torneos={torneosData} años={años} />
}
