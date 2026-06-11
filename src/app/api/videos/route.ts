import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { videos } from '@/db/schema'
import { desc } from 'drizzle-orm'

export async function GET() {
  const result = await db.select().from(videos).orderBy(desc(videos.fecha))
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { titulo, descripcion, youtubeId, fecha, sede } = body

  if (!titulo || !youtubeId || !fecha) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const [video] = await db.insert(videos).values({
    titulo,
    descripcion: descripcion || null,
    youtubeId,
    fecha: new Date(fecha),
    sede: sede || null,
  }).returning()
  return NextResponse.json(video, { status: 201 })
}
