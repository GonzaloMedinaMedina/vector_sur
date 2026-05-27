import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import NoticiaForm from '@/components/admin/NoticiaForm'
import Link from 'next/link'

type Props = { params: { id: string } }

export default async function EditarNoticia({ params }: Props) {
  const noticia = await prisma.noticia.findUnique({ where: { id: Number(params.id) } })
  if (!noticia) notFound()

  const initial = {
    titulo: noticia.titulo,
    fecha: noticia.fecha.toISOString().split('T')[0],
    sede: noticia.sede ?? '',
    resumen: noticia.resumen,
    contenido: noticia.contenido,
    imagen: noticia.imagen ?? '',
  }

  return (
    <div>
      <div className="mb-10">
        <Link href="/admin/noticias" className="font-orbitron text-xs text-gray-600 hover:text-neon tracking-widest transition-colors mb-4 inline-block">
          ← Volver
        </Link>
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase mb-2">Admin · Noticias</p>
        <h1 className="font-orbitron text-2xl font-black neon-text">Editar Noticia</h1>
      </div>
      <NoticiaForm id={noticia.id} initial={initial} />
    </div>
  )
}
