import "@/styles/globals.css";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [isTranslateReady, setIsTranslateReady] = useState(false);

  useEffect(() => {
    // ✅ 콜백 먼저 전역 등록 (스크립트보다 먼저!)
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko",
          includedLanguages: "ko,en,es",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };

    // ✅ script 태그 생성 (https 명시!)
    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    // ✅ 드롭다운 로딩 확인
    const interval = setInterval(() => {
      const combo = document.querySelector(".goog-te-combo");
      if (combo) {
        setIsTranslateReady(true);
        clearInterval(interval);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const triggerTranslate = () => {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.focus();
      combo.click();
    } else {
      alert("번역 위젯이 아직 로딩되지 않았습니다. 잠시 후 다시 시도해주세요.");
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ✅ 위젯: 완전히 숨기지 않고 DOM에 두기 */}
      <div
        id="google_translate_element"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: 1,
          height: 1,
          opacity: 0.01,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* ✅ 버튼 */}
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          background: isTranslateReady ? "#1e1e1e" : "#666",
          color: "#fff",
          padding: "6px 14px",
          borderRadius: "8px",
          cursor: isTranslateReady ? "pointer" : "not-allowed",
          zIndex: 9999,
        }}
        onClick={isTranslateReady ? triggerTranslate : null}
      >
        🌐 언어 변경
      </div>

      <Component {...pageProps} />
    </>
  );
}
