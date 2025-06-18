// src/pages/MainPage.jsx
import { Link } from 'react-router-dom';

// 테스트 메타데이터 import (새 테스트 생길 때마다 여기에만 import 추가)
import tetotestMeta from '../tests/tetotest/meta';
// 예시) import sociopathMeta from '../tests/sociopathtest/meta';

const tests = [
    tetotestMeta,
    // sociopathMeta,
    // ...추가하면 됨
];

export default function MainPage() {
    return (
        <div className="min-h-screen flex flex-col">
            {/* 헤더 */}
            <header className="w-full border-b border-gray-100 bg-white py-8 mb-10">
                <div className="max-w-xl mx-auto flex flex-col items-center">
                    <h1
                        className="text-6xl md:text-7xl font-brand font-extrabold tracking-tight mb-2 select-none drop-shadow-sm"
                    >
                        TEST <span className="text-7xl md:text-8xl text-emerald-500 align-middle">休</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 font-medium font-brand mt-1">
                        잠시 쉬며 서로를 알아보는 공간
                    </p>
                </div>
            </header>


            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-2xl flex flex-col gap-8">
                    {tests.map(test => (
                        <Link
                            key={test.id}
                            to={test.path}
                            className="bg-green-50 hover:bg-green-100 transition rounded-2xl shadow flex flex-col border border-green-100 overflow-hidden"
                            style={{ width: 420, maxWidth: "100%", minHeight: 320, margin: "0 auto" }}
                        >
                            <img
                                src={test.image}
                                alt={test.title}
                                className="w-full h-44 md:h-56 object-cover rounded-t-2xl"
                                style={{ aspectRatio: "2.4/1" }}
                            />
                            <div className="flex-1 flex flex-col justify-center items-center p-6">
                                <h2 className="text-2xl font-bold mb-1 text-green-600">{test.title}</h2>
                                <p className="text-gray-500 text-base">{test.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
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
