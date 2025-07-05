import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import questions from '@/tests/facismtest/questions';
import answers from '@/tests/facismtest/answers';
import results from '@/tests/facismtest/result';
import meta from '@/tests/facismtest/meta';

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';

// 결과 산정: 15문항 * 3점(max)=45점, 5등분
function getResultIdx(userAnswers) {
    const total = Object.values(userAnswers).reduce((sum, v) => sum + v, 0);
    if (total <= 9) return 0;        // 건강한 민주 시민
    if (total <= 18) return 1;       // 비판적 합리 시민
    if (total <= 27) return 2;       // 현실 순응·기회주의 시민
    if (total <= 36) return 3;       // 질서·권위 우선/파시스트 경향
    return 4;                        // 권위·동조 파시스트(최상위)
}

export default function FacismTest() {
    const INITIAL_COUNT = 13100;
    const [step, setStep] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [copied, setCopied] = useState(false);
    const [count, setCount] = useState(INITIAL_COUNT);

    const router = useRouter();

    // 참여자 수 불러오기
    useEffect(() => {
        async function fetchCount() {
            try {
                const ref = doc(db, 'testCounts', 'facismTest');
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setCount(INITIAL_COUNT + (snap.data().count || 0));
                }
            } catch (e) { }
        }
        fetchCount();
    }, []);

    // 시작 시 참여 카운트 증가
    const startTest = async () => {
        try {
            const ref = doc(db, 'testCounts', 'facismTest');
            await updateDoc(ref, { count: increment(1) });
        } catch (e) { }
        setStep('question');
    };

    // 답변 처리
    const handleAnswer = (value) => {
        const qid = questions[currentQuestion].id;
        setUserAnswers((prev) => ({ ...prev, [qid]: value }));

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setStep('loading');
            setTimeout(() => setStep('result'), 2100 + Math.random() * 900);
        }
    };

    const restart = () => {
        setStep('intro');
        setCurrentQuestion(0);
        setUserAnswers({});
        setCopied(false);
    };

    const resultIdx = step === 'result' ? getResultIdx(userAnswers) : null;
    const resultData = resultIdx !== null ? results[resultIdx] : null;

    // 공유 버튼
    const handleShare = () => {
        if (step !== 'result' || !resultData) return;
        const shareUrl =
            typeof window !== 'undefined'
                ? `${window.location.origin}${meta.path}/result/${resultIdx}`
                : '';
        if (navigator.share) {
            navigator
                .share({
                    title: meta.title,
                    text: "내 안의 파시스트 성향 테스트 결과",
                    url: shareUrl,
                })
                .catch(() => { });
        } else if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#121c2b] via-[#191c24] to-black flex flex-col items-center justify-center px-4 py-2">
            <Head>
                <title>{meta.title} | Test 休</title>
                <meta name="description" content={meta.description} />
                <meta property="og:title" content={meta.title + " | Test 休"} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.image} />
                <meta property="og:url" content={`https://test-hugh.co.kr${meta.path}`} />
            </Head>

            <AnimatePresence mode="wait">
                {/* 인트로 화면 */}
                {step === 'intro' && (
                    <motion.div
                        key="intro"
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex flex-col items-center justify-center w-full h-full"
                        style={{ minHeight: '78vh' }}
                    >
                        <img
                            src={meta.image}
                            alt="메인"
                            className="w-full max-w-lg h-[36vh] object-contain mb-3 drop-shadow-xl"
                            style={{
                                borderRadius: '2rem',
                                boxShadow: '0 2px 32px 8px rgba(18,28,43,0.35)',
                                background: '#232c36',
                            }}
                        />
                        <h2 className="text-3xl font-black mt-2 mb-2 text-blue-300 tracking-tight drop-shadow-lg animate-bounce">
                            파시스트 성향 테스트
                        </h2>
                        <p className="mb-8 text-gray-200 text-lg text-center font-medium max-w-xl shadow-inner">
                            혹시 나도 모르게 파시스트적 사고가 스며들어 있는 건 아닐까? <br />
                            일상과 사회에서 드러나는 내 숨은 경향을 알아보세요.
                        </p>
                        <p className="mb-6 text-blue-300 text-sm font-semibold">
                            🧩 {count.toLocaleString()}명이 참여했어요
                        </p>
                        <button
                            onClick={startTest}
                            className="bg-gradient-to-r from-blue-900 via-blue-700 to-cyan-600 hover:from-blue-800 hover:to-blue-500 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-1 ring-black/20 animate-bounce-slow"
                        >
                            {`테스트 시작하기 🚦`}
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
                        transition={{ duration: 0.32, ease: 'easeOut' }}
                        className="bg-[#181f2b]/95 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-cyan-500/40"
                    >
                        {/* 진행 바 */}
                        <div className="w-full mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-cyan-300 tracking-wider">PROGRESS</span>
                                <span className="text-xs text-gray-400">
                                    {currentQuestion + 1} / {questions.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-cyan-500 via-blue-500 to-blue-900 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>
                        <h3 className="text-lg font-black mb-5 text-white tracking-wide shadow-inner">
                            {questions[currentQuestion].text}
                        </h3>
                        <div className="space-y-3">
                            {answers.map((answer, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(answer.value)}
                                    className={`
                    w-full py-3 rounded-xl font-bold text-base
                    transition-all duration-200 shadow-xl
                    ${idx === 0
                                            ? 'bg-cyan-500 text-white hover:bg-cyan-700'
                                            : idx === 1
                                                ? 'bg-cyan-700 text-white hover:bg-cyan-900'
                                                : idx === 2
                                                    ? 'bg-blue-700 text-white hover:bg-violet-900'
                                                    : idx === 3
                                                        ? 'bg-blue-900 text-white hover:bg-indigo-900'
                                                        : 'bg-zinc-900 text-gray-300 border border-blue-700'

                                        }
                  `}
                                >
                                    {answer.label}
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
                                    stroke="#149eca"
                                    strokeWidth={6}
                                    strokeDasharray="48 50"
                                    strokeLinecap="round"
                                    opacity={0.14}
                                />
                                <circle
                                    cx={26}
                                    cy={26}
                                    r={22}
                                    stroke="#38bdf8"
                                    strokeWidth={6}
                                    strokeDasharray="36 50"
                                    strokeLinecap="round"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        values="0 26 26;360 26 26"
                                        dur="1.35s"
                                        repeatCount="indefinite"
                                    />
                                </circle>
                            </svg>
                        </div>
                        <p className="text-lg font-black mb-2 text-gray-200 tracking-wider">
                            결과를 분석하는 중...
                        </p>
                        <p className="text-xs text-gray-500 mt-5">나의 내면, 곧 공개됩니다...</p>
                    </motion.div>
                )}

                {/* 결과 */}
                {step === 'result' && resultData && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-black text-cyan-400 mb-3 drop-shadow-lg">당신의 결과</h2>
                        <img
                            src={resultData.image}
                            alt={resultData.type}
                            className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-cyan-600/60 bg-black"
                            style={{ filter: 'drop-shadow(0 0 18px #0891b2cc)' }}
                        />
                        <div className="mb-3">
                            <span className="inline-block bg-cyan-700 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                                {resultData.type}
                            </span>
                        </div>
                        <div className="bg-zinc-900/85 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-cyan-400">
                            <div className="text-lg font-bold text-cyan-200 mb-2">{resultData.type}</div>
                            {resultData.description.map((line, i) => (
                                <div key={i} className="text-base text-gray-200 mb-1">
                                    {line}
                                </div>
                            ))}
                        </div>
                        <div className="bg-[#17223b]/90 rounded-xl shadow-inner px-5 py-4 mx-auto max-w-lg mb-6 border-l-2 border-cyan-800 text-cyan-200 text-base font-semibold">
                            {resultData.message.map((line, idx) => (
                                <span key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>
                        <button
                            onClick={restart}
                            className="bg-zinc-900 hover:bg-blue-950 text-cyan-200 py-2 px-6 rounded-xl font-bold mt-3 shadow-md"
                        >
                            다시 하기
                        </button>
                        <button
                            onClick={handleShare}
                            className="bg-gradient-to-r from-cyan-700 via-blue-700 to-blue-900 hover:from-cyan-800 hover:to-blue-900 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
                        >
                            결과 공유하기
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-emerald-800 hover:bg-emerald-900 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
                        >
                            다른 테스트 해보기
                        </button>
                        {copied && (
                            <div className="mt-2 text-sm text-green-400 animate-fade-in">URL이 복사되었습니다!</div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
