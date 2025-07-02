import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import questions from '@/tests/sociopathtest/questions';
import answers from '@/tests/sociopathtest/answers';
import resultDescriptions from '@/tests/sociopathtest/resultDescriptions';
import resultImages, { mainImage } from '@/tests/sociopathtest/resultImages';

// Firebase 연동 (문서 이름도 맞추면 좋음!)
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';

function calculateResultIdx(userAnswers) {
    const total = Object.values(userAnswers).reduce((sum, v) => sum + v, 0);
    if (total <= 5) return 0;
    if (total <= 10) return 1;
    if (total <= 15) return 2;
    if (total <= 20) return 3;
    return 4;
}

export default function SocioTest() {
    const INITIAL_COUNT = 128300;
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
                const ref = doc(db, 'testCounts', 'sociopathtest'); // ★ 여기!
                const snap = await getDoc(ref);
                if (snap.exists()) {
                    setCount(INITIAL_COUNT + (snap.data().count || 0));
                }
            } catch (e) { /* 무시 */ }
        }
        fetchCount();
    }, []);

    // 시작
    const startTest = async () => {
        try {
            const ref = doc(db, 'testCounts', 'sociopathtest'); // ★ 여기!
            await updateDoc(ref, { count: increment(1) });
        } catch (e) { /* 무시 */ }
        setStep('question');
    };

    // 결과 계산
    const handleAnswer = (value) => {
        const qid = questions[currentQuestion].id;
        setUserAnswers(prev => ({ ...prev, [qid]: value }));

        if (currentQuestion + 1 < questions.length) {
            setCurrentQuestion(currentQuestion + 1);
        } else {
            setStep('loading');
            setTimeout(() => setStep('result'), 2300 + Math.random() * 800);
        }
    };

    const restart = () => {
        setStep('intro');
        setCurrentQuestion(0);
        setUserAnswers({});
        setCopied(false);
    };

    const resultIdx = step === 'result' ? calculateResultIdx(userAnswers) : null;
    const resultDesc = resultIdx !== null ? resultDescriptions[resultIdx] : null;
    const resultImg = resultIdx !== null ? resultImages[resultIdx] : null;

    // 공유 버튼 (여기 바뀌는 곳! sociopathtest로)
    const handleShare = () => {
        if (step !== 'result' || !resultDesc) return;
        const shareUrl =
            typeof window !== 'undefined'
                ? `${window.location.origin}/sociopathtest/result/${resultIdx}` // ★ 경로!
                : '';
        if (navigator.share) {
            navigator.share({
                title: "직장 소시오패스 테스트 결과",
                text: "나는 직장에서 이런 사람이래... 너도 해봐 😈",
                url: shareUrl,
            }).catch(() => { });
        } else if (shareUrl) {
            navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-900 flex flex-col items-center justify-center px-4 py-2">
            <Head>
                <title>직장인 소시오패스 테스트 | Test 休</title>
                <meta name="description" content="나는 직장에서 천사일까, 소시오패스일까? 현실적인 13가지 질문으로 직장 내 민낯을 밝혀보세요." />
                <meta property="og:title" content="소시오패스 테스트 | Test 休" />
                <meta property="og:description" content="13문항으로 알아보는 직장인 소시오패스 진단! 익명으로 빠르게 결과 확인." />
                <meta property="og:image" content="https://test-hugh.co.kr/images/sociopathtest/main.png" />
                <meta property="og:url" content="https://test-hugh.co.kr/sociopathtest" /> {/* ★ 경로! */}
            </Head>

            <AnimatePresence mode="wait">
                {/* ...생략 (질문/로딩/결과 부분 동일)... */}

                {/* 결과 */}
                {step === 'result' && resultDesc && (
                    <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="text-center"
                    >
                        <h2 className="text-2xl font-black text-red-400 mb-3 drop-shadow-lg">당신의 결과</h2>
                        <img
                            src={resultImg}
                            alt={resultDesc.name}
                            className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-red-600/60 bg-black"
                            style={{ filter: 'drop-shadow(0 0 15px #fa2a55cc)' }}
                        />
                        <div className="mb-3">
                            <span className="inline-block bg-red-600 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                                {resultDesc.name}
                            </span>
                        </div>
                        <div className="bg-zinc-900/80 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-red-400">
                            <div className="text-lg font-bold text-red-300 mb-2">{resultDesc.name}</div>
                            <div
                                className="text-base text-gray-200"
                                dangerouslySetInnerHTML={{ __html: resultDesc.description }}
                            />
                        </div>
                        <button
                            onClick={restart}
                            className="bg-gray-900 hover:bg-gray-700 text-gray-100 py-2 px-6 rounded-xl font-bold mt-3 shadow-md"
                        >
                            다시 하기
                        </button>
                        <button
                            onClick={handleShare}
                            className="bg-gradient-to-r from-red-600 via-pink-500 to-pink-400 hover:from-red-700 hover:to-pink-600 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
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
