// src/pages/facismtest/result/[type].js

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import results from '@/tests/facismtest/result';
import meta from '@/tests/facismtest/meta';

function getResultByType(type) {
  if (!type) return results[0];
  if (!isNaN(type)) return results[parseInt(type, 10)] || results[0];
  return results.find((res) => res.id === type) || results[0];
}

export default function FacismTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  const result = getResultByType(type);
  const resultUrl = `https://test-hugh.co.kr/facismtest/result/${type || result.id}`;
  const resultImgUrl = result.image.startsWith('/images')
    ? `https://test-hugh.co.kr${result.image}`
    : result.image;

  // 공유 버튼
  const handleShare = () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      navigator.share({
        title: `파시스트 성향 테스트 | ${result.type} | Test 休`,
        text: "내 안의 파시스트 성향, 너도 확인해봐! 🚨",
        url: resultUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(resultUrl);
      alert("URL이 복사되었습니다!");
    }
  };

  return (
    <>
      <Head>
        <title>파시스트 성향 테스트 | {result.type} | Test 休</title>
        <meta name="description" content={`${result.type} 유형의 시민적 성향, 설명까지!`} />
        <meta property="og:title" content={`파시스트 성향 테스트 | ${result.type} | Test 休`} />
        <meta property="og:description" content={`${result.type} 유형의 시민적 성향, 설명까지!`} />
        <meta property="og:image" content={resultImgUrl} />
        <meta property="og:url" content={resultUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-[#0a1630] via-[#191c24] to-black flex flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-black text-cyan-400 mb-3 drop-shadow-lg animate-bounce">
            🏛️ 나의 시민 성향 결과
          </h2>
          <img
            src={result.image}
            alt={result.type}
            className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-cyan-600 bg-black"
            style={{ filter: 'drop-shadow(0 0 18px #0891b2cc)' }}
          />
          <div className="mb-3">
            <span className="inline-block bg-cyan-800 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
              {result.type}
            </span>
          </div>
          <div className="bg-zinc-900/95 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-cyan-400">
            <div className="text-lg font-bold text-cyan-400 mb-2">{result.type}</div>
            <div className="text-base text-gray-200">
              {Array.isArray(result.description)
                ? result.description.map((line, i) => (
                    <div key={i} className="mb-1">{line}</div>
                  ))
                : result.description
              }
            </div>
          </div>
          <div className="bg-[#17223b]/90 rounded-xl shadow-inner px-5 py-4 mx-auto w-full mb-6 border-l-2 border-cyan-800 text-cyan-200 text-base font-semibold">
            {Array.isArray(result.message)
              ? result.message.map((line, idx) => (
                  <span key={idx}>
                    {line}
                    <br />
                  </span>
                ))
              : result.message
            }
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center mt-8">
            <Link
              href="/facismtest"
              className="bg-cyan-700 hover:bg-cyan-900 text-white py-2 px-6 rounded-xl font-bold shadow-md transition"
            >
              나도 다시 테스트
            </Link>
            <button
              onClick={handleShare}
              className="bg-white hover:bg-cyan-50 text-cyan-700 py-2 px-6 rounded-xl font-bold shadow-md border border-cyan-200 transition"
            >
              결과 공유하기
            </button>
            <Link
              href="/"
              className="bg-cyan-100 hover:bg-cyan-200 text-cyan-700 py-2 px-6 rounded-xl font-bold shadow-md border border-cyan-200 transition"
            >
              다른 테스트 보러가기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// SSG 방지용 SSR 적용 (Next 13+에서 필요)
export async function getServerSideProps() {
  return { props: {} };
}
