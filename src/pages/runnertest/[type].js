import Head from "next/head";
import { useRouter } from "next/router";
import results from "../../tests/runnertest/result"; // result.js에서 import

function getResultByType(type) {
  return results.find(r => r.id === type) || results[0];
}

export default function RunnerTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  // 아직 type이 안 들어온 경우(초기 렌더링)에는 렌더링 X
  if (!type) return null;

  const result = getResultByType(type);
  const best = getResultByType(result.bestMatch);
  const worst = getResultByType(result.worstMatch);

  // 이미지 경로 자동 완성
  const getImgUrl = (img) =>
    typeof img === "string" && img.startsWith("/")
      ? `https://test-hugh.co.kr${img}`
      : img;

  const resultUrl = `https://test-hugh.co.kr/runnertest/result/${result.id}`;

  return (
    <>
      <Head>
        <title>{result.name} | 러너 성향 테스트</title>
        <meta
          name="description"
          content={result.description.replace(/(<([^>]+)>)/gi, "")}
        />
        <meta property="og:title" content={`${result.name} | 러너 성향 테스트`} />
        <meta
          property="og:description"
          content={result.description.replace(/(<([^>]+)>)/gi, "")}
        />
        <meta property="og:image" content={getImgUrl(result.image)} />
        <meta property="og:url" content={resultUrl} />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200 flex flex-col items-center justify-center px-4 py-2">
        <div className="text-center">
          <h2 className="text-2xl font-black text-pink-400 mb-3 drop-shadow-lg animate-bounce">
            🏅 {result.name} 🏅
          </h2>
          <img
            src={result.image}
            alt={result.name}
            className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-rose-200 bg-white"
            style={{ filter: "drop-shadow(0 0 18px #f99dbb88)" }}
          />
          <div className="bg-white/95 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-rose-300">
            <div className="text-lg font-bold text-pink-500 mb-2">
              {result.name}
            </div>
            <div
              className="text-base text-gray-700"
              dangerouslySetInnerHTML={{ __html: result.description }}
            />
          </div>
          {/* 매칭 섹션 */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-4 mt-2">
            {best && (
              <div className="flex flex-col items-center">
                <span className="text-sm text-pink-500 font-semibold mb-1">
                  👩‍❤️‍👨 환상의 러닝메이트
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
                  🤦‍♀️ 환장의 러닝메이트
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
          <a
            href="/runnertest"
            className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md inline-block"
          >
            나도 테스트 해보기
          </a>
          <a
            href="/"
            className="bg-white hover:bg-pink-50 text-pink-400 py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md border border-pink-200 inline-block"
          >
            다른 테스트
          </a>
        </div>
      </div>
    </>
  );
}
