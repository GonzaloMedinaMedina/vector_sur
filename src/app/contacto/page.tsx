'use client'

import { useState, FormEvent } from 'react'

export default function ContactoPage() {
  const [form, setForm] = useState({ nombre: '', email: '', asunto: '', mensaje: '' })
  const [status, setStatus] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      setStatus(res.ok ? 'ok' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12 space-y-3">
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase">Vector Sur</p>
        <h1 className="font-orbitron text-4xl font-black section-heading">
          <span className="neon-text">Contacto</span>
        </h1>
        <p className="text-gray-500 text-sm mt-6 leading-relaxed">
          ¿Quieres unirte a la comunidad, organizar un evento o tienes alguna pregunta?
          Escríbenos y te respondemos lo antes posible.
        </p>
      </div>

      <hr className="neon-line mb-12" />

      {status === 'ok' ? (
        <div className="card-neon p-10 text-center space-y-4">
          <div className="text-4xl">✓</div>
          <h2 className="font-orbitron text-lg text-neon">Mensaje enviado</h2>
          <p className="text-gray-400 text-sm">
            Hemos recibido tu mensaje. Te responderemos en breve.
          </p>
          <button
            onClick={() => { setForm({ nombre: '', email: '', asunto: '', mensaje: '' }); setStatus('idle') }}
            className="btn-neon px-6 py-2 text-xs mt-2"
          >
            Enviar otro mensaje
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div className="space-y-2">
            <label className="font-orbitron text-xs text-gray-400 tracking-widest uppercase">
              Nombre <span className="text-neon">*</span>
            </label>
            <input
              type="text"
              name="nombre"
              required
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              className="input-neon w-full px-4 py-3 text-sm rounded-none"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="font-orbitron text-xs text-gray-400 tracking-widest uppercase">
              Email <span className="text-neon">*</span>
            </label>
            <input
              type="email"
              name="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              className="input-neon w-full px-4 py-3 text-sm rounded-none"
            />
          </div>

          {/* Asunto */}
          <div className="space-y-2">
            <label className="font-orbitron text-xs text-gray-400 tracking-widest uppercase">
              Asunto <span className="text-neon">*</span>
            </label>
            <select
              name="asunto"
              required
              value={form.asunto}
              onChange={handleChange}
              className="input-neon w-full px-4 py-3 text-sm rounded-none appearance-none bg-[#0d0d14]"
            >
              <option value="" disabled>Selecciona un asunto</option>
              <option value="Unirse a la comunidad">Unirse a la comunidad</option>
              <option value="Información sobre torneos">Información sobre torneos</option>
              <option value="Información sobre sedes">Información sobre sedes</option>
              <option value="Colaboración / Patrocinio">Colaboración / Patrocinio</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <label className="font-orbitron text-xs text-gray-400 tracking-widest uppercase">
              Mensaje <span className="text-neon">*</span>
            </label>
            <textarea
              name="mensaje"
              required
              rows={6}
              value={form.mensaje}
              onChange={handleChange}
              placeholder="Escribe tu mensaje aquí..."
              className="input-neon w-full px-4 py-3 text-sm rounded-none resize-none"
            />
          </div>

          {status === 'error' && (
            <p className="font-orbitron text-xs text-red-500 tracking-wider">
              Error al enviar el mensaje. Inténtalo de nuevo.
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'sending'}
            className="btn-neon w-full py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === 'sending' ? '[ ENVIANDO... ]' : '[ ENVIAR MENSAJE ]'}
          </button>
        </form>
      )}
    </div>
  )
}
