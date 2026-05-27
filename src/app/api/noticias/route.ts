import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

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
  const noticias = await prisma.noticia.findMany({
    orderBy: { fecha: 'desc' },
  })
  return NextResponse.json(noticias)
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
  while (await prisma.noticia.findUnique({ where: { slug } })) {
    slug = `${baseSlug}-${count++}`
  }

  const noticia = await prisma.noticia.create({
    data: {
      slug,
      titulo,
      fecha: new Date(fecha),
      sede: sede || null,
      resumen,
      contenido,
      imagen: imagen || null,
    },
  })
  return NextResponse.json(noticia, { status: 201 })
}
