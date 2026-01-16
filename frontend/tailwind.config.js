/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens - Palette "Mont Blanc / Outdoor" (image de référence)
        // 🌑 Backgrounds
        'bg-primary': '#0E0E0E',
        'bg-surface': '#191919',
        'bg-elevated': '#242424',
        'border-default': '#2E2E2E',
        'border-subtle': '#3A3A3A',
        // ⚡ Accents
        'primary': '#D9FF42',
        'primary-hover': '#C4E63A',
        'secondary': '#FFFFFF',
        // 📝 Textes
        'text-main': '#FFFFFF',
        'text-muted': '#DBDBDB',
        'text-dimmed': '#6B6B6B',
        'text-subtle': '#6B6B6B', // Alias pour compatibilité
        // ✅ États
        'success': '#7CFF4D',
        'warning': '#FFD84D',
        'danger': '#FF4D4D',
        'danger-hover': '#E63A3A',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(217, 255, 66, 0.2)',
        'glow-primary-lg': '0 0 30px rgba(217, 255, 66, 0.3)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      // Grid System tokens
      spacing: {
        'grid-gutter': '20px',
        'grid-margin': '20px',
      },
      gridTemplateColumns: {
        // Mobile: 4 colonnes
        'grid-mobile': 'repeat(4, 1fr)',
        // Tablet: 8 colonnes
        'grid-tablet': 'repeat(8, 1fr)',
        // Desktop: 12 colonnes
        'grid-desktop': 'repeat(12, 1fr)',
      },
    },
  },
  plugins: [],
};
