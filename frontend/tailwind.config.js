/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Design tokens - Dark mode pro/tech
        'bg-primary': '#020617',
        'bg-surface': '#0F172A',
        'bg-elevated': '#1E293B',
        'border-default': '#1E293B',
        'border-subtle': '#334155',
        'primary': '#38BDF8',
        'primary-hover': '#0EA5E9',
        'secondary': '#6366F1',
        'text-main': '#E5E7EB',
        'text-muted': '#94A3B8',
        'text-subtle': '#64748B',
        'success': '#22C55E',
        'warning': '#F59E0B',
        'danger': '#EF4444',
        'danger-hover': '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(56, 189, 248, 0.15)',
        'glow-primary-lg': '0 0 30px rgba(56, 189, 248, 0.25)',
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
