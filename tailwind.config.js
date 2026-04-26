/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'media', 
  content: [
    "./public/**/*.html",
    "./src/popup/**/*.{ts,tsx}",
    "./src/options/**/*.{ts,tsx}",
    "./src/sites/**/*.{ts,tsx}",
    "./src/background.ts",
  ],
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
