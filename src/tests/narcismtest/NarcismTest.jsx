// /tests/narcismtest/NarcismTest.jsx
import { useState, useEffect, useMemo } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

// ▼ 프로젝트 구조에 맞게 조정
import questions from '@/tests/narcismtest/questions'; // [{ id, text, scale: 'G'|'V'|'A'|'H'|'E', reversed?: boolean }]
import answers from '@/tests/narcismtest/answers';   // [{ label, value(1..5) } x 5]
import results, { mainImage } from '@/tests/narcismtest/result'; // [{ id:'star'|'approval'|'hidden'|'fragile'|'healthy', type, image, description:[], message:[] }]
import meta from '@/tests/narcismtest/meta';

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

if (typeof window !== 'undefined') {
    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
}

const Bar = dynamic(() => import('react-chartjs-2').then((m) => m.Bar), { ssr: false });

// 공유 URL 유틸
const getSiteOrigin = () => {
    const env = process.env.NEXT_PUBLIC_SITE_URL;
    if (env) return env.replace(/\/$/, '');
    if (typeof window !== 'undefined') {
        const { origin, hostname } = window.location;
        const isLocal = hostname === 'localhost' || hostname === '127.0.0.1';
        if (isLocal) return origin;
        return origin.startsWith('http://') ? origin.replace('http://', 'https://') : origin;
    }
    return 'https://test-hugh.co.kr';
};

/**
 * ──────────────────────────────────────────────────────────────────────────────
 *  채점 알고리즘 (5축: G/V/A/H/E)
 *  - Likert(1..5) → center(x) = x-3 → -2..+2
 *  - 역문항은 부호 반전
 *  - 축별 합계(-2n..+2n)를 POMP = (sum + 2n)/(4n) 로 0..1 정규화 (문항 수 자동 인식)
 * ──────────────────────────────────────────────────────────────────────────────
 */

const center = (x) => (x - 3);

function computeScoresPOMP(answersById, qs) {
    const sums = { G: 0, V: 0, A: 0, H: 0, E: 0 };
    const counts = { G: 0, V: 0, A: 0, H: 0, E: 0 };

    for (const q of qs) {
        const scale = q.scale;
        if (!sums.hasOwnProperty(scale)) continue; // 알 수 없는 스케일 방어
        const raw = Number(answersById[q.id] ?? 3); // 무응답은 중립
        let s = center(raw);
        if (q.reversed) s = -s;
        sums[scale] += s;
        counts[scale] += 1;
    }

    const pomp = {};
    ['G', 'V', 'A', 'H', 'E'].forEach((k) => {
        const n = counts[k];
        if (n > 0) {
            pomp[k] = (sums[k] + 2 * n) / (4 * n);
        } else {
            pomp[k] = 0;
        }
    });

    return { pomp, sums, counts };
}

function computeIndices(pomp) {
    const { G, V, A, H, E } = pomp;
    const STAR = Math.sqrt(G * A);                                 // 우월·통제 + 인정의존 시너지
    const APPROVAL = A * (1 - 0.3 * H);                            // 인정의존, 자존이 높을수록 일부 완충
    const HIDDEN = G * (1 - 0.5 * A) * (1 - 0.5 * V);              // 우월·통제 높고 과시는 낮으며 상처민감 낮음
    const FRAGILE = V * (0.5 + 0.5 * A) * (1 - 0.3 * H);           // 상처민감 중심, 인정이 있으면 증폭, 자존은 완충
    const HEALTHY = H * (1 - Math.max(G, A, V)) * (0.5 + 0.5 * E); // 자존↑, 타 축↓, 공감↑일수록 강화
    return { STAR, APPROVAL, HIDDEN, FRAGILE, HEALTHY };
}

