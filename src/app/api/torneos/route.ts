import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const torneos = await prisma.torneo.findMany({
    orderBy: [{ anio: 'desc' }, { fecha: 'desc' }],
    include: { clasificaciones: { include: { jugador: true } } },
  })
  return NextResponse.json(torneos)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre, sede, anio, fecha, puntosPorPosicion } = body

  if (!nombre || !sede || !anio || !fecha) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const torneo = await prisma.torneo.create({
    data: {
      nombre,
      sede,
      anio: Number(anio),
      fecha: new Date(fecha),
      puntosPorPosicion: puntosPorPosicion
        ? JSON.stringify(puntosPorPosicion)
        : '{"1":10,"2":8,"3":6,"4":5,"5":4,"6":3,"7":2,"default":1}',
    },
  })
  return NextResponse.json(torneo, { status: 201 })
}
