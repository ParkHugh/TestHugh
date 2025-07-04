import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import results from '@/tests/flirttest/result';

function getResultByType(type) {
  return results.find((res) => res.id === type) || results[0];
}

export default function FlirtTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  const result = type ? getResultByType(type) : results[0];
  const best = result && getResultByType(result.bestMatch);
  const worst = result && getResultByType(result.worstMatch);
  const resultUrl = `https://test-hugh.co.kr/flirttest/result/${type || result.id}`;
  const resultImgUrl = result.image.startsWith('/images')
    ? `https://test-hugh.co.kr${result.image}`
    : result.image;

  // 공유 버튼
  const handleShare = () => {
    if (typeof window === "undefined") return;
    if (navigator.share) {
      navigator.share({
        title: `플러팅 성향 테스트 | ${result.name} | Test 休`,
        text: "나의 플러팅 성향은? 너도 해봐! 💌",
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
        <title>플러팅 성향 테스트 | {result.name} | Test 休</title>
        <meta name="description" content={`${result.name} 유형의 플러팅 스타일, 궁합까지!`} />
        <meta property="og:title" content={`플러팅 성향 테스트 | ${result.name} | Test 休`} />
        <meta property="og:description" content={`${result.name} 유형의 플러팅 스타일, 궁합까지!`} />
        <meta property="og:image" content={resultImgUrl} />
        <meta property="og:url" content={resultUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-100 flex flex-col items-center justify-center px-4 py-8">
        <div className="flex flex-col items-center w-full">
          <h2 className="text-2xl font-black text-pink-500 mb-3 drop-shadow-lg animate-bounce">
            💌 나의 플러팅 유형 💌
          </h2>
          <img
            src={result.image}
            alt={result.name}
            className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-pink-200 bg-white"
            style={{ filter: 'drop-shadow(0 0 18px #fd95b2)' }}
          />
          <div className="mb-3">
            <span className="inline-block bg-pink-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
              {result.name}
            </span>
          </div>
          <div className="bg-white/95 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-pink-300">
            <div className="text-lg font-bold text-pink-500 mb-2">{result.name}</div>
            <div
              className="text-base text-gray-700"
              dangerouslySetInnerHTML={{ __html: result.description }}
            />
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-4 mt-2">
            {best && (
              <div className="flex flex-col items-center">
                <span className="text-sm text-pink-500 font-semibold mb-1">
                  👩‍❤️‍👨 환상의 플러팅 파트너
                </span>
                <img
                  src={best.image}
                  alt={best.name}
                  className="w-20 h-20 rounded-xl mb-1 border-2 border-pink-200"
                />
                <span className="text-xs font-bold text-pink-500">{best.name}</span>
              </div>
            )}
            {worst && (
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-400 font-semibold mb-1">
                  🤦‍♀️ 환장의 플러팅 파트너
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

          <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center mt-8">
            <Link
              href="/flirttest"
              className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-xl font-bold shadow-md transition"
            >
              나도 다시 테스트
            </Link>
            <button
              onClick={handleShare}
              className="bg-white hover:bg-pink-50 text-pink-400 py-2 px-6 rounded-xl font-bold shadow-md border border-pink-200 transition"
            >
              결과 공유하기
            </button>
            <Link
              href="/"
              className="bg-pink-100 hover:bg-pink-200 text-pink-400 py-2 px-6 rounded-xl font-bold shadow-md border border-pink-200 transition"
            >
              다른 테스트 보러가기
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

// SSG 방지용 SSR 적용 (Next 13+ 에서 필요)
export async function getServerSideProps() {
  return { props: {} };
}
