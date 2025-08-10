import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // 구글 번역 위젯 스크립트 삽입
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // 번역 초기화 함수
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko", // 기본 언어
          includedLanguages: "en,ko,es", // 지원 언어
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ✅ Tailwind로 스타일링한 구글 번역 위젯 */}
      <div
        id="google_translate_element"
        className="fixed top-3 left-3 z-[9999] w-[120px] bg-white rounded-lg shadow-md p-1"
      ></div>

      <Component {...pageProps} />
    </>
  );
}