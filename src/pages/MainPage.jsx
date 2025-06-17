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
            <header className="py-8 flex flex-col items-center">
                <h1 className="font-serif text-3xl md:text-4xl tracking-widest text-gray-800 font-semibold mb-8">
                    TEST / 休
                    <span className="block text-green-500 font-semibold text-xl mt-1">잠시 쉬어가며 서로를 알아보는 시간 </span>
                </h1>
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
