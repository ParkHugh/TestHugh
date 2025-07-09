import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 구글 번역 위젯 스크립트 동적 추가
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // 글로벌 콜백 등록
    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko", // 기본 언어
          includedLanguages: "en,ko,es", // 지원 언어(원하는 언어 코드 추가)
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element" // 위젯 붙일 id
      );
    };

    return () => {
      // 클린업 (안 해도 무방, 메모리 누수 방지)
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 사이트 최상단에 번역 위젯 삽입 */}
      <div
        id="google_translate_element"
        style={{ position: "fixed", top: 8, right: 8, zIndex: 9999 }}
      />
      <Component {...pageProps} />
    </>
  );
}
