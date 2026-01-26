/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './themes/hexo-deveye/layout/**/*.ejs',
    './themes/hexo-deveye/source/**/*.js',
    './source/**/*.md',
    './source/**/*.html'
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gray: {
          50: '#faf9f5',
          100: '#f2efe9',
          200: '#e8e4dc',
          300: '#d8d2c8',
          400: '#b8b0a4',
          500: '#9a9287',
          600: '#6f6b63',
          700: '#4b4842',
          800: '#2e2c28',
          900: '#141413',
        },
        primary: {
          50: '#fcf3ef',
          100: '#f7e3dc',
          200: '#efc7b6',
          300: '#e6a48b',
          400: '#db8565',
          500: '#d97757',
          600: '#c66345',
          700: '#a6503a',
          800: '#874232',
          900: '#6e3528',
        }
      },
      fontFamily: {
        sans: ['Lora', 'Georgia', 'serif'],
        display: ['Poppins', 'Arial', 'sans-serif'],
        mono: ['JetBrains Mono', 'Consolas', 'monospace'],
      }
    },
  },
  plugins: [],
} 
