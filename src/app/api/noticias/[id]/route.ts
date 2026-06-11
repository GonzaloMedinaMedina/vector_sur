import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { noticias } from '@/db/schema'
import { eq } from 'drizzle-orm'

type Params = { params: { id: string } }

export async function GET(_: NextRequest, { params }: Params) {
  const [noticia] = await db.select().from(noticias).where(eq(noticias.id, Number(params.id)))
  if (!noticia) return NextResponse.json({ error: 'No encontrado' }, { status: 404 })
  return NextResponse.json(noticia)
}

export async function PUT(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { titulo, fecha, sede, resumen, contenido, imagen } = body

  const [noticia] = await db.update(noticias)
    .set({ titulo, fecha: new Date(fecha), sede: sede || null, resumen, contenido, imagen: imagen || null })
    .where(eq(noticias.id, Number(params.id)))
    .returning()
  return NextResponse.json(noticia)
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  await db.delete(noticias).where(eq(noticias.id, Number(params.id)))
  return NextResponse.json({ ok: true })
}