function decideType(pomp, indices) {
    const { G, A, H, E } = pomp;
    const entries = Object.entries(indices); // [key, val]

    // 1) 건강형 강한 규칙: H·E 높고 G 낮으면 바로 healthy
    if (H >= 0.60 && (E ?? 0) >= 0.60 && G <= 0.45) {
        return 'healthy';
    }

    // 2) 스타 가드: G·A 높고 E 낮으면 star 우선 고려
    if (G >= 0.65 && A >= 0.55 && (E ?? 0) <= 0.50) {
        const [maxKey] = entries.reduce((m, kv) => (kv[1] > m[1] ? kv : m), ['STAR', -Infinity]);
        if (maxKey === 'STAR') return 'star';
    }

    // 3) 일반 최대값
    const sorted = entries.sort((a, b) => b[1] - a[1]);
    const [topKey, topVal] = sorted[0];

    // 4) 전체 신호 약하면 healthy
    if (topVal < 0.45) return 'healthy';

    // 5) 동점 처리(Δ<0.05) → 우선순위
    const secondVal = sorted[1]?.[1] ?? -1;
    const tie = Math.abs(topVal - secondVal) < 0.05;
    if (tie) {
        const priority = ['STAR', 'FRAGILE', 'HIDDEN', 'APPROVAL', 'HEALTHY'];
        const two = [sorted[0][0], sorted[1][0]].sort((a, b) => priority.indexOf(a) - priority.indexOf(b));
        return two[0].toLowerCase();
    }

    return topKey.toLowerCase(); // 'star'|'approval'|'hidden'|'fragile'|'healthy'
}

