'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type VideoData = { titulo: string; descripcion: string; youtubeId: string; fecha: string; sede: string }
type Props = { id?: number; initial?: VideoData }

const SEDES = ['La Línea', 'Málaga', 'Sevilla', 'Melilla']

export default function VideoForm({ id, initial }: Props) {
  const router = useRouter()
  const [form, setForm] = useState<VideoData>(
    initial ?? { titulo: '', descripcion: '', youtubeId: '', fecha: '', sede: '' }
  )
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function set(field: keyof VideoData, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const url = id ? `/api/videos/${id}` : '/api/videos'
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
    router.push('/admin/videos')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Título *</label>
        <input type="text" value={form.titulo} onChange={e => set('titulo', e.target.value)} className="input-neon w-full" required />
      </div>

      <div>
        <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">YouTube ID *</label>
        <input
          type="text"
          value={form.youtubeId}
          onChange={e => set('youtubeId', e.target.value)}
          placeholder="dQw4w9WgXcQ"
          className="input-neon w-full"
          required
        />
        <p className="text-gray-600 text-xs mt-1 font-orbitron tracking-wider">El ID que aparece en ?v= de la URL de YouTube</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Fecha *</label>
          <input type="date" value={form.fecha} onChange={e => set('fecha', e.target.value)} className="input-neon w-full" required />
        </div>
        <div>
          <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Sede</label>
          <select value={form.sede} onChange={e => set('sede', e.target.value)} className="input-neon w-full">
            <option value="">— Sin sede —</option>
            {SEDES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Descripción</label>
        <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} rows={4} className="input-neon w-full resize-none" />
      </div>

      {error && (
        <p className="font-orbitron text-xs text-red-400 tracking-wider border border-red-900/40 bg-red-900/10 px-3 py-2">{error}</p>
      )}

      <div className="flex items-center gap-4">
        <button type="submit" disabled={loading} className="btn-neon px-8 py-3 font-orbitron text-xs tracking-widest disabled:opacity-50">
          {loading ? 'Guardando...' : id ? 'Guardar cambios' : 'Crear video'}
        </button>
        <button type="button" onClick={() => router.back()} className="font-orbitron text-xs text-gray-600 hover:text-gray-300 tracking-wider transition-colors">
          Cancelar
        </button>
      </div>
    </form>
  )
}
