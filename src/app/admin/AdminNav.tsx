'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'

const links = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/noticias', label: 'Noticias' },
  { href: '/admin/videos', label: 'Videos' },
  { href: '/admin/clasificacion', label: 'Clasificación' },
]

export default function AdminNav({ userName }: { userName: string }) {
  const pathname = usePathname()

  return (
    <nav className="bg-card border-b border-neon/20 px-4 sm:px-6 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-6 flex-wrap">
          <span className="font-orbitron text-xs neon-text tracking-widest font-bold">ADMIN</span>
          {links.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className={`font-orbitron text-xs tracking-wider transition-colors ${
                pathname === link.href ? 'text-neon' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="font-orbitron text-xs text-gray-600 tracking-wider">{userName}</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="font-orbitron text-xs text-gray-600 hover:text-red-400 tracking-wider transition-colors border border-gray-800 px-3 py-1.5 hover:border-red-900"
          >
            Salir
          </button>
        </div>
      </div>
    </nav>
  )
}
