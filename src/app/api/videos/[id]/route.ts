import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { videos } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const [video] = await db.select().from(videos).where(eq(videos.id, Number(params.id)))
  if (!video) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(video)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { titulo, descripcion, youtubeId, fecha, sede } = body

  const [video] = await db.update(videos)
    .set({ titulo, descripcion: descripcion || null, youtubeId, fecha: new Date(fecha), sede: sede || null })
    .where(eq(videos.id, Number(params.id)))
    .returning()
  return NextResponse.json(video)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await db.delete(videos).where(eq(videos.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}
