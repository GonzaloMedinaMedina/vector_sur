'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      setError('Email o contraseña incorrectos')
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 mx-auto relative mb-4">
            <Image src="/logo.png" alt="Vector Sur" fill className="object-contain" />
          </div>
          <h1 className="font-orbitron font-black text-2xl neon-text tracking-widest">VECTOR SUR</h1>
          <p className="text-gray-600 text-xs font-orbitron tracking-widest mt-1 uppercase">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="card-neon p-8 space-y-5">
          <div>
            <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="input-neon w-full"
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block font-orbitron text-xs text-neon/70 tracking-widest mb-2 uppercase">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="input-neon w-full"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <p className="font-orbitron text-xs text-red-400 tracking-wider border border-red-900/40 bg-red-900/10 px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-neon w-full py-3 font-orbitron text-xs tracking-widest uppercase disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Acceder'}
          </button>
        </form>
      </div>
    </div>
  )
}
