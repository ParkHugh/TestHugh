import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';

// 결과 데이터
const results = [
  {
    id: '1',
    name: "지극히 현실적인 리얼리스트",
    description: "당신은 꿈보다는 현실, 감성보다는 실리! 모든 선택에서 안정과 합리를 가장 중시합니다. 낭만적 상상보단, 실질적인 득실을 따지는 진짜 ‘이성파’.실리와 안전, 합리적 계산! 당신은 현실을 넘어선 철벽 실전러. 웬만한 낭만에는 꿈쩍도 않는 냉철함의 끝판왕!",
    image: '/images/romantictest/real.png',
  },
  {
    id: '2',
    name: "현실을 챙기는 낭만혼종",
    description: "현실감각 장착 + 낭만도 살짝! 주로 현실적인 선택을 하면서도, 마음 한구석에는 작은 낭만이 있습니다. 때로는 감성에 젖기도 하지만,결국 중요한 순간엔 ‘현실’ 쪽으로 무게추가 쏠리는 편!",
    image: '/images/romantictest/realroman.png',
  },
  {
    id: '3',
    name: "현실에 기반한 프로 낭만러",
    description: "낭만과 현실, 두 마리 토끼를 잡고 싶은 타입! 상황에 따라 감성/실리를 자유자재로 넘나드는 유연함이 장점. 가끔 ‘될 대로 되라’ 한 방에 폭주하기도 하는 당신! 상황 따라 감성/실리로 요동치지만 삶의 작은 낭만들은 놓치지 않고 충실히 느끼는 프로 낭만러!",
    image: '/images/romantictest/romanreal.png',
  },
  {
    id: '4',
    name: "낭만 빼면 시체, 대가리 꽃밭",
    description: "이성? 계산? 그게 뭐죠? 낙천적인 당신은 상상과 감성, 낭만에 흠뻑 젖어 사는 진짜 ‘로맨티스트’. 실리보다 꿈, 현실보다 판타지! 마음 가는 대로, 감정 가는 대로! 인생은 판타지와 낭만이지~ 꿈꾸며 사는 진정한 드림러! 삶을 멋지고 특별하게 만드는 건 결국 당신 같은 사람!",
    image: '/images/romantictest/romantic.png',
  },
];

export default function RomanticTestResultPage() {
  const router = useRouter();
  const { type } = router.query;

  const result = results.find(r => r.id === type);
  const resultUrl = `https://test-hugh.co.kr/romantictest/result/${result?.id}`;

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-3">잘못된 결과 값입니다.</h1>
        <Link href="/romantictest" className="text-blue-500 underline">
          테스트 다시 하기
        </Link>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{result.name} | 낭만 vs 현실 밸런스 게임</title>
        <meta name="description" content={result.description} />
        <meta property="og:title" content={`${result.name} | 낭만 vs 현실 밸런스 게임`} />
        <meta property="og:description" content={result.description} />
        <meta property="og:image" content={`https://test-hugh.co.kr${result.image}`} />
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
          <div className="text-base text-gray-700">{result.description}</div>
        </div>
        <div className="flex gap-2 mt-3">
          <Link
            href="/romantictest"
            className="bg-white hover:bg-pink-100 text-pink-400 py-2 px-7 rounded-xl font-bold shadow-md border border-pink-200 transition"
          >
            다시 하기
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
