import VideoForm from '@/components/admin/VideoForm'
import Link from 'next/link'

export default function NuevoVideo() {
  return (
    <div>
      <div className="mb-10">
        <Link href="/admin/videos" className="font-orbitron text-xs text-gray-600 hover:text-neon tracking-widest transition-colors mb-4 inline-block">
          ← Volver
        </Link>
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase mb-2">Admin · Videos</p>
        <h1 className="font-orbitron text-2xl font-black neon-text">Nuevo Video</h1>
      </div>
      <VideoForm />
    </div>
  )
}
