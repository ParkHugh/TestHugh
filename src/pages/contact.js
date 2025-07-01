// pages/contact.js
import Head from "next/head";

export default function ContactPage() {
  return (
    <>
      <Head>
        <title>문의하기 | Test 休</title>
        <meta name="description" content="Test 休 - 서비스 문의 및 제안, 광고, 협업 관련 연락처" />
        <meta property="og:title" content="문의하기 | Test 休" />
        <meta property="og:description" content="궁금한 점, 제안, 광고, 협업 등 언제든 연락해 주세요!" />
        <meta property="og:image" content="https://test-hugh.co.kr/ogimage.png" />
        <meta property="og:url" content="https://test-hugh.co.kr/contact" />
      </Head>
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 bg-white">
        <h1 className="text-3xl font-bold text-green-700 mb-4">문의하기</h1>
        <p className="text-gray-700 mb-6 text-center text-base">
          궁금한 점, 제안, 광고 및 협업 문의 등<br />
          언제든 아래 메일로 연락주세요.
        </p>
        <a
          href="mailto:hughparkhere@gmail.com"
          className="text-lg font-mono text-green-700 bg-green-50 px-5 py-2 rounded-lg shadow hover:bg-green-100 transition"
        >
          hughparkhere@gmail.com
        </a>
        <div className="mt-10 text-sm text-gray-400">
          빠르고 친절하게 답변드릴게요 :)
        </div>
      </div>
    </>
  );
}
