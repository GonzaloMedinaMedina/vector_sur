import videos from '@/data/videos.json'

export const metadata = {
  title: 'Videos — Vector Sur',
  description: 'Partidas comentadas, tutoriales y resúmenes de torneos de la comunidad Vector Sur.',
}

export default function VideosPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      {/* Header */}
      <div className="mb-14 space-y-3">
        <p className="font-orbitron text-xs tracking-[0.3em] text-neon/60 uppercase">Vector Sur</p>
        <h1 className="font-orbitron text-4xl font-black section-heading">
          <span className="neon-text">Videos</span>
        </h1>
        <p className="text-gray-500 text-sm mt-6">
          Partidas comentadas, tutoriales y resúmenes de torneos.
        </p>
      </div>

      <hr className="neon-line mb-14" />

      {videos.videos.length === 0 ? (
        <div className="text-center py-24 text-gray-600 font-orbitron text-sm tracking-widest">
          — Próximamente —
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.videos.map(video => (
            <article key={video.id} className="card-neon overflow-hidden flex flex-col group">
              {/* YouTube thumbnail */}
              <a
                href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block aspect-video overflow-hidden bg-black"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                  alt={video.titulo}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                />
                {/* Play button overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-dark/70 border border-neon/50 flex items-center justify-center group-hover:bg-neon/20 group-hover:border-neon transition-all duration-300 shadow-neon-sm">
                    <svg className="w-6 h-6 text-neon ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
                {/* Neon border bottom on hover */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left shadow-neon-sm" />
              </a>

              {/* Info */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                <span className="font-orbitron text-xs text-neon/50 tracking-wider">
                  {new Date(video.fecha).toLocaleDateString('es-ES', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </span>
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-orbitron text-sm font-bold text-white group-hover:text-neon transition-colors leading-snug"
                >
                  {video.titulo}
                </a>
                <p className="text-gray-500 text-xs leading-relaxed flex-1">{video.descripcion}</p>
                <a
                  href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-orbitron text-xs text-neon/60 hover:text-neon transition-colors tracking-wider mt-1"
                >
                  Ver en YouTube ↗
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
