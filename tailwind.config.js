// tailwind.config.js
module.exports = {
  content: [
    "./pages/**/*.{js,jsx,ts,tsx}",       // 라우팅 페이지
    "./components/**/*.{js,jsx,ts,tsx}",  // 공통 컴포넌트
    "./tests/**/*.{js,jsx,ts,tsx}",       // 개별 테스트 파일
    "./src/**/*.{js,jsx,ts,tsx}",         // 나머지 로직
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
