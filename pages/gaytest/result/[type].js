// src/pages/gaytest/result/[type].js

import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import results from '@/tests/gaytest/result';
import meta from '@/tests/gaytest/meta';

function getResultByType(type) {
  if (!type) return results[0];
  if (!isNaN(type)) return results[parseInt(type, 10)] || results[0];
  return results.find((res) => res.id === type) || results[0];
}

export default function GayTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  const result = getResultByType(type);
  const resultUrl = `https://test-hugh.co.kr/gaytest/result/${type || result.id}`;
  const resultImgUrl = result.image.startsWith('/images')
    ? `https://test-hugh.co.kr${result.image}`
    : result.image;

  // 공유 버튼
  const handleShare = () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      navigator.share({
        title: `게이력 테스트 | ${result.type} | Test 休`,
        text: "나의 숨겨진 게이력, 너도 확인해봐! 🌈",
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
        <title>게이력 테스트 | {result.type} | Test 休</title>
        <meta name="description" content={`${result.type} 유형 해설 및 감성/상남자력 설명!`} />
        <meta property="og:title" content={`게이력 테스트 | ${result.type} | Test 休`} />
        <meta property="og:description" content={`${result.type} 유형 해설 및 감성/상남자력 설명!`} />
        <meta property="og:image" content={resultImgUrl} />
        <meta property="og:url" content={resultUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-100 to-fuchsia-200 flex flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-black text-fuchsia-600 mb-3 drop-shadow-lg animate-bounce">
            🌈 나의 감성 게이력 결과
          </h2>
          <img
            src={result.image}
            alt={result.type}
            className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-fuchsia-300 bg-white"
            style={{ filter: 'drop-shadow(0 0 18px #b02fffbb)' }}
          />
          <div className="mb-3">
            <span className="inline-block bg-gradient-to-r from-fuchsia-400 via-purple-400 to-violet-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
              {result.type}
            </span>
          </div>
          <div className="bg-white/90 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-fuchsia-300">
            <div className="text-lg font-bold text-fuchsia-600 mb-2">{result.type}</div>
            <div className="text-base text-gray-700">
              {Array.isArray(result.description)
                ? result.description.map((line, i) => (
                    <div key={i} className="mb-1">{line}</div>
                  ))
                : <div dangerouslySetInnerHTML={{ __html: result.description }} />
              }
            </div>
          </div>
          {/* message 필드가 있으면 */}
          {result.message && (
            <div className="bg-gradient-to-r from-purple-100 via-fuchsia-100 to-blue-100 rounded-xl shadow-inner px-5 py-4 mx-auto max-w-lg mb-6 border-l-2 border-fuchsia-300 text-fuchsia-600 text-base font-semibold">
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
          )}
          <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center mt-8">
            <Link
              href="/gaytest"
              className="bg-fuchsia-400 hover:bg-fuchsia-600 text-white py-2 px-6 rounded-xl font-bold shadow-md transition"
            >
              다시 테스트하기
            </Link>
            <button
              onClick={handleShare}
              className="bg-white hover:bg-fuchsia-50 text-fuchsia-600 py-2 px-6 rounded-xl font-bold shadow-md border border-fuchsia-200 transition"
            >
              결과 공유하기
            </button>
            <Link
              href="/"
              className="bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 py-2 px-6 rounded-xl font-bold shadow-md border border-fuchsia-200 transition"
            >
              다른 테스트 보러가기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// SSR
export async function getServerSideProps() {
  return { props: {} };
}
