// src/pages/MainPage.jsx
import { Link } from 'react-router-dom';
import tetotestMeta from '../tests/tetotest/meta';
import sociopathMeta from '../tests/sociopathtest/meta';
import romanticMeta from '../tests/romantictest/meta';

const tests = [tetotestMeta, sociopathMeta, romanticMeta];

export default function MainPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-emerald-50">
            {/* 헤더 */}
            <header className="w-full border-b border-gray-100 bg-white py-8 mb-3">
                <div className="max-w-xl mx-auto flex flex-col items-center">
                    <h1 className="font-brand font-extrabold tracking-tight mb-2 select-none drop-shadow-sm flex items-end gap-2">
                        <span className="text-5xl md:text-6xl text-gray-900">TEST /</span>
                        <span className="text-4xl md:text-5xl text-green-700 align-baseline">休</span>
                    </h1>
                    <p className="text-base md:text-lg font-brand font-medium text-emerald-800 mt-1">
                        잠시 쉬며 서로를 알아보는 공간
                    </p>
                </div>
            </header>
            {/* 결과 모아보기 버튼 */}
            <div className="w-full max-w-2xl mx-auto flex justify-center px-2 mb-6">
                <Link
                    to="/results"
                    className="font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 px-5 py-2 rounded-xl shadow-sm transition text-base md:text-lg whitespace-nowrap"
                >
                    📝 테스트별 결과 유형 보기
                </Link>
            </div>
            {/* 카드 리스트 */}
            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-2xl flex flex-col gap-8">
                    {tests.map(test => (
                        <Link
                            key={test.id}
                            to={test.path}
                            className={`
                                transition rounded-2xl shadow flex flex-col border overflow-hidden
                                ${
                                    test.id === 'sociopathtest'
                                        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 border-red-200 hover:from-gray-950 hover:to-red-800'
                                        : test.id === 'tetotest'
                                            ? 'bg-gradient-to-br from-emerald-400 via-green-300 to-yellow-200 border-emerald-200 hover:from-green-500 hover:to-yellow-300'
                                            : test.id === 'romantictest'
                                                ? 'bg-gradient-to-br from-pink-200 via-yellow-100 to-pink-100 border-pink-200 hover:from-pink-300 hover:to-yellow-200'
                                                : 'bg-green-50 hover:bg-green-100 border-green-100'
                                }
                            `}
                            style={{ width: 420, maxWidth: "100%", minHeight: 320, margin: "0 auto" }}
                        >
                            <img
                                src={test.image}
                                alt={test.title}
                                className={`
                                    w-full h-44 md:h-56 object-cover rounded-t-2xl
                                    ${test.id === 'sociopathtest' ? 'bg-black' : ''}
                                `}
                                style={{ aspectRatio: "2.4/1" }}
                            />
                            <div className="flex-1 flex flex-col justify-center items-center p-6">
                                <h2 className={`
                                    text-2xl font-bold mb-1
                                    ${
                                        test.id === 'sociopathtest'
                                            ? 'text-red-400 drop-shadow'
                                            : test.id === 'romantictest'
                                                ? 'text-pink-500'
                                                : 'text-green-600'
                                    }
                                `}>
                                    {test.title}
                                </h2>
                                {test.id === 'sociopathtest' && (
                                    <div className="mb-2">
                                        <span className="inline-block bg-red-800 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide">
                                            NEW! 직장 소시오패스
                                        </span>
                                    </div>
                                )}
                                {test.id === 'romantictest' && (
                                    <div className="mb-2">
                                        <span className="inline-block bg-pink-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide">
                                            NEW! 낭만 vs 현실 밸런스
                                        </span>
                                    </div>
                                )}
                                <p className={`
                                    text-base
                                    ${
                                        test.id === 'sociopathtest'
                                            ? 'text-gray-200'
                                            : test.id === 'romantictest'
                                                ? 'text-pink-500'
                                                : 'text-gray-500'
                                    }
                                `}>
                                    {test.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {/* 푸터 */}
            <footer className="w-full border-t bg-gray-50 py-6 mt-10 text-center text-gray-500 text-sm">
                <div className="flex justify-center space-x-4">
                    <a href="/about" className="hover:underline">About</a>
                    <a href="/privacypolicy" className="hover:underline">개인정보처리방침</a>
                    <a href="/contact" className="hover:underline">Contact</a>
                </div>
                <div className="mt-2">© {new Date().getFullYear()} TEST 休</div>
            </footer>
        </div>
    );
}
