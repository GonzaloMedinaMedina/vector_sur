import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const jugadores = await prisma.jugador.findMany({ orderBy: { nombre: 'asc' } })
  return NextResponse.json(jugadores)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre, sede } = body

  if (!nombre) return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 })

  const jugador = await prisma.jugador.create({ data: { nombre, sede: sede || null } })
  return NextResponse.json(jugador, { status: 201 })
}
