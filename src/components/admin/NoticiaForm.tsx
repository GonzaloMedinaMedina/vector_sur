'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type NoticiaData = {
  titulo: string
  fecha: string
  sede: string
  resumen: string
  contenido: string
  imagen: string
}

type Props = {
  id?: number
  initial?: NoticiaData
}

const SEDES = ['La Línea', 'Málaga', 'Sevilla', 'Melilla', 'Todas las sedes']

export default function NoticiaForm({ id, initial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<NoticiaData>(
    initial ?? { titulo: '', fecha: '', sede: '', resumen: '', contenido: '', imagen: '' }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof NoticiaData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const url = id ? `/api/noticias/${id}` : '/api/noticias'
    const method = id ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })

    setLoading(false)
    if (!res.ok) {
      const data = await res.json()
      setError(data.error ?? 'Error al guardar')
      return
    }
    router.push('/admin/noticias')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Título *</label>
        <input
          type="text"
          value={form.titulo}
          onChange={e => set('titulo', e.target.value)}
          className="input-neon w-full"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Fecha *</label>
          <input
            type="date"
            value={form.fecha}
            onChange={e => set('fecha', e.target.value)}
            className="input-neon w-full"
            required
          />
        </div>
        <div>
          <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Sede</label>
          <select
            value={form.sede}
            onChange={e => set('sede', e.target.value)}
            className="input-neon w-full"
          >
            <option value="">— Sin sede —</option>
            {SEDES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Imagen (ruta)</label>
        <input
          type="text"
          value={form.imagen}
          onChange={e => set('imagen', e.target.value)}
          placeholder="/noticias/foto.jpg"
          className="input-neon w-full"
        />
      </div>

      <div>
        <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Resumen *</label>
        <textarea
          value={form.resumen}
          onChange={e => set('resumen', e.target.value)}
          rows={3}
          className="input-neon w-full resize-none"
          required
        />
      </div>

      <div>
        <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Contenido *</label>
        <textarea
          value={form.contenido}
          onChange={e => set('contenido', e.target.value)}
          rows={10}
          className="input-neon w-full resize-y"
          required
        />
      </div>

      {error && (
        <p className="font-orbitron text-xs text-red-400 tracking-wider border border-red-900/40 bg-red-900/10 px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-neon px-8 py-3 font-orbitron text-xs tracking-widest disabled:opacity-50"
        >
          {loading ? 'Guardando...' : id ? 'Guardar cambios' : 'Crear noticia'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="font-orbitron text-xs text-gray-600 hover:text-gray-300 tracking-wider transition-colors"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
