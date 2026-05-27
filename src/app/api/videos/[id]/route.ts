import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const video = await prisma.video.findUnique({ where: { id: Number(params.id) } })
  if (!video) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(video)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { titulo, descripcion, youtubeId, fecha, sede } = body

  const video = await prisma.video.update({
    where: { id: Number(params.id) },
    data: {
      titulo,
      descripcion: descripcion || null,
      youtubeId,
      fecha: new Date(fecha),
      sede: sede || null,
    },
  })
  return NextResponse.json(video)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await prisma.video.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
