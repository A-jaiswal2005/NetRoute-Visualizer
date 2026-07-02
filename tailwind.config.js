/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#05080a',
        panel: '#0a1014',
        'panel-raised': '#0e161b',
        grid: '#0f1b1f',
        border: '#1c2e33',
        signal: '#39ff9c',
        'signal-dim': '#1f8f5c',
        amber: '#ffb454',
        alert: '#ff5c5c',
        wire: '#3a4a4f',
        ice: '#5ad7ff',
        text: '#d7e6e4',
        muted: '#6c8288',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 12px rgba(57,255,156,0.45)',
        'glow-amber': '0 0 12px rgba(255,180,84,0.45)',
        'glow-ice': '0 0 12px rgba(90,215,255,0.45)',
      },
      animation: {
        blink: 'blink 1.2s steps(2, start) infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        scan: 'scan 6s linear infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0 },
        },
        scan: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 200px' },
        },
      },
    },
  },
  plugins: [],
}
