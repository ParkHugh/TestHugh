import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Google Translate script 삽입
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // Google 번역 위젯 초기화 함수 등록
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko",
          includedLanguages: "en,ko,ja,zh-CN,es", // 필요한 언어로 수정
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    return () => {
      delete window.googleTranslateElementInit;
    };
  }, []);

  // 커스텀 버튼 클릭 시 드롭다운 강제 클릭
  const handleLanguageClick = () => {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.focus();
      combo.click();
    } else {
      alert("🌐 번역 드롭다운이 아직 준비되지 않았습니다.");
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 숨겨진 번역 위젯 */}
      <div
        id="google_translate_element"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: 0,
          width: 0,
          overflow: "hidden",
          zIndex: -1,
        }}
      />

      {/* 🌐 언어 선택 버튼 */}
      <div
        onClick={handleLanguageClick}
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          zIndex: 9999,
          backgroundColor: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          padding: "6px 12px",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 500,
          userSelect: "none",
        }}
      >
        🌐 언어 선택
      </div>

      <Component {...pageProps} />
    </>
  );
}
