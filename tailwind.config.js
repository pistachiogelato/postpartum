/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{css,scss}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'warm-beige': '#F5E6D3',
        'warm-peach': '#FFDAB9',
        'warm-cream': '#FFF5E1',
        'felted-brown': '#8B4513',
      },
      fontFamily: {
        'felted': ['Nunito', 'sans-serif']
      },
      backgroundImage: {
        'felted-texture': 'url("/felted-background.svg")'
      }
    },
  },
  plugins: [require('@tailwindcss/forms')],
  // Add this to resolve @apply warnings
  variants: {},
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  }
}
