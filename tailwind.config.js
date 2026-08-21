/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F8F4EC', // Warm cream paper canvas
          light: '#FFFFFF',
          card: '#FFFFFF',
          muted: '#EFE8DA',
          dark: '#DDD5C4',
          border: '#18181B',
        },
        ink: {
          DEFAULT: '#18181B', // Deep dark ink
          light: '#27272A',
          muted: '#3F3F46',
        },
        graphite: '#3F3F46', // High contrast readable dark slate
        highlighter: {
          DEFAULT: '#E6F94E', // Joyful canary highlighter yellow
          hover: '#D8EB38',
          light: '#F8FED2',
        },
        stamp: {
          DEFAULT: '#FF5722', // Playful energetic orange-red
          dark: '#E64A19',
          light: '#FFEBE6',
        },
        terminal: {
          bg: '#0F172A',
          surface: '#1E293B',
          text: '#F8FAFC',
          accent: '#4ADE80',
          error: '#F87171',
          warning: '#FBBF24',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', '"Kalam"', 'cursive'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'bento': '28px',
        'bento-sm': '18px',
        'pill': '9999px',
      },
      boxShadow: {
        'solid-xs': '1.5px 1.5px 0px #18181B',
        'solid-sm': '2.5px 2.5px 0px #18181B',
        'solid': '3.5px 3.5px 0px #18181B',
        'solid-md': '5px 5px 0px #18181B',
        'solid-lg': '7px 7px 0px #18181B',
        'solid-xl': '10px 10px 0px #18181B',
      }
    },
  },
  plugins: [],
}
