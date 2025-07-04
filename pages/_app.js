import "@/styles/globals.css";
import Head from "next/head";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        {/* 여러 포맷 지원하려면 아래처럼 추가도 가능 */}
        {/* <link rel="icon" type="image/png" href="/favicon.png" /> */}
      </Head>
      <Component {...pageProps} />
    </>
  );
}
