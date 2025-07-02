import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import resultImages from "@/tests/tetotest/resultImages";
import resultDescriptions from "@/tests/tetotest/resultDescriptions";

export default function TetoTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  if (!type) return null;

  const desc = resultDescriptions[type];
  const image = resultImages[type];

  if (!desc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-2">잘못된 결과 값입니다.</h2>
          <Link href="/tetotest" className="text-blue-600 underline">
            테스트 하러가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{type} | 호르몬 성향 테스트 | Test 休</title>
        <meta name="description" content={`${type} 결과. ${desc.성격적특성?.join(', ')}`} />
        <meta property="og:title" content={`${type} | 호르몬 성향 테스트`} />
        <meta property="og:description" content={`${desc.성격적특성?.join(', ')}`} />
        <meta property="og:image" content={`https://test-hugh.co.kr${image}`} />
        <meta property="og:url" content={`https://test-hugh.co.kr/tetotest/result/${type}`} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-orange-50 flex flex-col items-center justify-center px-4 py-2">
        <h2 className="text-3xl font-extrabold text-emerald-500 mb-4 drop-shadow-lg animate-bounce">
          🎉 당신의 호르몬 유형 🎉
        </h2>
        <p className="text-xl mb-4 text-emerald-800">
          당신은 <span className="font-extrabold">{type}</span> 입니다!
        </p>
        <img
          src={image}
          alt={type}
          className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-emerald-300 bg-white"
          style={{ filter: "drop-shadow(0 0 18px #86efac99)" }}
        />
        <div className="mx-auto max-w-lg space-y-5 text-left">
          <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-orange-600 mb-2">성격적 특성</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {desc.성격적특성.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-emerald-600 mb-2">행동적 특성</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {desc.행동적특성.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-xl shadow-sm">
            <h3 className="font-bold text-lg text-pink-600 mb-2">연애 스타일</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {desc.연애스타일.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center mt-8">
          <Link
            href="/tetotest"
            className="bg-white hover:bg-emerald-100 text-emerald-400 py-2 px-7 rounded-xl font-bold shadow-md border border-emerald-200 transition-all duration-200"
          >
            나도 테스트 해보기
          </Link>
          <Link
            href="/"
            className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-7 rounded-xl font-bold shadow-md transition-all duration-200"
          >
            다른 테스트
          </Link>
        </div>
      </div>
    </>
  );
}
// 👇 이거 각 [type].js 파일 아래에 추가
export async function getServerSideProps() {
  return { props: {} };
}
