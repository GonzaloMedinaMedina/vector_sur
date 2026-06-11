import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { clasificacionEntries, torneos } from '@/db/schema'
import { eq, asc, inArray } from 'drizzle-orm'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const torneoId = searchParams.get('torneoId')
  const anio = searchParams.get('anio')

  if (torneoId) {
    const entries = await db.query.clasificacionEntries.findMany({
      where: eq(clasificacionEntries.torneoId, Number(torneoId)),
      with: { jugador: true, torneo: true },
      orderBy: (c, { asc }) => [asc(c.posicion)],
    })
    return NextResponse.json(entries)
  }

  if (anio) {
    const anioTorneos = await db.select({ id: torneos.id }).from(torneos).where(eq(torneos.anio, Number(anio)))
    const ids = anioTorneos.map(t => t.id)
    if (ids.length === 0) return NextResponse.json([])

    const entries = await db.query.clasificacionEntries.findMany({
      where: inArray(clasificacionEntries.torneoId, ids),
      with: { jugador: true, torneo: true },
      orderBy: (c, { asc }) => [asc(c.posicion)],
    })
    return NextResponse.json(entries)
  }

  const entries = await db.query.clasificacionEntries.findMany({
    with: { jugador: true, torneo: true },
    orderBy: (c, { asc }) => [asc(c.posicion)],
  })
  return NextResponse.json(entries)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { jugadorId, torneoId, posicion } = body

  if (!jugadorId || !torneoId || posicion === undefined) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const [torneo] = await db.select().from(torneos).where(eq(torneos.id, Number(torneoId)))
  if (!torneo) return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 })

  const pts = JSON.parse(torneo.puntosPorPosicion) as Record<string, number>
  const puntos = pts[String(posicion)] ?? pts['default'] ?? 0

  const [entry] = await db.insert(clasificacionEntries)
    .values({ jugadorId: Number(jugadorId), torneoId: Number(torneoId), posicion: Number(posicion), puntos })
    .onConflictDoUpdate({
      target: [clasificacionEntries.jugadorId, clasificacionEntries.torneoId],
      set: { posicion: Number(posicion), puntos },
    })
    .returning()
  return NextResponse.json(entry, { status: 201 })
}
