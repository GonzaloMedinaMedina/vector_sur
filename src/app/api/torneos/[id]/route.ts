import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const torneo = await prisma.torneo.findUnique({
    where: { id: Number(params.id) },
    include: { clasificaciones: { include: { jugador: true }, orderBy: { posicion: 'asc' } } },
  })
  if (!torneo) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(torneo)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre, sede, anio, fecha, puntosPorPosicion } = body

  const torneo = await prisma.torneo.update({
    where: { id: Number(params.id) },
    data: {
      nombre,
      sede,
      anio: Number(anio),
      fecha: new Date(fecha),
      puntosPorPosicion: puntosPorPosicion ? JSON.stringify(puntosPorPosicion) : undefined,
    },
  })
  return NextResponse.json(torneo)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await prisma.torneo.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
