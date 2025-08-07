// pages/_app.js

import "@/styles/globals.css";
import Head from "next/head";
import { useEffect } from "react";

export default function App({ Component, pageProps }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko",
          includedLanguages: "ko,en,es", // 원하는 언어 추가
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };
  }, []);

  const triggerTranslate = () => {
    const select = document.querySelector("#google_translate_element select");
    if (select) {
      select.focus();
      select.click(); // 드롭다운 열기
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* 구글 번역 위젯 (숨김 처리) */}
      <div id="google_translate_element" style={{ display: "none" }} />

      {/* 깔끔한 커스텀 버튼 */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          padding: "6px 14px",
          backgroundColor: "#1e1e1e",
          color: "#fff",
          borderRadius: "8px",
          boxShadow: "0 2px 6px #0003",
          fontSize: "14px",
          cursor: "pointer",
          zIndex: 9999,
        }}
        onClick={triggerTranslate}
      >
        🌐 언어 변경
      </div>

      <Component {...pageProps} />
    </>
  );
}
