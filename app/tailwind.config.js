/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'ui-sans-serif',
          'system-ui',
          '-apple-system',
          '"Noto Sans TC"',
          '"Microsoft JhengHei"',
          'sans-serif',
        ],
        display: ['"Baloo 2"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"SFMono-Regular"', '"Cascadia Code"', 'Consolas', 'monospace'],
      },
      colors: {
        // Brand palette — a friendly, energetic learning identity.
        brand: {
          50: '#eafff6',
          100: '#c8ffe7',
          200: '#93f7d0',
          300: '#57e9b6',
          400: '#2fd49d',
          500: '#13b884',
          600: '#0a936b',
          700: '#0b7558',
          800: '#0d5d48',
          900: '#0c4d3d',
        },
        sky: {
          400: '#56c6ff',
          500: '#2ba8f0',
        },
        sunset: {
          400: '#ffb454',
          500: '#ff8a3d',
        },
        grape: {
          400: '#b59bff',
          500: '#8a6bff',
        },
        coral: {
          400: '#ff8aa6',
          500: '#ff5d7e',
        },
      },
      boxShadow: {
        pop: '0 18px 50px -12px rgba(0,0,0,0.30)',
        'inner-top': 'inset 0 1px 0 rgba(255,255,255,0.18)',
        button: '0 4px 0 0 rgba(0,0,0,0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.75rem',
      },
      keyframes: {
        'pop-in': {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        wiggle: {
          '0%,100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.35s cubic-bezier(0.34,1.56,0.64,1) both',
        float: 'float 4s ease-in-out infinite',
        wiggle: 'wiggle 0.5s ease-in-out',
        shimmer: 'shimmer 2.5s linear infinite',
      },
    },
  },
  plugins: [],
};
