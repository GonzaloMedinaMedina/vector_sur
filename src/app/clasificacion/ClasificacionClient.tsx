'use client'

import { useState } from 'react'

type Jugador = { id: number; nombre: string; sede: string | null }
type Entrada = { id: number; jugadorId: number; torneoId: number; posicion: number; puntos: number; jugador: Jugador }
type Torneo = {
  id: number
  nombre: string
  sede: string
  anio: number
  fecha: string
  clasificaciones: Entrada[]
}

type Props = {
  torneos: Torneo[]
  años: number[]
}

export default function ClasificacionClient({ torneos, años }: Props) {
  const [añoActivo, setAñoActivo] = useState<number>(años[0] ?? new Date().getFullYear())
  const [torneoActivo, setTorneoActivo] = useState<number | 'anual'>('anual')

  const torneosFiltrados = torneos.filter(t => t.anio === añoActivo)

  function getClasificacionAnual() {
    const mapa = new Map<number, { jugador: Jugador; porTorneo: Record<number, number>; total: number }>()

    for (const torneo of torneosFiltrados) {
      for (const entry of torneo.clasificaciones) {
        const existing = mapa.get(entry.jugadorId)
        if (existing) {
          existing.porTorneo[torneo.id] = entry.puntos
          existing.total += entry.puntos
        } else {
          mapa.set(entry.jugadorId, {
            jugador: entry.jugador,
            porTorneo: { [torneo.id]: entry.puntos },
            total: entry.puntos,
          })
        }
      }
    }

    return [...mapa.values()].sort((a, b) => b.total - a.total)
  }

  const anual = getClasificacionAnual()
  const torneoSeleccionado = torneoActivo !== 'anual' ? torneos.find(t => t.id === torneoActivo) : null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-14 space-y-3">
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase">Vector Sur</p>
        <h1 className="font-orbitron text-4xl font-black section-heading">
          <span className="neon-text">Clasificación</span>
        </h1>
        <p className="text-gray-500 text-sm mt-6">Ranking anual y resultados por torneo.</p>
      </div>

      <hr className="neon-line mb-10" />

      {años.length === 0 ? (
        <div className="text-center py-24 text-gray-600 font-orbitron text-sm tracking-widest">
          — Sin datos de clasificación —
        </div>
      ) : (
        <>
          {/* Selector de año */}
          <div className="flex items-center gap-3 mb-8 flex-wrap">
            <span className="font-orbitron text-xs text-gray-500 tracking-widest uppercase">Año:</span>
            {años.map(año => (
              <button
                key={año}
                onClick={() => { setAñoActivo(año); setTorneoActivo('anual') }}
                className={`font-orbitron text-xs px-4 py-2 border transition-colors tracking-wider ${
                  añoActivo === año
                    ? 'border-neon text-neon bg-neon/10'
                    : 'border-gray-700 text-gray-500 hover:border-neon/50 hover:text-gray-300'
                }`}
              >
                {año}
              </button>
            ))}
          </div>

          {/* Selector de vista */}
          <div className="flex items-center gap-2 mb-10 flex-wrap">
            <button
              onClick={() => setTorneoActivo('anual')}
              className={`font-orbitron text-xs px-4 py-2 border transition-colors tracking-wider ${
                torneoActivo === 'anual'
                  ? 'border-neon text-neon bg-neon/10'
                  : 'border-gray-700 text-gray-500 hover:border-neon/50 hover:text-gray-300'
              }`}
            >
              Clasificación Anual
            </button>
            {torneosFiltrados.map(t => (
              <button
                key={t.id}
                onClick={() => setTorneoActivo(t.id)}
                className={`font-orbitron text-xs px-4 py-2 border transition-colors tracking-wider ${
                  torneoActivo === t.id
                    ? 'border-neon text-neon bg-neon/10'
                    : 'border-gray-700 text-gray-500 hover:border-neon/50 hover:text-gray-300'
                }`}
              >
                {t.sede}
              </button>
            ))}
          </div>

          {/* Tabla anual */}
          {torneoActivo === 'anual' && (
            <div>
              <h2 className="font-orbitron text-sm font-bold text-white mb-6 tracking-widest uppercase">
                Clasificación Anual {añoActivo}
              </h2>
              {anual.length === 0 ? (
                <p className="text-gray-600 font-orbitron text-xs tracking-widest text-center py-16">
                  — Sin datos para {añoActivo} —
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neon/20">
                        <th className="font-orbitron text-xs text-neon/60 tracking-widest text-left py-3 pr-6">#</th>
                        <th className="font-orbitron text-xs text-neon/60 tracking-widest text-left py-3 pr-6">Jugador</th>
                        {torneosFiltrados.map(t => (
                          <th key={t.id} className="font-orbitron text-xs text-neon/60 tracking-widest text-center py-3 px-4">
                            {t.sede}
                          </th>
                        ))}
                        <th className="font-orbitron text-xs text-neon/60 tracking-widest text-right py-3 pl-6">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {anual.map((row, i) => (
                        <tr key={row.jugador.id} className="border-b border-neon/5 hover:bg-neon/5 transition-colors">
                          <td className="py-4 pr-6">
                            <span className={`font-orbitron text-sm font-bold ${
                              i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-600'
                            }`}>
                              {i + 1}
                            </span>
                          </td>
                          <td className="py-4 pr-6">
                            <span className="text-white font-medium">{row.jugador.nombre}</span>
                            {row.jugador.sede && (
                              <span className="ml-2 font-orbitron text-xs text-gray-600 border border-gray-800 px-1.5 py-0.5">
                                {row.jugador.sede}
                              </span>
                            )}
                          </td>
                          {torneosFiltrados.map(t => (
                            <td key={t.id} className="py-4 px-4 text-center font-orbitron text-sm">
                              {row.porTorneo[t.id] !== undefined ? (
                                <span className="text-neon/80">{row.porTorneo[t.id]}</span>
                              ) : (
                                <span className="text-gray-700">—</span>
                              )}
                            </td>
                          ))}
                          <td className="py-4 pl-6 text-right">
                            <span className="font-orbitron text-sm font-bold neon-text">{row.total}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Tabla torneo individual */}
          {torneoSeleccionado && (
            <div>
              <div className="mb-6">
                <h2 className="font-orbitron text-sm font-bold text-white tracking-widest uppercase">
                  {torneoSeleccionado.nombre}
                </h2>
                <p className="font-orbitron text-xs text-gray-600 tracking-wider mt-1">
                  {new Date(torneoSeleccionado.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit', month: 'long', year: 'numeric',
                  })} · {torneoSeleccionado.sede}
                </p>
              </div>
              {torneoSeleccionado.clasificaciones.length === 0 ? (
                <p className="text-gray-600 font-orbitron text-xs tracking-widest text-center py-16">
                  — Sin resultados registrados —
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm max-w-2xl">
                    <thead>
                      <tr className="border-b border-neon/20">
                        <th className="font-orbitron text-xs text-neon/60 tracking-widest text-left py-3 pr-6">Posición</th>
                        <th className="font-orbitron text-xs text-neon/60 tracking-widest text-left py-3 pr-6">Jugador</th>
                        <th className="font-orbitron text-xs text-neon/60 tracking-widest text-right py-3">Puntos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {torneoSeleccionado.clasificaciones.map(entry => (
                        <tr key={entry.id} className="border-b border-neon/5 hover:bg-neon/5 transition-colors">
                          <td className="py-4 pr-6">
                            <span className={`font-orbitron text-sm font-bold ${
                              entry.posicion === 1 ? 'text-yellow-400' :
                              entry.posicion === 2 ? 'text-gray-300' :
                              entry.posicion === 3 ? 'text-amber-600' : 'text-gray-600'
                            }`}>
                              {entry.posicion}º
                            </span>
                          </td>
                          <td className="py-4 pr-6">
                            <span className="text-white font-medium">{entry.jugador.nombre}</span>
                            {entry.jugador.sede && (
                              <span className="ml-2 font-orbitron text-xs text-gray-600 border border-gray-800 px-1.5 py-0.5">
                                {entry.jugador.sede}
                              </span>
                            )}
                          </td>
                          <td className="py-4 text-right font-orbitron text-sm font-bold neon-text">
                            {entry.puntos}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  )
}
