import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { jugadores } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: { id: string } }

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { nombre, sede } = body

  const [jugador] = await db.update(jugadores)
    .set({ nombre, sede: sede || null })
    .where(eq(jugadores.id, Number(params.id)))
    .returning()
  return NextResponse.json(jugador)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await db.delete(jugadores).where(eq(jugadores.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}
