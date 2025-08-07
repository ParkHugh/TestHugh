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
          includedLanguages: "ko,en,es",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
    };
  }, []);

  const triggerTranslate = () => {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.focus();
      combo.click(); // 사용자가 선택 가능하게 포커싱
    } else {
      alert("번역 위젯이 아직 로딩되지 않았습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ✅ 구글 번역 요소는 숨기지 않고 화면 밖으로 */}
      <div
        id="google_translate_element"
        style={{
          position: "fixed",
          top: "-1000px", // 화면 밖으로 숨김
          left: "0",
        }}
      />

      {/* ✅ 커스텀 버튼 */}
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          background: "#1e1e1e",
          color: "#fff",
          padding: "6px 14px",
          borderRadius: "8px",
          cursor: "pointer",
          zIndex: 9999,
        }}
        onClick={triggerTranslate}
      >
        🌍 Language
      </div>

      <Component {...pageProps} />
    </>
  );
}
