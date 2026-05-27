import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const noticia = await prisma.noticia.findUnique({ where: { id: Number(params.id) } })
  if (!noticia) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(noticia)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { titulo, fecha, sede, resumen, contenido, imagen } = body

  const noticia = await prisma.noticia.update({
    where: { id: Number(params.id) },
    data: {
      titulo,
      fecha: new Date(fecha),
      sede: sede || null,
      resumen,
      contenido,
      imagen: imagen || null,
    },
  })
  return NextResponse.json(noticia)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await prisma.noticia.delete({ where: { id: Number(params.id) } })
  return NextResponse.json({ ok: true })
}
