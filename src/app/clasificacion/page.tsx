import { prisma } from '@/lib/prisma'
import ClasificacionClient from './ClasificacionClient'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Clasificación — Vector Sur',
  description: 'Clasificación anual y por torneo de la comunidad Vector Sur.',
}

export default async function ClasificacionPage() {
  const torneosRaw = await prisma.torneo.findMany({
    orderBy: [{ anio: 'desc' }, { fecha: 'asc' }],
    include: {
      clasificaciones: {
        include: { jugador: true },
        orderBy: { posicion: 'asc' },
      },
    },
  })

  // Serializar Date → string para poder pasar a componentes cliente
  const torneos = torneosRaw.map(t => ({
    ...t,
    fecha: t.fecha.toISOString().split('T')[0],
  }))

  const años = [...new Set(torneos.map(t => t.anio))].sort((a, b) => b - a)

  return <ClasificacionClient torneos={torneos} años={años} />
}
