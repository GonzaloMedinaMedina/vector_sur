import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const torneoId = searchParams.get('torneoId')
  const anio = searchParams.get('anio')

  if (torneoId) {
    const entries = await prisma.clasificacionEntry.findMany({
      where: { torneoId: Number(torneoId) },
      include: { jugador: true, torneo: true },
      orderBy: { posicion: 'asc' },
    })
    return NextResponse.json(entries)
  }

  if (anio) {
    const entries = await prisma.clasificacionEntry.findMany({
      where: { torneo: { anio: Number(anio) } },
      include: { jugador: true, torneo: true },
      orderBy: { posicion: 'asc' },
    })
    return NextResponse.json(entries)
  }

  const entries = await prisma.clasificacionEntry.findMany({
    include: { jugador: true, torneo: true },
    orderBy: { posicion: 'asc' },
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

  const torneo = await prisma.torneo.findUnique({ where: { id: Number(torneoId) } })
  if (!torneo) return NextResponse.json({ error: 'Torneo no encontrado' }, { status: 404 })

  const pts = JSON.parse(torneo.puntosPorPosicion) as Record<string, number>
  const puntos = pts[String(posicion)] ?? pts['default'] ?? 0

  const entry = await prisma.clasificacionEntry.upsert({
    where: { jugadorId_torneoId: { jugadorId: Number(jugadorId), torneoId: Number(torneoId) } },
    update: { posicion: Number(posicion), puntos },
    create: {
      jugadorId: Number(jugadorId),
      torneoId: Number(torneoId),
      posicion: Number(posicion),
      puntos,
    },
  })
  return NextResponse.json(entry, { status: 201 })
}
