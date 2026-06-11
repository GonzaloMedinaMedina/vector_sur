import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/db'
import { noticias } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

export async function GET() {
  const result = await db.select().from(noticias).orderBy(desc(noticias.fecha))
  return NextResponse.json(result)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const body = await req.json()
  const { titulo, fecha, sede, resumen, contenido, imagen } = body

  if (!titulo || !fecha || !resumen || !contenido) {
    return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
  }

  const baseSlug = slugify(titulo)
  let slug = baseSlug
  let count = 1
  while (true) {
    const [existing] = await db.select({ id: noticias.id }).from(noticias).where(eq(noticias.slug, slug))
    if (!existing) break
    slug = `${baseSlug}-${count++}`
  }

  const [noticia] = await db.insert(noticias).values({
    slug,
    titulo,
    fecha: new Date(fecha),
    sede: sede || null,
    resumen,
    contenido,
    imagen: imagen || null,
  }).returning()
  return NextResponse.json(noticia, { status: 201 })
}
