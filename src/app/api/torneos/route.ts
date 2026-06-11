import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { torneos } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const result = await db.query.torneos.findMany({
    with: {
      clasificaciones: {
        with: { jugador: true },
      },
    },
    orderBy: [desc(torneos.anio), desc(torneos.fecha)],
  })
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre, sede, anio, fecha, puntosPorPosicion } = body

  if (!nombre || !sede || !anio || !fecha) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const [torneo] = await db.insert(torneos).values({
    nombre,
    sede,
    anio: Number(anio),
    fecha: new Date(fecha),
    puntosPorPosicion: puntosPorPosicion
      ? JSON.stringify(puntosPorPosicion)
      : '{"1":10,"2":8,"3":6,"4":5,"5":4,"6":3,"7":2,"default":1}',
  }).returning()
  return NextResponse.json(torneo, { status: 201 })
}
