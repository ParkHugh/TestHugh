import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import results from "@/tests/romantictest/result";

function getResultByType(type) {
  return results.find(r => r.id === type) || results[0];
}

export default function RomanticTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  if (!type) return null;

  const result = getResultByType(type);
  const resultUrl = `https://test-hugh.co.kr/romantictest/result/${result.id}`;

  const getImgUrl = (img) =>
    typeof img === "string" && img.startsWith("/")
      ? `https://test-hugh.co.kr${img}`
      : img;

  return (
    <>
      <Head>
        <title>{result.name} | 낭만 vs 현실 밸런스 게임</title>
        <meta
          name="description"
          content={result.description.replace(/(<([^>]+)>)/gi, "")}
        />
        <meta property="og:title" content={`${result.name} | 낭만 vs 현실 밸런스 게임`} />
        <meta
          property="og:description"
          content={result.description.replace(/(<([^>]+)>)/gi, "")}
        />
        <meta property="og:image" content={getImgUrl(result.image)} />
        <meta property="og:url" content={resultUrl} />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-100 via-yellow-50 to-pink-200 px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-pink-400 drop-shadow">당신의 밸런스 결과</h2>
        <img
          src={result.image}
          alt={result.name}
          className="w-44 h-44 mb-7 rounded-2xl shadow-xl object-cover border-4 border-pink-300 bg-white"
        />
        <div className="bg-white/90 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-pink-300">
          <div className="text-lg font-bold text-pink-400 mb-2">{result.name}</div>
          <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
        </div>
        <div className="flex gap-2 mt-3">
          <Link
            href="/romantictest"
            className="bg-white hover:bg-pink-100 text-pink-400 py-2 px-7 rounded-xl font-bold shadow-md border border-pink-200 transition"
          >
            나도 테스트 해보기
          </Link>
          <Link
            href="/"
            className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-7 rounded-xl font-bold shadow-md transition"
          >
            다른 테스트 해보기
          </Link>
        </div>
      </div>
    </>
  );
}

// 👇 SSR 적용!
export async function getServerSideProps() {
  return { props: {} };
}
