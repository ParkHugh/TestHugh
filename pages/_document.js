// pages/_document.js
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* SEO & 기본 정보 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* 메인 설명, 키워드 */}
        <meta
          name="description"
          content="심리테스트, 성격유형, 밸런스게임! 1분 만에 나의 성향을 Test 休에서 확인해보세요."
        />
        <meta
          name="keywords"
          content="심리테스트, 성격테스트, MBTI, 파시스트, 테스트, 소시오패스, 테토녀, 에겐남, 러너유형, 여행 성향, 밸런스게임, 무료 검사"
        />

        {/* Favicon & Manifest */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon512.png" />
        <link rel="manifest" href="/manifest.json" />

        {/* OG/카톡/네이버톡/페북 미리보기 (메인페이지용) */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Test 休 | 모든 심리테스트 한 곳에" />
        <meta
          property="og:description"
          content="최신 성격유형 심리테스트 밸런스게임 결과를 1분 만에!"
        />
        <meta property="og:image" content="/ogimage.png" />
        <meta property="og:url" content="https://test-hugh.co.kr" />

        {/* Search 엔진용 canonical */}
        <link rel="canonical" href="https://test-hugh.co.kr" />

        {/* 구글/네이버 사이트 소유 인증 */}
        <meta
          name="google-site-verification"
          content="uMEZwGxIiTzAForBPhkOiGzFOyJLCtYO2xm48DPfF4Q"
        />
        <meta
          name="naver-site-verification"
          content="f001484f78caa886c667a1aa6db2d030e6daebee"
        />

        {/* Theme */}
        <meta name="theme-color" content="#fcf8ee" />

        {/* 폰트 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Noto+Serif+KR:wght@700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
