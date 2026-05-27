import NoticiaForm from '@/components/admin/NoticiaForm'
import Link from 'next/link'

export default function NuevaNoticias() {
  return (
    <div>
      <div className="mb-10">
        <Link href="/admin/noticias" className="font-orbitron text-xs text-gray-600 hover:text-neon tracking-widest transition-colors mb-4 inline-block">
          ← Volver
        </Link>
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase mb-2">Admin · Noticias</p>
        <h1 className="font-orbitron text-2xl font-black neon-text">Nueva Noticia</h1>
      </div>
      <NoticiaForm />
    </div>
  )
}
