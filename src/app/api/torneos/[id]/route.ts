import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { torneos } from '@/db/schema'
import { eq, asc } from 'drizzle-orm'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const torneo = await db.query.torneos.findFirst({
    where: eq(torneos.id, Number(params.id)),
    with: {
      clasificaciones: {
        with: { jugador: true },
        orderBy: (c, { asc }) => [asc(c.posicion)],
      },
    },
  })
  if (!torneo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(torneo)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre, sede, anio, fecha, puntosPorPosicion } = body

  const [torneo] = await db.update(torneos)
    .set({
      nombre,
      sede,
      anio: Number(anio),
      fecha: new Date(fecha),
      ...(puntosPorPosicion !== undefined && { puntosPorPosicion: JSON.stringify(puntosPorPosicion) }),
    })
    .where(eq(torneos.id, Number(params.id)))
    .returning()
  return NextResponse.json(torneo)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await db.delete(torneos).where(eq(torneos.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}
