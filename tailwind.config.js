/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
    './docs/**/*.{vue,js,ts,jsx,tsx,md}',
    '!./docs/cache/**',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}

