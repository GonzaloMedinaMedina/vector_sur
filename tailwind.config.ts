import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        neon: '#00ff41',
        'neon-dim': '#00cc33',
        dark: '#050508',
        card: '#0d0d14',
        surface: '#111118',
      },
      fontFamily: {
        orbitron: ['var(--font-orbitron)', 'monospace'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      boxShadow: {
        neon: '0 0 10px #00ff41, 0 0 20px #00ff4155',
        'neon-sm': '0 0 5px #00ff41, 0 0 10px #00ff4133',
        'neon-lg': '0 0 20px #00ff41, 0 0 40px #00ff4155, 0 0 80px #00ff4122',
      },
      animation: {
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'scan': 'scan 8s linear infinite',
        'flicker': 'flicker 4s linear infinite',
      },
      keyframes: {
        pulseNeon: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        flicker: {
          '0%, 19%, 21%, 23%, 25%, 54%, 56%, 100%': { opacity: '1' },
          '20%, 24%, 55%': { opacity: '0.8' },
        },
      },
    },
  },
  plugins: [],
}

export default config
