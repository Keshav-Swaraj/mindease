// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-dark': '#0F0B30', // Dark navy/purple background
        'brand-purple': '#3B347D',
        'brand-light': '#F9FAFB', // Light footer background
        'brand-green': '#10B981', // Main CTA green
        'brand-teal': '#14B8A6',
        'brand-blue-light': '#5865F2', // For the gradient text
        'brand-purple-dark': '#8A2BE2', // For the gradient text
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(circle at top, var(--tw-gradient-stops))',
      },
      // Custom gradient for logo text
      gradientColorStops: theme => ({
        'logo-start': theme('colors.brand-green'),
        'logo-end': theme('colors.brand-blue-light'),
      }),
    },
    fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
  plugins: [],
}