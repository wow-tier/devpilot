import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GitHub-inspired dark theme
        github: {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          'bg-tertiary': '#21262d',
          border: '#30363d',
          text: '#c9d1d9',
          'text-secondary': '#8b949e',
          'text-muted': '#6e7681',
          accent: '#58a6ff',
          success: '#238636',
          'success-hover': '#2ea043',
          danger: '#da3633',
          'danger-hover': '#f85149',
        },
        // Enhanced slate colors
        slate: {
          950: '#020617',
          900: '#0f172a',
          800: '#1e293b',
          700: '#334155',
          600: '#475569',
          500: '#64748b',
          400: '#94a3b8',
          300: '#cbd5e1',
          200: '#e2e8f0',
          100: '#f1f5f9',
          50: '#f8fafc',
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'github': '0 8px 24px rgba(0, 0, 0, 0.12)',
        'github-lg': '0 16px 48px rgba(0, 0, 0, 0.16)',
        'glow-blue': '0 0 20px rgba(88, 166, 255, 0.3)',
        'glow-green': '0 0 20px rgba(35, 134, 54, 0.3)',
      },
    },
  },
  plugins: [],
};

export default config;
