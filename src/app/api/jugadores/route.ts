import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { jugadores } from '@/db/schema'
import { asc } from 'drizzle-orm'

export async function GET() {
  const result = await db.select().from(jugadores).orderBy(asc(jugadores.nombre))
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre, sede } = body

  if (!nombre) return NextResponse.json({ error: 'Falta el nombre' }, { status: 400 })

  const [jugador] = await db.insert(jugadores).values({ nombre, sede: sede || null }).returning()
  return NextResponse.json(jugador, { status: 201 })
}
