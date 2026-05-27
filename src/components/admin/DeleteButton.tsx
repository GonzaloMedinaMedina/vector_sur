'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

type Props = { id: number; tipo: string; label?: string }

export default function DeleteButton({ id, tipo, label = 'Eliminar' }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleDelete() {
    if (!confirm('¿Seguro que quieres eliminar este elemento?')) return
    setLoading(true)
    await fetch(`/api/${tipo}/${id}`, { method: 'DELETE' })
    router.refresh()
    setLoading(false)
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="font-orbitron text-xs text-gray-700 hover:text-red-400 tracking-wider transition-colors border border-gray-800 hover:border-red-900 px-3 py-1.5 disabled:opacity-50"
    >
      {loading ? '...' : label}
    </button>
  )
}
