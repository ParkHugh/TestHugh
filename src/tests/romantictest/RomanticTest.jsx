import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questions from './questions';
import answers from './answers';
import results, { mainImage } from './result';
import Head from 'next/head';
// Firebase 연동 (경로 주의)
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase'; // src/firebase.js 위치에 맞게

// 점수로 결과 찾기
const getResultByScore = (score) => (
    results.find((res) => score >= res.range[0] && score <= res.range[1]) || results[0]
);

export default function RomanticTest() {
    const INITIAL_COUNT = 58791;
    const [step, setStep] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [copied, setCopied] = useState(false);
    const [count, setCount] = useState(INITIAL_COUNT);

    // 참여자 수 불러오기 (Firebase)
    useEffect(() => {
        async function fetchCount() {
            try {
                const ref = doc(db, 'testCounts', 'romanticTest');
                const snap = await getDoc(ref);
                if (snap.exists()) setCount(INITIAL_COUNT + (snap.data().count || 0));
            } catch (e) { /* 무시 */ }
        }
        fetchCount();
    }, []);

    // 시작 버튼: 참여자 수 증가 + 문제 화면 진입
    const startTest = async () => {
        try {
            const ref = doc(db, 'testCounts', 'romanticTest');
            await updateDoc(ref, { count: increment(1) });
        } catch (e) { /* 무시 */ }
        setStep('question');
    };

    const handleAnswer = (value) => {
        const qid = questions[currentQuestion].id;
        setUserAnswers((prev) => ({ ...prev, [qid]: value }));
        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setStep('loading');
            setTimeout(() => setStep('result'), 1800 + Math.random() * 900);
        }
    };

    const restart = () => {
        setStep('intro');
        setCurrentQuestion(0);
        setUserAnswers({});
        setCopied(false);
    };

    const handleShare = () => {
        const shareUrl = typeof window !== 'undefined'
            ? `${window.location.origin}/romantictest/result/${result?.id}`
            : '';
        // ...

        if (navigator.share) {
            navigator.share({
                title: "낭만 vs 현실 밸런스 결과",
                text: "내 안의 낭만 vs 현실 밸런스, 너도 해봐! 🌹",
                url: shareUrl,
            }).catch(() => { });
        } else {
            if (url) navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        }
    };

    const score = Object.values(userAnswers).reduce((a, b) => a + b, 0);
    const result = step === 'result' ? getResultByScore(score) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-yellow-50 to-pink-200 flex flex-col items-center justify-center px-4 py-2">
            <Head>
                <title>낭만 vs 현실 밸런스 게임 | Test 休</title>
                <meta name="description" content="나는 낭만파일까, 현실파일까? 12가지 인생 선택, 내 안의 밸런스를 지금 테스트하세요!" />
                <meta property="og:title" content="낭만 vs 현실 밸런스 게임 | Test 休" />
                <meta property="og:description" content="당신의 선택에는 어떤 밸런스가 있을까? 낭만과 현실의 경계, 12가지 질문으로 진단!" />
                <meta property="og:image" content="https://test-hugh.co.kr/images/romantictest/main.png" />
                <meta property="og:url" content="https://test-hugh.co.kr/romantictest" />
            </Head>

            <AnimatePresence mode="wait">
                {/* 인트로 */}
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center w-full h-full"
                        style={{ minHeight: '80vh' }}
                    >
                        <img
                            src={mainImage}
                            alt="메인"
                            className="w-full max-w-lg h-[36vh] object-contain mb-3 drop-shadow-xl"
                            style={{
                                borderRadius: '2rem',
                                boxShadow: '0 2px 32px 8px #ffb6c1bb',
                                background: '#fff4fa',
                            }}
                        />
                        <h2 className="text-3xl font-extrabold mt-2 mb-2 text-pink-500 tracking-tight drop-shadow-lg animate-bounce">
                            낭만 vs 현실 밸런스게임
                        </h2>
                        <p className="mb-2 text-pink-500 text-lg text-center font-medium max-w-xl shadow-inner">
                            나는 낭만파일까, 현실파일까?<br />
                            12가지 인생 선택!<br /> 당신의 인생 밸런스를 테스트해보세요.
                        </p>
                        <p className="mb-6 text-pink-400 text-sm font-semibold">
                            🔥 {count.toLocaleString()}명이 참여했어요
                        </p>
                        <button
                            onClick={startTest}
                            className="bg-gradient-to-r from-pink-400 via-pink-300 to-yellow-300 hover:from-pink-500 hover:to-yellow-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-2 ring-pink-200 animate-bounce-slow"
                        >
                            {`테스트 시작하기 🌸`}
                        </button>
                    </motion.div>
                )}

                {/* 질문 */}
                {step === 'question' && questions[currentQuestion] && (
                    <motion.div
                        key={currentQuestion}
                        initial={{ opacity: 0, y: 32, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.96 }}
                        transition={{ duration: 0.33, ease: 'easeOut' }}
                        className="bg-white/90 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-pink-300"
                    >
                        {/* 진행 바 */}
                        <div className="w-full mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-pink-400 tracking-wider">
                                    PROGRESS
                                </span>
                                <span className="text-xs text-pink-400">
                                    {currentQuestion + 1} / {questions.length}
                                </span>
                            </div>
                            <div className="w-full bg-pink-100 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-pink-400 via-yellow-300 to-pink-400 h-2.5 rounded-full transition-all duration-500"
                                    style={{
                                        width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                                    }}
                                />
                            </div>
                        </div>
                        {/* vs 분할 렌더링 */}
                        <div className="flex items-center justify-center gap-2 mb-6">
                            <span className="flex-1 text-right font-bold text-base md:text-lg text-pink-500 pr-2 break-keep">
                                {questions[currentQuestion].text.split(' vs ')[0]}
                            </span>
                            <span className="text-lg md:text-2xl font-black text-yellow-500 px-2 select-none drop-shadow animate-pulse">
                                vs
                            </span>
                            <span className="flex-1 text-left font-bold text-base md:text-lg text-blue-400 pl-2 break-keep">
                                {questions[currentQuestion].text.split(' vs ')[1]}
                            </span>
                        </div>

                        <div className="space-y-3">
                            {answers.map((answer, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(answer.value)}
                                    className={`
                    w-full py-3 rounded-xl font-bold text-lg 
                    transition-all duration-200 shadow-xl
                    ${idx === 0
                                            ? 'bg-pink-400 text-white hover:bg-pink-500'
                                            : 'bg-blue-300 text-white hover:bg-blue-500'}
                  `}
                                >
                                    {questions[currentQuestion][idx === 0 ? 'a' : 'b']}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* 로딩 */}
                {step === 'loading' && (
                    <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center min-h-[320px] w-full"
                    >
                        <div className="animate-spin mb-6 mt-9">
                            <svg width={64} height={64} viewBox="0 0 52 52" fill="none">
                                <circle
                                    cx={26}
                                    cy={26}
                                    r={22}
                                    stroke="#ff9aa2"
                                    strokeWidth={6}
                                    strokeDasharray="48 50"
                                    strokeLinecap="round"
                                    opacity={0.16}
                                />
                                <circle
                                    cx={26}
                                    cy={26}
                                    r={22}
                                    stroke="#fcb900"
                                    strokeWidth={6}
                                    strokeDasharray="36 50"
                                    strokeLinecap="round"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        values="0 26 26;360 26 26"
                                        dur="1.1s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </svg>
                        </div>
                        <p className="text-lg font-black mb-2 text-pink-400 tracking-wider animate-pulse">
                            밸런스 분석 중...
                        </p>
                        <p className="text-xs text-pink-400 mt-5">
                            당신의 선택, 곧 공개됩니다!
                        </p>
                    </motion.div>
                )}

                {/* 결과 */}
                {step === 'result' && result && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-black text-pink-400 mb-3 drop-shadow-lg animate-bounce">
                            🎉 당신의 밸런스 결과 🎉
                        </h2>
                        <img
                            src={result.image}
                            alt={result.name}
                            className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-pink-300 bg-white"
                            style={{ filter: 'drop-shadow(0 0 18px #fcb900aa)' }}
                        />
                        <div className="mb-3">
                            <span className="inline-block bg-pink-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                                {result.name}
                            </span>
                        </div>
                        <div className="bg-white/90 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-pink-300">
                            <div className="text-lg font-bold text-pink-400 mb-2">
                                {result.name}
                            </div>
                            <div className="text-base text-gray-700">{result.description}</div>
                        </div>
                        <button
                            onClick={restart}
                            className="bg-white hover:bg-pink-100 text-pink-400 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-pink-200"
                        >
                            다시 하기
                        </button>
                        <button
                            onClick={handleShare}
                            className="bg-gradient-to-r from-pink-400 via-yellow-300 to-yellow-400 hover:from-pink-500 hover:to-yellow-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
                        >
                           결과 공유하기
                        </button>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
                        >
                            다른 테스트 해보기
                        </button>
                        {copied && (
                            <div className="mt-2 text-sm text-green-500 animate-fade-in">
                                URL이 복사되었습니다!
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
