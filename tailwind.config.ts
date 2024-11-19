/** @type {import('tailwindcss').Config} */
export default {
  content: ["./components/**/*.{js,ts,jsx,tsx}", "./app/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mint: '#A6D7BA',
        cream: '#FCEBD0',
        teal: '#40938C',
        forest_green: '#1D3828',
      },
      fontFamily: {
        hellowin: ['Hellowin', 'sans-serif'],
        playfair: ['"Playfair Display"', 'serif'],
      },
    },
  },
  plugins: [],
};
