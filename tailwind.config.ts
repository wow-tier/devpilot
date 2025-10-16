import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cursor-inspired dark theme
        cursor: {
          'base': '#04070c',
          'surface': '#0b1620',
          'surface-hover': '#101b29',
          'border': '#1a2332',
          'border-hover': '#2a3342',
          'text': '#e4e7ec',
          'text-secondary': '#9ca3af',
          'text-muted': '#6b7280',
          'glass': 'rgba(16, 27, 41, 0.8)',
          'glass-border': 'rgba(74, 85, 104, 0.3)',
        },
        // Accent colors with gradients
        accent: {
          'blue': '#4fbdf4',
          'purple': '#826bff',
          'gradient-from': '#4fbdf4',
          'gradient-to': '#826bff',
        },
        // Semantic colors
        success: {
          DEFAULT: '#4ade80',
          'hover': '#22c55e',
        },
        warning: {
          DEFAULT: '#facc15',
          'hover': '#eab308',
        },
        danger: {
          DEFAULT: '#f87171',
          'hover': '#ef4444',
        },
        // Enhanced slate colors (keep for compatibility)
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
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      borderRadius: {
        'cursor-sm': '8px',
        'cursor-md': '12px',
        'cursor-lg': '20px',
      },
      boxShadow: {
        'cursor-sm': '0 2px 8px rgba(0, 0, 0, 0.24)',
        'cursor-md': '0 4px 16px rgba(0, 0, 0, 0.32)',
        'cursor-lg': '0 8px 32px rgba(0, 0, 0, 0.48)',
        'cursor-xl': '0 16px 64px rgba(0, 0, 0, 0.56)',
        'glow-blue': '0 0 24px rgba(79, 189, 244, 0.4)',
        'glow-purple': '0 0 24px rgba(130, 107, 255, 0.4)',
        'glow-accent': '0 0 32px rgba(79, 189, 244, 0.3), 0 0 64px rgba(130, 107, 255, 0.2)',
        'inner-glow': 'inset 0 0 24px rgba(79, 189, 244, 0.1)',
      },
      animation: {
        'fade-in': 'fadeIn 0.25s ease-in-out',
        'slide-up': 'slideUp 0.25s ease-out',
        'slide-down': 'slideDown 0.25s ease-out',
        'slide-in-right': 'slideInRight 0.25s ease-out',
        'scale-in': 'scaleIn 0.15s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s infinite',
        'gradient': 'gradient 8s ease infinite',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200px 0' },
          '100%': { backgroundPosition: 'calc(200px + 100%) 0' },
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'accent-gradient': 'linear-gradient(135deg, #4fbdf4 0%, #826bff 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(79, 189, 244, 0.1) 0%, rgba(130, 107, 255, 0.1) 100%)',
      },
    },
  },
  plugins: [],
};

export default config;
