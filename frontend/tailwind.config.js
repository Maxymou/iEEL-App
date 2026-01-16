/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens - Palette finale inspirée de l'image de référence
        // 🌑 Backgrounds
        'bg-primary': '#0A0F14',
        'bg-surface': '#111827',
        'bg-elevated': '#1A2230',
        'border-default': '#1F2937',
        'border-subtle': '#334155',
        // ⚡ Accents
        'primary': '#C7F000',
        'primary-hover': '#84CC16',
        'secondary': '#84CC16',
        // 📝 Textes
        'text-main': '#E5E7EB',
        'text-muted': '#9CA3AF',
        'text-dimmed': '#6B7280',
        'text-subtle': '#6B7280', // Alias pour compatibilité
        // ✅ États
        'success': '#22C55E',
        'warning': '#FACC15',
        'danger': '#EF4444',
        'danger-hover': '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(199, 240, 0, 0.15)',
        'glow-primary-lg': '0 0 30px rgba(199, 240, 0, 0.25)',
      },
      transitionDuration: {
        '150': '150ms',
        '200': '200ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
};
