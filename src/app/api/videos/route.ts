import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const videos = await prisma.video.findMany({ orderBy: { fecha: 'desc' } })
  return NextResponse.json(videos)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { titulo, descripcion, youtubeId, fecha, sede } = body

  if (!titulo || !youtubeId || !fecha) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const video = await prisma.video.create({
    data: {
      titulo,
      descripcion: descripcion || null,
      youtubeId,
      fecha: new Date(fecha),
      sede: sede || null,
    },
  })
  return NextResponse.json(video, { status: 201 })
}
