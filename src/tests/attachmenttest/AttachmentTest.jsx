import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

import questions from '@/tests/attachmenttest/questions';
import answers from '@/tests/attachmenttest/answers';
import results, { mainImage } from '@/tests/attachmenttest/result';
import meta from '@/tests/attachmenttest/meta';

import { db } from '@/firebase';
import { doc, getDoc, updateDoc, increment, setDoc } from 'firebase/firestore';

import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale,
} from 'chart.js';

// ✅ Chart.js는 클라이언트에서만 등록 (SSR 충돌 방지)
if (typeof window !== 'undefined') {
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
}

// ✅ Bar 컴포넌트는 CSR 전용으로 로드
const Bar = dynamic(() => import('react-chartjs-2').then((m) => m.Bar), { ssr: false });

// 파일 상단에 유틸 함수 업데이트
const getSiteOrigin = () => {
    const env = process.env.NEXT_PUBLIC_SITE_URL;
    if (env) return env.replace(/\/$/, '');

    if (typeof window !== 'undefined') {
        const { origin, hostname } = window.location;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
        // 로컬은 http 그대로, 그 외는 https 강제
        if (isLocal) return origin;
        return origin.startsWith('http://') ? origin.replace('http://', 'https://') : origin;
    }
    return 'https://test-hugh.co.kr';
};


