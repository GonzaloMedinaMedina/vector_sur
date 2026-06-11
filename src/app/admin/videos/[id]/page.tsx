import { db } from '@/db'
import { videos } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { notFound } from 'next/navigation'
import VideoForm from '@/components/admin/VideoForm'
import Link from 'next/link'

type Props = { params: { id: string } }

export default async function EditarVideo({ params }: Props) {
  const [video] = await db.select().from(videos).where(eq(videos.id, Number(params.id)))
  if (!video) notFound()

  const initial = {
    titulo: video.titulo,
    descripcion: video.descripcion ?? '',
    youtubeId: video.youtubeId,
    fecha: video.fecha.toISOString().split('T')[0],
    sede: video.sede ?? '',
  }

  return (
    <div>
      <div className="mb-10">
        <Link href="/admin/videos" className="font-orbitron text-xs text-gray-600 hover:text-neon tracking-widest transition-colors mb-4 inline-block">
          ← Volver
        </Link>
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase mb-2">Admin · Videos</p>
        <h1 className="font-orbitron text-2xl font-black neon-text">Editar Video</h1>
      </div>
      <VideoForm id={video.id} initial={initial} />
    </div>
  )
}
