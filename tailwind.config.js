/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#1497F5",
          electric: "#139EF2",
          navy: "#070B33",
          deepNavy: "#0B104E",
          silver: "#B9BEC9",
          softWhite: "#F7F9FF",
          darkVoid: "#08090C",
          chassis: "#101217",
          rim: "#1D212A",
          lens: "#050608"
        }
      },
      fontFamily: {
        sans: ['"Cooper Hewitt"', '"Barlow Semi Condensed"', '"Figtree"', 'sans-serif'],
        mono: ['"Figtree"', 'monospace'],
        display: ['"Cooper Hewitt"', '"Barlow Semi Condensed"', '"Montserrat"', 'sans-serif'],
        editorial: ['"Cooper Hewitt"', '"Barlow Semi Condensed"', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
      },
      boxShadow: {
        'glow-blue': '0 0 40px -10px rgba(20, 151, 245, 0.45)',
        'device-glass': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15), 0 25px 60px -15px rgba(0, 0, 0, 0.85)',
      }
    },
  },
  plugins: [],
}
