import Head from "next/head";
import Link from 'next/link';
import { useEffect } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '@/firebase';

import tetotestMeta from '@/tests/tetotest/meta';
import sociopathMeta from '@/tests/sociopathtest/meta';
import romanticMeta from '@/tests/romantictest/meta';
import travelMeta from '@/tests/traveltest/meta';
import runnerMeta from '@/tests/runnertest/meta';
import flirtMeta from '@/tests/flirttest/meta';
import facismMeta from '@/tests/facismtest/meta';
import bookMeta from '@/tests/booktest/meta';
import adhdtestMeta from '@/tests/adhdtest/meta';
import gaytestMeta from '@/tests/gaytest/meta';
import attachmenttestMeta from '@/tests/attachmenttest/meta';

// ✅ NEW: Narcism Test
import narcismMeta from '@/tests/narcismtest/meta';

import MenuDropdown from '@/components/MenuDropdown';

const tests = [
  tetotestMeta,
  sociopathMeta,
  romanticMeta,
  travelMeta,
  runnerMeta,
  flirtMeta,
  facismMeta,
  bookMeta,
  adhdtestMeta,
  gaytestMeta,
  attachmenttestMeta,
  // ✅ NEW: 홈 목록에 추가
  narcismMeta,
];

export default function HomePage() {
  useEffect(() => {
    analytics.then((ga) => {
      if (ga) logEvent(ga, 'view_main');
    });
  }, []);
  return (
    <div className="bg-[#fcf8ee] min-h-screen flex flex-col">
      <Head>
        <title>최신 무료 성격유형 심리테스트 공간 | Test 休 </title>
        <meta name="description" content=" 성격유형, 심리테스트, 러너 유형, 여행, 독서 성향까지 모든 테스트를 한 곳에서! Test 休에서 새로운 나를 발견하세요!" />
        <meta name="keywords" content="성격유형, 심리검사, 테토 테스트, 소시오패스테스트, 러너 유형, 여행성향, 플러팅, 파시스트, 독서 성향, 심리 테스트, 무료테스트, 밸런스게임, MBTI, 직장 테스트" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Test 休 | 최신 심리테스트 & 성격유형, 밸런스게임 총집합" />
        <meta property="og:description" content="성격유형, 심리테스트, 소시오패스, 여행, 독서 성향, MBTI 최신 유형 테스트와 밸런스게임! 1분 만에 결과 확인 & 공유 가능!" />
        <meta property="og:image" content="/ogimage.webp" />
        <meta property="og:url" content="https://test-hugh.co.kr" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="canonical" href="https://test-hugh.co.kr" />
      </Head>
      <header className="w-full border-b border-orange-100 bg-white py-8 mb-3 relative">
        <div className="max-w-xl mx-auto flex flex-col items-center">
          <h1 className="font-brand font-extrabold tracking-tight mb-2 select-none drop-shadow-sm flex items-end gap-2">
            <span className="text-5xl md:text-6xl text-gray-900">TEST /</span>
            <span className="text-4xl md:text-5xl text-green-700 align-baseline">休</span>
          </h1>
          <p className="text-base md:text-lg font-brand font-medium text-emerald-800 mt-1">
            잠시 쉬며 서로를 알아보는 공간
          </p>
        </div>
        <div className="absolute top-5 right-5">
          <MenuDropdown />
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-2xl flex flex-col gap-8">
          {tests.map((test) => (
            <Link
              key={test.id}
              href={test.path}
              className={`
                transition rounded-2xl shadow flex flex-col border overflow-hidden
                duration-200 hover:scale-[1.033] hover:shadow-2xl hover:z-10
                ${getTestBgClass(test.id)}
              `}
              style={{
                width: 420,
                maxWidth: '100%',
                minHeight: 320,
                margin: '0 auto',
                cursor: 'pointer',
              }}
            >
              <img
                src={test.image}
                alt={test.title}
                className={`
                  w-full h-44 md:h-56 object-cover rounded-t-2xl
                  ${test.id === 'sociopathtest' ? 'bg-black' : ''}
                `}
                style={{ aspectRatio: '2.4/1' }}
              />
              <div className="flex-1 flex flex-col justify-center items-center p-6">
                <h2 className={`text-2xl font-bold mb-1 ${getTitleColor(test.id)}`}>
                  {test.title}
                </h2>
                {renderBadge(test.id)}
                <p className={getDescriptionColor(test.id)}>{test.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <footer className="w-full border-t bg-[#fcf8ee] py-6 mt-10 text-center text-orange-300 text-sm">
        <div className="flex justify-center space-x-4">
          <Link href="/privacy" className="hover:underline">개인정보처리방침</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </div>
        <div className="mt-2">© {new Date().getFullYear()} TEST 休. ALL RIGHTS RESERVED</div>
      </footer>
    </div>
  );
}

// ----------------------
// 아래 유틸 함수들: narcismtest 스타일 추가
function getTestBgClass(id) {
  if (id === 'sociopathtest') return 'bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 border-red-200 hover:from-gray-950 hover:to-red-800';
  if (id === 'tetotest') return 'bg-gradient-to-br from-emerald-100 via-yellow-50 to-yellow-100 border-emerald-100 hover:from-emerald-200 hover:to-yellow-200';
  if (id === 'romantictest') return 'bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-100 border-pink-100 hover:from-pink-100 hover:to-yellow-100';
  if (id === 'traveltest') return 'bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 border-blue-100 hover:from-blue-100 hover:to-cyan-200';
  if (id === 'runnertest') return 'bg-gradient-to-br from-green-100 via-emerald-100 to-yellow-100 border-pink-100 hover:from-green-200 hover:to-yellow-200';
  if (id === 'flirttest') return 'bg-gradient-to-br from-rose-300 via-pink-200 to-red-400 border-pink-200 hover:from-rose-200 hover:to-red-300';
  if (id === 'facismtest') return 'bg-gradient-to-br from-blue-900 via-zinc-900 to-black border-blue-200 hover:from-blue-900 hover:to-zinc-800';
  if (id === 'booktest') return 'bg-gradient-to-br from-yellow-100 via-yellow-200 to-orange-300 border-yellow-200 hover:from-yellow-300 hover:to-orange-300';
  if (id === 'adhdtest') return 'bg-gradient-to-tr from-pink-300 via-yellow-200 via-green-200 via-sky-200 via-blue-400 via-violet-300 to-fuchsia-300 border-pink-300 hover:from-fuchsia-300 hover:to-yellow-300';
  if (id === 'gaytest') return 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800 border-indigo-900 hover:from-indigo-800 hover:to-purple-900';
  if (id === 'attachmenttest') return 'bg-gradient-to-br from-yellow-50 via-pink-50 to-pink-100 border-pink-100 hover:from-yellow-100 hover:to-pink-200';

  // ✅ NEW: Narcism Test 카드 그라데이션
  if (id === 'narcismtest')
    return 'bg-gradient-to-br from-black via-[#0b0f0c] to-[#0b1a12] border-emerald-700 hover:from-black hover:to-[#0b1a12]';

  return 'bg-white hover:bg-orange-50 border-orange-100';
}

function getTitleColor(id) {
  if (id === 'sociopathtest') return 'text-red-400 drop-shadow';
  if (id === 'romantictest') return 'text-pink-500';
  if (id === 'traveltest') return 'text-blue-700';
  if (id === 'runnertest') return 'text-green-700';
  if (id === 'flirttest') return 'text-rose-500 drop-shadow';
  if (id === 'facismtest') return 'text-blue-400 drop-shadow-lg';
  if (id === 'booktest') return 'text-orange-600 drop-shadow';
  if (id === 'adhdtest') return 'bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent drop-shadow font-extrabold';
  if (id === 'gaytest') return 'text-fuchsia-100 drop-shadow font-bold';
  if (id === 'attachmenttest') return 'text-pink-400 drop-shadow font-bold';

  // ✅ NEW: Narcism Test
  if (id === 'narcismtest') return 'text-emerald-300 drop-shadow font-extrabold';

  return 'text-emerald-700';
}

function getDescriptionColor(id) {
  if (id === 'sociopathtest') return 'text-gray-200';
  if (id === 'romantictest') return 'text-pink-500';
  if (id === 'traveltest') return 'text-sky-700 drop-shadow-sm';
  if (id === 'runnertest') return 'text-yellow-700 drop-shadow-sm';
  if (id === 'flirttest') return 'text-rose-500';
  if (id === 'facismtest') return 'text-blue-500';
  if (id === 'booktest') return 'text-yellow-800 drop-shadow-sm';
  if (id === 'adhdtest') return 'bg-gradient-to-r from-pink-400 via-yellow-400 to-blue-400 bg-clip-text text-transparent drop-shadow-sm font-extrabold';
  if (id === 'gaytest') return 'text-fuchsia-100 drop-shadow font-bold';
  if (id === 'attachmenttest') return 'text-pink-500';

  // ✅ NEW: Narcism Test
  if (id === 'narcismtest') return 'text-emerald-200/90';

  return 'text-emerald-700';
}

function renderBadge(id) {
  if (id === 'tetotest') return (
    <div className="mb-2">
      <span className="inline-block bg-emerald-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold animate-bounce">
        💞 NEW! 호르몬 유형
      </span>
    </div>
  );
  if (id === 'sociopathtest') return (
    <div className="mb-2">
      <span className="inline-block bg-red-800 text-white text-xs px-3 py-1 rounded-full shadow font-semibold animate-bounce">
        🤡 NEW! 직장 소시오패스
      </span>
    </div>
  );
  if (id === 'romantictest') return (
    <div className="mb-2">
      <span className="inline-block bg-pink-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold animate-bounce">
        🧚 NEW! 낭만 vs 현실 유형
      </span>
    </div>
  );
  if (id === 'traveltest') return (
    <div className="mb-2">
      <span className="inline-block bg-sky-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide animate-bounce">
        ✈️ NEW! 여행 성향 MBTI
      </span>
    </div>
  );
  if (id === 'runnertest') return (
    <div className="mb-2">
      <span className="inline-block bg-emerald-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide animate-bounce">
        🏃‍♂️ NEW! 러닝 성향 유형
      </span>
    </div>
  );
  if (id === 'flirttest') return (
    <div className="mb-2">
      <span className="inline-block bg-rose-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide animate-bounce">
        💌 NEW! 플러팅 성향
      </span>
    </div>
  );
  if (id === 'facismtest') return (
    <div className="mb-2">
      <span className="inline-block bg-blue-700 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide animate-bounce">
        🚨 NEW! 파시스트 성향
      </span>
    </div>
  );
  if (id === 'booktest') return (
    <div className="mb-2">
      <span className="inline-block bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide animate-bounce">
        📚 NEW! 독서 성향
      </span>
    </div>
  );
  if (id === 'adhdtest') return (
    <div className="mb-2">
      <span className="inline-block bg-gradient-to-r from-fuchsia-400 via-yellow-300 to-blue-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold animate-bounce">
        🧠 NEW! ADHD 유형
      </span>
    </div>
  );
  if (id === 'gaytest') return (
    <div className="mb-2">
      <span className="inline-block bg-gradient-to-r from-fuchsia-400 via-purple-400 to-violet-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide animate-bounce">
        🌈 NEW! 게이력 테스트
      </span>
    </div>
  );
  if (id === 'attachmenttest') return (
    <div className="mb-2">
      <span className="inline-block bg-gradient-to-r from-yellow-300 via-pink-300 to-pink-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold animate-bounce">
        💖 NEW! 애착 유형 테스트
      </span>
    </div>
  );

  // ✅ NEW: Narcism Test
  if (id === 'narcismtest') return (
    <div className="mb-2">
      <span className="inline-block bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 text-white text-xs px-3 py-1 rounded-full shadow font-semibold animate-bounce">
        🧿 NEW! 나르시스트 성향
      </span>
    </div>
  );

  return null;
}
