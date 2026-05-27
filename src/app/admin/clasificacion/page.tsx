import { prisma } from '@/lib/prisma'
import ClasificacionAdmin from './ClasificacionAdmin'

export const dynamic = 'force-dynamic'

export default async function AdminClasificacion() {
  const [torneosRaw, jugadores] = await Promise.all([
    prisma.torneo.findMany({
      orderBy: [{ anio: 'desc' }, { fecha: 'asc' }],
      include: {
        clasificaciones: {
          include: { jugador: true },
          orderBy: { posicion: 'asc' },
        },
      },
    }),
    prisma.jugador.findMany({ orderBy: { nombre: 'asc' } }),
  ])

  // Serializar Date → string para poder pasar a componentes cliente
  const torneos = torneosRaw.map(t => ({
    ...t,
    fecha: t.fecha.toISOString().split('T')[0],
  }))

  return <ClasificacionAdmin torneos={torneos} jugadores={jugadores} />
}
