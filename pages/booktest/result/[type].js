import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import results from '@/tests/booktest/result'; // 반드시 경로 확인!

function getResultByType(type) {
  return results.find((res) => res.id === type) || results[0];
}

export default function BookTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  const result = type ? getResultByType(type) : results[0];
  // 만약 bestMatch, worstMatch 있으면 추가! 없으면 이 부분 삭제
  const best = result && getResultByType(result.bestMatch);
  const worst = result && getResultByType(result.worstMatch);

  const resultUrl = `https://test-hugh.co.kr/booktest/result/${type || result.id}`;
  const resultImgUrl = result.image.startsWith('/images')
    ? `https://test-hugh.co.kr${result.image}`
    : result.image;

  // 공유 버튼
  const handleShare = () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      navigator.share({
        title: `독서 성향 테스트 | ${result.name} | Test 休`,
        text: "나의 독서 성향, 너도 확인해봐! 📚",
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
        <title>독서 성향 테스트 | {result.name} | Test 休</title>
        <meta name="description" content={`${result.name} 유형의 독서 스타일과 설명`} />
        <meta property="og:title" content={`독서 성향 테스트 | ${result.name} | Test 休`} />
        <meta property="og:description" content={`${result.name} 유형의 독서 스타일과 설명`} />
        <meta property="og:image" content={resultImgUrl} />
        <meta property="og:url" content={resultUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-sky-50 via-yellow-50 to-indigo-100 flex flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-black text-sky-600 mb-3 drop-shadow-lg animate-bounce">
            📚 나의 독서 유형 📚
          </h2>
          <img
            src={result.image}
            alt={result.name}
            className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-sky-200 bg-white"
            style={{ filter: 'drop-shadow(0 0 18px #38bdf8)' }}
          />
          <div className="mb-3">
            <span className="inline-block bg-sky-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
              {result.name}
            </span>
          </div>
          <div className="bg-white/95 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-sky-300">
            <div className="text-lg font-bold text-sky-500 mb-2">{result.name}</div>
            <div className="text-base text-gray-700">
              {Array.isArray(result.description)
                ? result.description.map((line, i) => (
                    <div key={i} className="mb-1">{line}</div>
                  ))
                : result.description
              }
            </div>
          </div>

          {/* 궁합 파트, 만약 booktest도 bestMatch, worstMatch 있으면 살리고, 없으면 삭제! */}
          {best || worst ? (
            <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-4 mt-2">
              {best && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-sky-500 font-semibold mb-1">
                    🫶 최고의 독서 메이트
                  </span>
                  <img
                    src={best.image}
                    alt={best.name}
                    className="w-20 h-20 rounded-xl mb-1 border-2 border-sky-200"
                  />
                  <span className="text-xs font-bold text-sky-500">{best.name}</span>
                </div>
              )}
              {worst && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-400 font-semibold mb-1">
                    🤔 상극의 독서 메이트
                  </span>
                  <img
                    src={worst.image}
                    alt={worst.name}
                    className="w-20 h-20 rounded-xl mb-1 border-2 border-gray-200"
                  />
                  <span className="text-xs font-bold text-gray-500">{worst.name}</span>
                </div>
              )}
            </div>
          ) : null}

          <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center mt-8">
            <Link
              href="/booktest"
              className="bg-sky-400 hover:bg-sky-500 text-white py-2 px-6 rounded-xl font-bold shadow-md transition"
            >
              나도 다시 테스트
            </Link>
            <button
              onClick={handleShare}
              className="bg-white hover:bg-sky-50 text-sky-400 py-2 px-6 rounded-xl font-bold shadow-md border border-sky-200 transition"
            >
              결과 공유하기
            </button>
            <Link
              href="/"
              className="bg-sky-100 hover:bg-sky-200 text-sky-400 py-2 px-6 rounded-xl font-bold shadow-md border border-sky-200 transition"
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
