import "@/styles/globals.css";
import Head from "next/head";
import { useEffect, useState } from "react";

export default function App({ Component, pageProps }) {
  const [showTranslate, setShowTranslate] = useState(false);

  useEffect(() => {
    // 최초 방문 시에만 4초간 위젯 노출
    if (!localStorage.getItem("translateWidgetShown")) {
      setShowTranslate(true);
      localStorage.setItem("translateWidgetShown", "1");
    }

    // 구글 번역 위젯 스크립트 삽입
    const script = document.createElement("script");
    script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = function() {
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

  // 4초 후 자동으로 번역 위젯 숨김
  useEffect(() => {
    if (showTranslate) {
      const timer = setTimeout(() => setShowTranslate(false), 7000); // 4초 후 숨김
      return () => clearTimeout(timer);
    }
  }, [showTranslate]);

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* 처음 방문에만 4초간 번역 위젯 노출 */}
      {showTranslate && (
        <div
          id="google_translate_element"
          style={{
            position: "fixed",
            top: 12,
            left: 12,
            zIndex: 9999,
            width: "120px",
            background: "#fff",
            borderRadius: 8,
            boxShadow: "0 2px 8px 0 #0002",
            padding: 4,
          }}
        />
      )}
      <Component {...pageProps} />
    </>
  );
}