const AttachmentTest = () => {
    const INITIAL_COUNT = 52000;
    const [step, setStep] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [count, setCount] = useState(INITIAL_COUNT);
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    // 참여자 수 불러오기 (문서 없으면 생성)
    useEffect(() => {
        async function fetchCount() {
            const ref = doc(db, 'testCounts', 'attachmentTest');
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setCount(INITIAL_COUNT + (snap.data().count || 0));
            } else {
                // 문서가 없으면 0으로 초기화
                await setDoc(ref, { count: 0 }, { merge: true });
                setCount(INITIAL_COUNT);
            }
        }
        fetchCount();
    }, []);

    // 시작 시 참여 카운트 증가
    const startTest = async () => {
        const ref = doc(db, 'testCounts', 'attachmentTest');
        // 혹시 문서가 없으면 만들어두기
        await setDoc(ref, { count: increment(0) }, { merge: true });
        await updateDoc(ref, { count: increment(1) });
        setStep('question');
    };

    // 답변 처리
    const handleAnswer = (value) => {
        const q = questions[currentQuestion];
        if (!q) return;

        setUserAnswers((prev) => ({ ...prev, [q.id]: value }));

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion((v) => v + 1);
        } else {
            setStep('loading');
            setTimeout(() => setStep('result'), 2100 + Math.random() * 900);
        }
    };

    // ✅ 결과 계산: 질문 배열을 기준으로 id 매칭 (index 의존 X)
    const resultMap = useMemo(() => {
        const map = {
            secure: 0,
            avoidant: 0,
            anxious: 0,
            disorganized: 0,
        };
        for (const q of questions) {
            const val = Number(userAnswers[q.id] ?? 0);
            if (q.type && map[q.type] !== undefined) {
                map[q.type] += val;
            }
        }
        return map;
    }, [userAnswers]);

    // 최고 점수 타입으로 결과 index 추출
    const resultIdx = useMemo(() => {
        const entries = Object.entries(resultMap);
        const highest = Math.max(...entries.map(([, v]) => v));
        const highestKey = entries.find(([, v]) => v === highest)?.[0] ?? 'secure';
        return results.findIndex((r) => r.id === highestKey);
    }, [resultMap]);

    const resultData = step === 'result' && resultIdx >= 0 ? results[resultIdx] : null;

    // 그래프 데이터 구성 (최소값 보정해서 차이만 강조)
    const resultValues = Object.values(resultMap);
    const minScore = Math.min(...resultValues);
    const adjustedScores = resultValues.map((v) => v - minScore + 1);

    const barColors = ['#FFB6C1', '#FFFACD', '#F0E68C', '#E6E6FA']; // 연핑크/연노랑/카키/연보라

    const chartData = {
        labels: ['안정', '회피', '불안', '혼란'],
        datasets: [
            {
                label: '비율',
                data: adjustedScores,
                backgroundColor: barColors,
                borderColor: barColors,
                borderWidth: 1,
            },
        ],
    };

    // AttachmentTest 컴포넌트 내부의 handleShare를 아래로 교체
    const handleShare = () => {
        if (step !== 'result' || !resultData) return;

        // 공유할 페이로드(최소 정보)
        const payload = {
            v: 1,
            scores: resultMap, // { secure, avoidant, anxious, disorganized }
            // 필요시 추가 필드 가능: total: questions.length, t: Date.now() 등
        };

        // URL-safe base64 인코딩 (브라우저 전용)
        const json = JSON.stringify(payload);
        const base64 =
            typeof window !== 'undefined'
                ? btoa(unescape(encodeURIComponent(json)))
                : ''; // SSR에서는 사용 안됨
        const s = encodeURIComponent(base64);

        // 결과 타입별 상세 페이지 + s 파라미터
        // handleShare 내부에서 shareUrl 생성 부분만 교체
        const shareUrl = `${getSiteOrigin()}/attachmenttest/result/${resultData.id}?s=${s}`;

        if (navigator.share) {
            navigator
                .share({
                    title: '애착 스타일 테스트 결과',
                    text: '내 애착 스타일을 확인해보세요!',
                    url: shareUrl,
                })
                .catch(() => { });
        } else {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        }
    };


    const restart = () => {
        setStep('intro');
        setCurrentQuestion(0);
        setUserAnswers({});
        setCopied(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F7E1E1] via-[#F7D7C4] to-[#F5F5DC] flex flex-col items-center justify-center px-4 py-2">
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.image} />
                <meta property="og:url" content="https://test-hugh.co.kr/attachmenttest" />
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
                        {/* 메인 이미지 */}
                        <div
                            className="w-full max-w-lg h-[36vh] mb-4 drop-shadow-2xl relative"
                            style={{
                                borderRadius: '2rem',
                                boxShadow: '0 2px 32px 8px rgba(255, 92, 112, 0.7)',
                                background: '#ffeff1',
                            }}
                        >
                            <Image
                                src={mainImage} // 문자열 경로 그대로 사용 (/public 기준)
                                alt="메인"
                                fill
                                sizes="(max-width: 768px) 90vw, 512px"
                                className="object-contain rounded-[2rem]"
                                priority
                            />
                        </div>

                        <h2 className="text-3xl font-extrabold mt-2 mb-2 text-pink-500 tracking-tight drop-shadow-lg animate-bounce">
                            애착 유형 테스트 💖
                        </h2>

                        <p className="mb-4 text-lg text-center max-w-xl font-medium text-pink-600">
                            안정형 / 회피형 / 불안형 / 혼란형 나의 애착 스타일을 확인하고, 사람들과의 관계에서 나타나는 패턴을 알아보세요! 💭<br />
                            관계에서 내가 어떤 감정적 반응을 보이는지, 나와 타인 사이의 연결 방식을 이해할 수 있어요. 🤝<br />
                            🧠 더 건강한 관계를 위해 무엇을 개선할 수 있을지 확인해 보세요! 🌱
                        </p>

                        <p className="mb-6 text-pink-300 text-sm font-semibold">
                            🧩 {count.toLocaleString()}명이 참여했어요
                        </p>

                        <button
                            onClick={startTest}
                            className="bg-gradient-to-r from-pink-500 via-pink-300 to-pink-100 hover:from-pink-600 hover:to-pink-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-1 ring-black/20 animate-bounce-slow"
                        >
                            테스트 시작하기 🚦
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
                        className="bg-gradient-to-r from-pink-100 via-yellow-100 to-ivory-100 shadow-xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-pink-400"
                    >
                        {/* Progress */}
                        <div className="w-full mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-cyan-300 tracking-wider">PROGRESS</span>
                                <span className="text-xs text-gray-400">
                                    {currentQuestion + 1} / {questions.length}
                                </span>
                            </div>
                            <div className="w-full bg-gray-300 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-pink-500 to-pink-700 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <h3 className="text-lg font-bold mb-5 text-gray-800 tracking-wide shadow-inner">
                            {questions[currentQuestion].text}
                        </h3>

                        {/* Answers */}
                        <div className="space-y-4">
                            {answers.map((answer, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(answer.value)}
                                    className={`w-full py-3 rounded-xl font-semibold text-lg shadow-xl transition-all duration-200 ${idx === 0
                                        ? 'bg-pink-300 text-white hover:bg-pink-400'
                                        : idx === 1
                                            ? 'bg-yellow-300 text-white hover:bg-yellow-400'
                                            : idx === 2
                                                ? 'bg-ivory-300 text-black hover:bg-ivory-400'
                                                : idx === 3
                                                    ? 'bg-green-300 text-white hover:bg-green-400'
                                                    : 'bg-blue-300 text-white hover:bg-blue-400'
                                        }`}
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
                        {/* 로딩 스피너 */}
                        <div className="animate-spin mb-6 mt-9">
                            <svg width={64} height={64} viewBox="0 0 52 52" fill="none">
                                <circle
                                    cx={26}
                                    cy={26}
                                    r={22}
                                    stroke="#e4b1f0" // 연보라
                                    strokeWidth={6}
                                    strokeDasharray="48 50"
                                    strokeLinecap="round"
                                    opacity={0.16}
                                />
                                <circle
                                    cx={26}
                                    cy={26}
                                    r={22}
                                    stroke="#a566ff" // 진보라
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

                        {/* 텍스트 */}
                        <p className="text-lg font-black mb-2 text-purple-500 tracking-wider animate-pulse">
                            애착 유형 분석 중...
                        </p>

                        {/* 로딩바 */}
                        <div className="w-64 h-3 bg-purple-200 rounded-full overflow-hidden mt-4">
                            <motion.div
                                className="h-full bg-purple-500"
                                initial={{ width: "0%" }}
                                animate={{ width: "100%" }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                            />
                        </div>

                        {/* 하단 설명 */}
                        <p className="text-xs text-purple-400 mt-5">
                            곧 당신의 결과가 공개됩니다!
                        </p>
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
                        <h2 className="text-2xl font-black text-pink-400 mb-3 drop-shadow-lg">
                            당신의 애착 유형 결과
                        </h2>

                        <div className="mx-auto mb-7 rounded-2xl shadow-xl border-4 border-pink-600/60 bg-black w-44 h-44 relative overflow-hidden">
                            <Image
                                src={resultData.image} // 문자열 경로 그대로 사용 (public/)
                                alt={resultData.type}
                                fill
                                sizes="176px"
                                className="object-cover"
                            />
                        </div>

                        {/* 결과 배지 */}
                        <div className="mb-3">
                            <span className="inline-block bg-pink-700 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                                {resultData.type}
                            </span>
                        </div>

                        {/* 그래프 */}
                        <div className="w-full max-w-lg mx-auto mb-6">
                            <Bar
                                data={chartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                    },
                                    scales: {
                                        x: { ticks: { font: { weight: '600' } } },
                                        y: {
                                            beginAtZero: true,
                                            grace: '10%',
                                        },
                                    },
                                }}
                            />
                        </div>

                        {/* 상세 설명 */}
                        <div className="bg-zinc-900/85 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-pink-400">
                            <div className="text-lg font-bold text-pink-200 mb-2">{resultData.type}</div>
                            {resultData.description.map((line, i) => (
                                <div key={i} className="text-base text-gray-200 mb-1">
                                    {line}
                                </div>
                            ))}
                        </div>

                        <div className="bg-[#17223b]/90 rounded-xl shadow-inner px-5 py-4 mx-auto max-w-lg mb-6 border-l-2 border-pink-800 text-pink-200 text-base font-semibold">
                            {resultData.message.map((line, idx) => (
                                <span key={idx}>
                                    {line}
                                    <br />
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={restart}
                            className="bg-pink-700 hover:bg-pink-900 text-white py-2 px-6 rounded-xl font-bold mt-3 shadow-md"
                        >
                            다시 하기
                        </button>
                        <button
                            onClick={handleShare}
                            className="bg-gradient-to-r from-pink-700 via-blue-700 to-pink-900 hover:from-pink-800 hover:to-blue-800 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
                        >
                            결과 공유하기
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="bg-gradient-to-r from-pink-400 via-pink-300 to-yellow-300 hover:from-pink-500 hover:via-pink-400 hover:to-yellow-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md transition-all duration-200"
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
};

export default AttachmentTest;
