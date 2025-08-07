import "@/styles/globals.css";
import Head from "next/head";
import { useState } from "react";
import dynamic from "next/dynamic";

// ✅ Google 번역 위젯을 클라이언트에서만 렌더링
const GoogleTranslateLoader = dynamic(
  () => import("@/components/GoogleTranslateLoader"),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  const [isTranslateReady, setIsTranslateReady] = useState(false);

  const triggerTranslate = () => {
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

      {/* ✅ 클라이언트에서만 번역 위젯 로딩 */}
      <GoogleTranslateLoader onReady={() => setIsTranslateReady(true)} />

      {/* ✅ 언어 변경 버튼 */}
      <div
        style={{
          position: "fixed",
          top: 12,
          left: 12,
          background: isTranslateReady ? "#1e1e1e" : "#666",
          color: "#fff",
          padding: "6px 14px",
          borderRadius: "8px",
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
