import { Link } from 'react-router-dom';

const tests = [
    {
        id: 'tetotest',
        title: '테토/에겐/테겐 테스트',
        description: '테토녀·에겐남? 나의 호르몬 성향은 어디에 가까울까?',
        image: require('../img/메인.png'),
    },
    // ...more
];

export default function MainPage() {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header className="w-full bg-white/90 border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-2xl mx-auto py-3 flex justify-center items-center">
                    <span className="text-2xl font-serif tracking-widest text-green-700">TEST / <span className="text-xl align-super">休</span></span>
                </div>
            </header>

            <div className="flex-1 flex flex-col items-center justify-center px-4">
                <div className="w-full max-w-2xl flex flex-col gap-8">
                    {tests.map(test => (
                        <Link
                            key={test.id}
                            to={`/${test.id}`}
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
            <footer className="border-t border-gray-200 py-4 text-center text-gray-400 text-xs mt-12">
                <Link to="/privacy" className="underline hover:text-green-700">개인정보처리방침</Link>
                <span className="mx-2">|</span>
                <Link to="/contact" className="underline hover:text-green-700">Contact</Link>
            </footer>
        </div>
    );
}
