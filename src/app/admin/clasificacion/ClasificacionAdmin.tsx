'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

type Jugador = { id: number; nombre: string; sede: string | null }
type Entrada = { id: number; jugadorId: number; posicion: number; puntos: number; jugador: Jugador }
type Torneo = {
  id: number; nombre: string; sede: string; anio: number; fecha: string
  clasificaciones: Entrada[]
}

type Props = { torneos: Torneo[]; jugadores: Jugador[] }

const PUNTOS_DEFAULT = { "1": 10, "2": 8, "3": 6, "4": 5, "5": 4, "6": 3, "7": 2, "default": 1 }
const SEDES_TORNEO = ['Málaga', 'La Línea', 'Sevilla']
const SEDES_JUGADOR = ['La Línea', 'Málaga', 'Sevilla', 'Melilla']

export default function ClasificacionAdmin({ torneos, jugadores }: Props) {
  const router = useRouter()
  const [, startTransition] = useTransition()
  const [tab, setTab] = useState<'torneos' | 'jugadores'>('torneos')
  const [torneoAbierto, setTorneoAbierto] = useState<number | null>(torneos[0]?.id ?? null)

  // Torneo form
  const [torneoForm, setTorneoForm] = useState({ nombre: '', sede: 'Málaga', anio: new Date().getFullYear(), fecha: '' })
  const [torneoLoading, setTorneoLoading] = useState(false)

  // Jugador form
  const [jugadorForm, setJugadorForm] = useState({ nombre: '', sede: '' })
  const [jugadorLoading, setJugadorLoading] = useState(false)

  // Entrada form
  const [entradaForm, setEntradaForm] = useState({ jugadorId: '', posicion: '' })
  const [entradaLoading, setEntradaLoading] = useState(false)

  function refresh() {
    startTransition(() => router.refresh())
  }

  async function crearTorneo(e: React.FormEvent) {
    e.preventDefault()
    setTorneoLoading(true)
    await fetch('/api/torneos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...torneoForm, puntosPorPosicion: PUNTOS_DEFAULT }),
    })
    setTorneoForm({ nombre: '', sede: 'Málaga', anio: new Date().getFullYear(), fecha: '' })
    setTorneoLoading(false)
    refresh()
  }

  async function eliminarTorneo(id: number) {
    if (!confirm('¿Eliminar torneo y todos sus resultados?')) return
    await fetch(`/api/torneos/${id}`, { method: 'DELETE' })
    if (torneoAbierto === id) setTorneoAbierto(null)
    refresh()
  }

  async function crearJugador(e: React.FormEvent) {
    e.preventDefault()
    setJugadorLoading(true)
    await fetch('/api/jugadores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(jugadorForm),
    })
    setJugadorForm({ nombre: '', sede: '' })
    setJugadorLoading(false)
    refresh()
  }

  async function eliminarJugador(id: number) {
    if (!confirm('¿Eliminar jugador?')) return
    await fetch(`/api/jugadores/${id}`, { method: 'DELETE' })
    refresh()
  }

  async function añadirEntrada(e: React.FormEvent, torneoId: number) {
    e.preventDefault()
    setEntradaLoading(true)
    await fetch('/api/clasificacion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jugadorId: Number(entradaForm.jugadorId),
        torneoId,
        posicion: Number(entradaForm.posicion),
      }),
    })
    setEntradaForm({ jugadorId: '', posicion: '' })
    setEntradaLoading(false)
    refresh()
  }

  async function eliminarEntrada(id: number) {
    await fetch(`/api/clasificacion/${id}`, { method: 'DELETE' })
    refresh()
  }

  return (
    <div>
      <div className="mb-10">
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase mb-2">Admin</p>
        <h1 className="font-orbitron text-2xl font-black neon-text">Clasificación</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8">
        {(['torneos', 'jugadores'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`font-orbitron text-xs px-5 py-2 border tracking-widest capitalize transition-colors ${
              tab === t ? 'border-neon text-neon bg-neon/10' : 'border-gray-700 text-gray-500 hover:border-neon/40'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* TORNEOS */}
      {tab === 'torneos' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Crear torneo */}
          <div className="lg:col-span-1">
            <h2 className="font-orbitron text-xs text-neon/60 tracking-widest uppercase mb-4">Nuevo torneo</h2>
            <form onSubmit={crearTorneo} className="card-neon p-5 space-y-4">
              <div>
                <label className="block font-orbitron text-xs text-gray-500 tracking-widest mb-1.5 uppercase">Nombre</label>
                <input
                  type="text"
                  value={torneoForm.nombre}
                  onChange={e => setTorneoForm(p => ({ ...p, nombre: e.target.value }))}
                  placeholder="Torneo Málaga 2025"
                  className="input-neon w-full text-sm"
                  required
                />
              </div>
              <div>
                <label className="block font-orbitron text-xs text-gray-500 tracking-widest mb-1.5 uppercase">Sede</label>
                <select
                  value={torneoForm.sede}
                  onChange={e => setTorneoForm(p => ({ ...p, sede: e.target.value }))}
                  className="input-neon w-full text-sm"
                >
                  {SEDES_TORNEO.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-orbitron text-xs text-gray-500 tracking-widest mb-1.5 uppercase">Año</label>
                  <input
                    type="number"
                    value={torneoForm.anio}
                    onChange={e => setTorneoForm(p => ({ ...p, anio: Number(e.target.value) }))}
                    className="input-neon w-full text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-orbitron text-xs text-gray-500 tracking-widest mb-1.5 uppercase">Fecha</label>
                  <input
                    type="date"
                    value={torneoForm.fecha}
                    onChange={e => setTorneoForm(p => ({ ...p, fecha: e.target.value }))}
                    className="input-neon w-full text-sm"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={torneoLoading}
                className="btn-neon w-full py-2.5 font-orbitron text-xs tracking-widest disabled:opacity-50"
              >
                {torneoLoading ? '...' : 'Crear torneo'}
              </button>
            </form>
          </div>

          {/* Lista de torneos + resultados */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="font-orbitron text-xs text-neon/60 tracking-widest uppercase mb-4">Torneos ({torneos.length})</h2>
            {torneos.length === 0 && (
              <p className="text-gray-600 font-orbitron text-xs tracking-widest py-8 text-center">Sin torneos</p>
            )}
            {torneos.map(torneo => (
              <div key={torneo.id} className="card-neon">
                {/* Cabecera torneo */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setTorneoAbierto(torneoAbierto === torneo.id ? null : torneo.id)}
                >
                  <div>
                    <p className="font-orbitron text-xs text-neon/50 tracking-wider">{torneo.anio} · {torneo.sede}</p>
                    <p className="text-white font-medium font-orbitron text-sm mt-0.5">{torneo.nombre}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-orbitron text-xs text-gray-600">{torneo.clasificaciones.length} resultados</span>
                    <button
                      onClick={e => { e.stopPropagation(); eliminarTorneo(torneo.id) }}
                      className="font-orbitron text-xs text-gray-700 hover:text-red-400 transition-colors px-2 py-1"
                    >
                      ✕
                    </button>
                    <span className="font-orbitron text-xs text-neon/40">{torneoAbierto === torneo.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                {/* Resultados del torneo */}
                {torneoAbierto === torneo.id && (
                  <div className="border-t border-neon/10 p-4 space-y-4">
                    {/* Tabla de resultados */}
                    {torneo.clasificaciones.length > 0 && (
                      <table className="w-full text-sm mb-4">
                        <thead>
                          <tr className="border-b border-neon/10">
                            <th className="font-orbitron text-xs text-gray-600 text-left py-2 tracking-wider">Pos</th>
                            <th className="font-orbitron text-xs text-gray-600 text-left py-2 tracking-wider">Jugador</th>
                            <th className="font-orbitron text-xs text-gray-600 text-right py-2 tracking-wider">Pts</th>
                            <th className="w-8"></th>
                          </tr>
                        </thead>
                        <tbody>
                          {torneo.clasificaciones.map(e => (
                            <tr key={e.id} className="border-b border-neon/5">
                              <td className="py-2 font-orbitron text-sm text-neon/70">{e.posicion}º</td>
                              <td className="py-2 text-gray-300">{e.jugador.nombre}</td>
                              <td className="py-2 text-right font-orbitron text-sm text-neon/60">{e.puntos}</td>
                              <td className="py-2 text-right">
                                <button
                                  onClick={() => eliminarEntrada(e.id)}
                                  className="text-gray-700 hover:text-red-400 transition-colors font-orbitron text-xs"
                                >
                                  ✕
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}

                    {/* Añadir resultado */}
                    <form onSubmit={e => añadirEntrada(e, torneo.id)} className="flex items-end gap-3 flex-wrap">
                      <div className="flex-1 min-w-32">
                        <label className="block font-orbitron text-xs text-gray-600 tracking-widest mb-1.5 uppercase">Jugador</label>
                        <select
                          value={entradaForm.jugadorId}
                          onChange={e => setEntradaForm(p => ({ ...p, jugadorId: e.target.value }))}
                          className="input-neon w-full text-sm"
                          required
                        >
                          <option value="">Seleccionar...</option>
                          {jugadores.map(j => (
                            <option key={j.id} value={j.id}>{j.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="w-24">
                        <label className="block font-orbitron text-xs text-gray-600 tracking-widest mb-1.5 uppercase">Posición</label>
                        <input
                          type="number"
                          min="1"
                          value={entradaForm.posicion}
                          onChange={e => setEntradaForm(p => ({ ...p, posicion: e.target.value }))}
                          className="input-neon w-full text-sm"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={entradaLoading}
                        className="btn-neon px-4 py-2 font-orbitron text-xs tracking-widest disabled:opacity-50"
                      >
                        {entradaLoading ? '...' : '+ Añadir'}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* JUGADORES */}
      {tab === 'jugadores' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <h2 className="font-orbitron text-xs text-neon/60 tracking-widest uppercase mb-4">Nuevo jugador</h2>
            <form onSubmit={crearJugador} className="card-neon p-5 space-y-4">
              <div>
                <label className="block font-orbitron text-xs text-gray-500 tracking-widest mb-1.5 uppercase">Nombre</label>
                <input
                  type="text"
                  value={jugadorForm.nombre}
                  onChange={e => setJugadorForm(p => ({ ...p, nombre: e.target.value }))}
                  className="input-neon w-full text-sm"
                  required
                />
              </div>
              <div>
                <label className="block font-orbitron text-xs text-gray-500 tracking-widest mb-1.5 uppercase">Sede</label>
                <select
                  value={jugadorForm.sede}
                  onChange={e => setJugadorForm(p => ({ ...p, sede: e.target.value }))}
                  className="input-neon w-full text-sm"
                >
                  <option value="">— Sin sede —</option>
                  {SEDES_JUGADOR.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <button
                type="submit"
                disabled={jugadorLoading}
                className="btn-neon w-full py-2.5 font-orbitron text-xs tracking-widest disabled:opacity-50"
              >
                {jugadorLoading ? '...' : 'Crear jugador'}
              </button>
            </form>
          </div>

          <div className="lg:col-span-2">
            <h2 className="font-orbitron text-xs text-neon/60 tracking-widest uppercase mb-4">Jugadores ({jugadores.length})</h2>
            {jugadores.length === 0 ? (
              <p className="text-gray-600 font-orbitron text-xs tracking-widest py-8 text-center">Sin jugadores</p>
            ) : (
              <div className="space-y-2">
                {jugadores.map(j => (
                  <div key={j.id} className="card-neon p-4 flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{j.nombre}</span>
                      {j.sede && (
                        <span className="ml-2 font-orbitron text-xs text-gray-600 border border-gray-800 px-1.5 py-0.5">
                          {j.sede}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => eliminarJugador(j.id)}
                      className="font-orbitron text-xs text-gray-700 hover:text-red-400 transition-colors"
                    >
                      ✕ Eliminar
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
