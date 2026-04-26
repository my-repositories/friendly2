/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media', 
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          item: '#2a374a'
        }
      }
    },
  },
  plugins: [],
}
