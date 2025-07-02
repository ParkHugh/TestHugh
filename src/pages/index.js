import Link from 'next/link';
import tetotestMeta from '@/tests/tetotest/meta';
import sociopathMeta from '@/tests/sociopathtest/meta';
import romanticMeta from '@/tests/romantictest/meta';
import travelMeta from '@/tests/traveltest/meta';
import runnerMeta from '@/tests/runnertest/meta';
import MenuDropdown from '@/components/MenuDropdown';

const tests = [
  tetotestMeta,
  sociopathMeta,
  romanticMeta,
  travelMeta,
  runnerMeta,
];

export default function HomePage() {
  return (
    <div className="bg-[#fcf8ee] min-h-screen flex flex-col">
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

function getTestBgClass(id) {
  if (id === 'sociopathtest') return 'bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 border-red-200 hover:from-gray-950 hover:to-red-800';
  if (id === 'tetotest') return 'bg-gradient-to-br from-emerald-100 via-yellow-50 to-yellow-100 border-emerald-100 hover:from-emerald-200 hover:to-yellow-200';
  if (id === 'romantictest') return 'bg-gradient-to-br from-pink-50 via-yellow-50 to-pink-100 border-pink-100 hover:from-pink-100 hover:to-yellow-100';
  if (id === 'traveltest') return 'bg-gradient-to-br from-blue-50 via-blue-100 to-cyan-100 border-blue-100 hover:from-blue-100 hover:to-cyan-200';
  if (id === 'runnertest') return 'bg-gradient-to-br from-pink-100 via-rose-100 to-yellow-100 border-pink-100 hover:from-pink-200 hover:to-yellow-200';
  return 'bg-white hover:bg-orange-50 border-orange-100';
}

function getTitleColor(id) {
  if (id === 'sociopathtest') return 'text-red-400 drop-shadow';
  if (id === 'romantictest') return 'text-pink-500';
  if (id === 'traveltest') return 'text-blue-700';
  if (id === 'runnertest') return 'text-pink-700';
  return 'text-emerald-700';
}

function getDescriptionColor(id) {
  if (id === 'sociopathtest') return 'text-gray-200';
  if (id === 'romantictest') return 'text-pink-500';
  if (id === 'traveltest') return 'text-sky-700 drop-shadow-sm';
  if (id === 'runnertest') return 'text-pink-700 drop-shadow-sm';
  return 'text-emerald-700';
}

function renderBadge(id) {
  if (id === 'tetotest') return (
    <div className="mb-2">
      <span className="inline-block bg-emerald-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide">
        💞 NEW! 호르몬 유형
      </span>
    </div>
  );
  if (id === 'sociopathtest') return (
    <div className="mb-2">
      <span className="inline-block bg-red-800 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide">
        🤡 NEW! 직장 소시오패스
      </span>
    </div>
  );
  if (id === 'romantictest') return (
    <div className="mb-2">
      <span className="inline-block bg-pink-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide">
        🧚 NEW! 낭만 vs 현실 유형
      </span>
    </div>
  );
  if (id === 'traveltest') return (
    <div className="mb-2">
      <span className="inline-block bg-sky-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide animate-pulse">
        ✈️ NEW! 여행 성향 MBTI
      </span>
    </div>
  );
  if (id === 'runnertest') return (
    <div className="mb-2">
      <span className="inline-block bg-pink-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide animate-bounce-slow">
        🏃‍♂️ NEW! 러닝 성향 유형
      </span>
    </div>
  );
  return null;
}