const NarcismTest = () => {
    const INITIAL_COUNT = 52000;
    const [step, setStep] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({}); // { [id]: 1..5 }
    const [count, setCount] = useState(INITIAL_COUNT);
    const [copied, setCopied] = useState(false);
    const router = useRouter();

    // 참여자 수 불러오기
    useEffect(() => {
        async function fetchCount() {
            const ref = doc(db, 'testCounts', 'narcismTest');
            const snap = await getDoc(ref);
            if (snap.exists()) {
                setCount(INITIAL_COUNT + (snap.data().count || 0));
            } else {
                await setDoc(ref, { count: 0 }, { merge: true });
                setCount(INITIAL_COUNT);
            }
        }
        fetchCount();
    }, []);

    // 시작
    const startTest = async () => {
        const ref = doc(db, 'testCounts', 'narcismTest');
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

    // 점수 계산
    const { pomp, resultId } = useMemo(() => {
        const { pomp } = computeScoresPOMP(userAnswers, questions);
        const indices = computeIndices(pomp);
        const resultId = decideType(pomp, indices);
        return { pomp, resultId };
    }, [userAnswers]);

    // 결과 매칭
    const resultIdx = useMemo(() => results.findIndex((r) => r.id === resultId), [resultId]);
    const resultData = step === 'result' && resultIdx >= 0 ? results[resultIdx] : null;

    // 그래프(5축)
    const scaleLabels = ['우월·통제(G)', '상처민감(V)', '인정의존(A)', '차분자존(H)', '공감·존중(E)'];
    const scaleValues = [pomp.G, pomp.V, pomp.A, pomp.H, pomp.E].map((v) => Math.round((v ?? 0) * 100));
    const barColors = ['#34D399', '#10B981', '#059669', '#6EE7B7', '#2DD4BF']; // 다크테마용 그린/티얼 팔레트

    const chartData = {
        labels: scaleLabels,
        datasets: [
            {
                label: '비율(%)',
                data: scaleValues,
                backgroundColor: barColors,
                borderColor: barColors,
                borderWidth: 1,
            },
        ],
    };

    // 결과 공유(v:2, 5축 포함)
    const handleShare = () => {
        if (step !== 'result' || !resultData) return;

        const payload = {
            v: 2,
            scales: {
                G: Math.round((pomp.G ?? 0) * 100),
                V: Math.round((pomp.V ?? 0) * 100),
                A: Math.round((pomp.A ?? 0) * 100),
                H: Math.round((pomp.H ?? 0) * 100),
                E: Math.round((pomp.E ?? 0) * 100),
            },
            result: resultId,
        };

        const json = JSON.stringify(payload);
        const base64 = typeof window !== 'undefined' ? btoa(unescape(encodeURIComponent(json))) : '';
        const s = encodeURIComponent(base64);
        const shareUrl = `${getSiteOrigin()}/narcismtest/result/${resultData.id}?s=${s}`;

        if (navigator.share) {
            navigator
                .share({
                    title: '나르시스트 성향 테스트 결과',
                    text: '내 자기애 성향을 확인해보세요!',
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
        <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0f0c] to-[#0b1a12] flex flex-col items-center justify-center px-4 py-2">
            <Head>
                <title>{meta.title}</title>
                <meta name="description" content={meta.description} />
                <meta property="og:title" content={meta.title} />
                <meta property="og:description" content={meta.description} />
                <meta property="og:image" content={meta.image} />
                <meta property="og:url" content="https://test-hugh.co.kr/narcismtest" />
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
                            className="w-full max-w-lg h-[36vh] mb-4 relative"
                            style={{
                                borderRadius: '2rem',
                                boxShadow: '0 10px 40px -10px rgba(16, 185, 129, 0.45)',
                                background: 'linear-gradient(135deg, rgba(16,185,129,0.08), rgba(4,120,87,0.08))',
                                border: '1px solid rgba(16,185,129,0.25)',
                            }}
                        >
                            <Image
                                src={mainImage}
                                alt="메인"
                                fill
                                sizes="(max-width: 768px) 90vw, 512px"
                                className="object-contain rounded-[2rem]"
                                priority
                            />
                        </div>

                        <h2 className="text-3xl font-extrabold mt-2 mb-2 text-emerald-300 tracking-tight drop-shadow">
                            나르시스트 성향 테스트 ✨
                        </h2>

                        <p className="mb-4 text-lg text-center max-w-xl font-medium text-emerald-300/90">
                            나는 어떤 유형일까? 🌟🕶️👍🌧️🌿<br />
                            20문항으로 <span className="font-semibold">과시형·은밀형 나르시스트·칭찬의존형·예민 민감형·건강한 자존감형</span> 중
                            어디에 가까운지 가볍게 체크해보세요!
                            <span className="block mt-1 text-emerald-400/70 text-sm">※ 재미로 보는 심리 테스트이며, 임상 진단이 아닙니다.</span>
                        </p>

                        <p className="mb-6 text-emerald-400/80 text-sm font-semibold">
                            🧩 {count.toLocaleString()}명이 참여했어요
                        </p>

                        <button
                            onClick={startTest}
                            className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-1 ring-emerald-400/40"
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
                        className="bg-[#0d1411]/80 backdrop-blur-sm shadow-xl rounded-3xl p-7 w-full max-w-md text-center border-[1.5px] border-emerald-700/60"
                    >
                        {/* Progress */}
                        <div className="w-full mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[11px] font-semibold tracking-wider text-emerald-400/80">
                                    PROGRESS
                                </span>
                                <span className="text-[11px] text-zinc-400">
                                    {currentQuestion + 1} / {questions.length}
                                </span>
                            </div>
                            <div className="w-full bg-zinc-800 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                                />
                            </div>
                        </div>

                        {/* Question */}
                        <h3 className="text-lg font-bold mb-5 text-zinc-100 tracking-wide">
                            {questions[currentQuestion].text}
                        </h3>

                        {/* Answers */}
                        <div className="space-y-3">
                            {answers.map((answer, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(answer.value)}
                                    className={`w-full py-3 rounded-xl font-semibold text-base md:text-lg shadow-xl transition-all duration-200 ${idx === 0
                                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                            : idx === 1
                                                ? 'bg-teal-600 text-white hover:bg-teal-500'
                                                : idx === 2
                                                    ? 'bg-zinc-800 text-emerald-100 hover:bg-zinc-700'
                                                    : idx === 3
                                                        ? 'bg-lime-600 text-white hover:bg-lime-500'
                                                        : 'bg-cyan-600 text-white hover:bg-cyan-500'
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
                                    stroke="#064e3b"
                                    strokeWidth={6}
                                    strokeDasharray="48 50"
                                    strokeLinecap="round"
                                    opacity={0.18}
                                />
                                <circle
                                    cx={26}
                                    cy={26}
                                    r={22}
                                    stroke="#10b981"
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

                        <p className="text-lg font-black mb-2 text-emerald-300 tracking-wider animate-pulse">
                            자기애 성향 분석 중...
                        </p>

                        <div className="w-64 h-3 bg-zinc-800 rounded-full overflow-hidden mt-4">
                            <motion.div
                                className="h-full bg-emerald-500"
                                initial={{ width: '0%' }}
                                animate={{ width: '100%' }}
                                transition={{ duration: 2, repeat: Infinity, repeatType: 'loop' }}
                            />
                        </div>

                        <p className="text-xs text-emerald-400/80 mt-5">곧 당신의 결과가 공개됩니다!</p>
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
                        <h2 className="text-2xl font-black text-emerald-300 mb-3 drop-shadow">
                            당신의 자기애 성향 결과
                        </h2>

                        <div
                            className="mx-auto mb-7 rounded-2xl shadow-xl bg-black w-44 h-44 relative overflow-hidden"
                            style={{
                                border: '2px solid rgba(16,185,129,0.5)',
                                boxShadow: '0 10px 40px -10px rgba(16, 185, 129, 0.45)',
                            }}
                        >
                            <Image
                                src={resultData.image}
                                alt={resultData.type}
                                fill
                                sizes="176px"
                                className="object-cover"
                            />
                        </div>

                        {/* 결과 배지 */}
                        <div className="mb-3">
                            <span className="inline-block bg-emerald-700 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
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
                                        legend: {
                                            position: 'top',
                                            labels: { color: '#d1fae5' }, // emerald-100
                                        },
                                        title: {
                                            display: false,
                                        },
                                        tooltip: {
                                            titleColor: '#111827', // gray-900
                                            bodyColor: '#111827',
                                            backgroundColor: '#d1fae5',
                                            borderColor: '#10b981',
                                            borderWidth: 1,
                                        },
                                    },
                                    scales: {
                                        x: {
                                            ticks: { color: '#e5e7eb', font: { weight: '600' } }, // gray-200
                                            grid: { color: 'rgba(55,65,81,0.35)' }, // gray-700
                                        },
                                        y: {
                                            beginAtZero: true,
                                            max: 100,
                                            grace: '10%',
                                            ticks: { color: '#e5e7eb' },
                                            grid: { color: 'rgba(55,65,81,0.35)' },
                                        },
                                    },
                                }}
                            />
                        </div>

                        {/* 상세 설명 */}
                        <div className="bg-[#0b1a12]/80 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-emerald-500">
                            <div className="text-lg font-bold text-emerald-200 mb-2">{resultData.type}</div>
                            {Array.isArray(resultData.description) &&
                                resultData.description.map((line, i) => (
                                    <div key={i} className="text-base text-emerald-100/90 mb-1">
                                        {line}
                                    </div>
                                ))}
                        </div>

                        {Array.isArray(resultData.message) && resultData.message.length > 0 && (
                            <div className="bg-[#0f1f17]/90 rounded-xl shadow-inner px-5 py-4 mx-auto max-w-lg mb-6 border-l-2 border-emerald-700 text-emerald-100 text-base font-semibold">
                                {resultData.message.map((line, idx) => (
                                    <span key={idx}>
                                        {line}
                                        <br />
                                    </span>
                                ))}
                            </div>
                        )}

                        <div className="flex flex-wrap gap-3 justify-center">
                            <button
                                onClick={restart}
                                className="bg-emerald-700 hover:bg-emerald-800 text-white py-2 px-6 rounded-xl font-bold shadow-md"
                            >
                                다시 하기
                            </button>
                            <button
                                onClick={handleShare}
                                className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-900 hover:from-emerald-800 hover:to-emerald-800 text-white py-2 px-6 rounded-xl font-bold shadow-md"
                            >
                                결과 공유하기
                            </button>
                            <button
                                onClick={() => router.push('/')}
                                className="border border-emerald-600/70 text-emerald-200 hover:bg-emerald-600/10 py-2 px-6 rounded-xl font-bold shadow-md transition-all duration-200"
                            >
                                다른 테스트 해보기
                            </button>
                        </div>

                        {copied && (
                            <div className="mt-2 text-sm text-emerald-400 animate-fade-in">
                                URL이 복사되었습니다!
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NarcismTest;
