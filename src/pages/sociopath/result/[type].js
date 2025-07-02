import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import resultImages from '@/tests/sociopathtest/resultImages';
import resultDescriptions from '@/tests/sociopathtest/resultDescriptions';

export default function SocioTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  const idx = Number(type);
  const desc = resultDescriptions[idx];
  const image =
    idx >= 0 && idx < resultImages.length
      ? `/images/sociopathtest/${resultImages[idx]}`
      : '';

  if (!desc) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-2">잘못된 결과 값입니다.</h2>
          <Link href="/sociopathtest" className="text-blue-600 underline">
            테스트 하러가기
          </Link>
        </div>
      </div>
    );
  }

  const resultUrl = `https://test-hugh.co.kr/sociopathtest/result/${idx}`;
  const resultImgUrl = `https://test-hugh.co.kr${image}`;

  return (
    <>
      <Head>
        <title>{desc.name} | 직장 소시오패스 테스트 | Test 休</title>
        <meta name="description" content={desc.description} />
        <meta property="og:title" content={`[${desc.name}] 직장 소시오패스 테스트 | Test 休`} />
        <meta property="og:description" content={desc.description} />
        <meta property="og:image" content={resultImgUrl} />
        <meta property="og:url" content={resultUrl} />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-900 flex flex-col items-center justify-center px-4 py-2">
        <h2 className="text-3xl font-extrabold text-red-400 mb-4 drop-shadow-lg animate-bounce">
          🎉 당신의 결과 🎉
        </h2>
        <p className="text-xl mb-4 text-gray-100">
          당신은 <span className="font-extrabold">{desc.name}</span> 입니다!
        </p>
        <img
          src={image}
          alt={desc.name}
          className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-red-600/60 bg-black"
          style={{ filter: 'drop-shadow(0 0 15px #fa2a55cc)' }}
        />
        <div className="mx-auto max-w-lg space-y-5 text-left">
          <div className="bg-zinc-900/80 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-red-400">
            <div className="text-lg font-bold text-red-300 mb-2">{desc.name}</div>
            <div className="text-base text-gray-200">{desc.description}</div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center mt-8">
          <Link
            href="/sociopathtest"
            className="bg-white hover:bg-gray-100 text-red-400 py-2 px-7 rounded-xl font-bold shadow-md border border-red-200 transition-all duration-200"
          >
            나도 테스트 해보기
          </Link>
          <Link
            href="/"
            className="bg-emerald-800 hover:bg-emerald-900 text-white py-2 px-7 rounded-xl font-bold shadow-md transition-all duration-200"
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
