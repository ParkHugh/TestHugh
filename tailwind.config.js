// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./pages/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // 브랜드 명조(Playfair+Noto Serif KR+serif)
        'brand': ['Playfair Display', 'Noto Serif KR', 'serif'],
      },
    },
  },
  plugins: [],
};
