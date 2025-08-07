import "@/styles/globals.css";
import Head from "next/head";
import dynamic from "next/dynamic";

const GoogleTranslateLoader = dynamic(
  () => import("@/components/GoogleTranslateLoader"),
  { ssr: false }
);

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* ✅ 번역 위젯 항상 표시 */}
      <GoogleTranslateLoader />

      {/* ✅ 새련된 언어 버튼 (돋보이게 유도용) */}
      <div
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          background: "#1e1e1e",
          color: "#fff",
          padding: "8px 14px",
          borderRadius: "20px",
          cursor: "pointer",
          zIndex: 9999,
          fontSize: "14px",
        }}
        onClick={() => {
          const combo = document.querySelector(".goog-te-combo");
          if (combo) combo.focus();
        }}
      >
        🌐 언어 변경
      </div>

      <Component {...pageProps} />
    </>
  );
}
