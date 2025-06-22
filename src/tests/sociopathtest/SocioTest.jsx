import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questions from './questions';
import answers from './answers';
import resultDescriptions from './resultDescriptions';
import resultImages, { mainImage } from './resultImages';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// 점수 계산 함수
const calculateResultIdx = (userAnswers) => {
    const total = Object.values(userAnswers).reduce((sum, v) => sum + v, 0);
    if (total <= 5) return 0;
    if (total <= 10) return 1;
    if (total <= 15) return 2;
    if (total <= 19) return 3;
    return 4;
};

function SocioTest() {
    <Helmet>
        <title>직장인 소시오패스 테스트 | Test 休</title>
        <meta name="description" content="나는 직장에서 천사일까, 소시오패스일까? 현실적인 13가지 질문으로 직장 내 민낯을 밝혀보세요." />
        <meta property="og:title" content="직장인 소시오패스 테스트 | Test 休" />
        <meta property="og:description" content="13문항으로 알아보는 직장인 소시오패스 진단! 익명으로 빠르게 결과 확인." />
        <meta property="og:image" content="https://test-hugh.co.kr/tests/sociopathtest/images/main.png" />
        <meta property="og:url" content="https://test-hugh.co.kr/sociopathtest" />
    </Helmet>
    const [step, setStep] = useState('intro');
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [userAnswers, setUserAnswers] = useState({});
    const [copied, setCopied] = useState(false);
    const navigate = useNavigate();


    const startTest = () => setStep('question');

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

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: "직장 소시오패스 테스트 결과",
                text: "나는 직장에서 이런 사람이래... 너도 해봐 😈",
                url: window.location.href
            }).catch(() => { });
        } else {
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
    };

    const resultIdx = step === 'result' ? calculateResultIdx(userAnswers) : null;
    const resultDesc = resultIdx !== null ? resultDescriptions[resultIdx] : null;
    const resultImg = resultIdx !== null ? resultImages[resultIdx] : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-zinc-900 flex flex-col items-center justify-center px-4 py-2">
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
                                boxShadow: '0 2px 30px 8px rgba(0,0,0,0.28)',
                                background: '#23272b'
                            }}
                        />
                        <h2 className="text-3xl font-black mt-2 mb-2 text-red-400 tracking-tight drop-shadow-lg">
                            직장 소시오패스 테스트
                        </h2>
                        <p className="mb-8 text-gray-200 text-lg text-center font-medium max-w-xl shadow-inner">
                            회사에서 나는 진짜 천사일까, 혹시 소시오패스...? <br />
                            13가지 현실적인 질문으로 직장 내 민낯을 밝혀보세요.
                        </p>
                        <button
                            onClick={startTest}
                            className="bg-gradient-to-r from-red-800 via-red-500 to-pink-500 hover:from-red-700 hover:to-pink-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-1 ring-black/20 animate-bounce-slow"
                        >
                            {`테스트 시작하기 😈`}
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
                        transition={{ duration: 0.34, ease: 'easeOut' }}
                        className="bg-zinc-950/90 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-red-500/60"
                    >
                        {/* 진행 바 */}
                        <div className="w-full mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs font-semibold text-red-400 tracking-wider">PROGRESS</span>
                                <span className="text-xs text-gray-400">{currentQuestion + 1} / {questions.length}</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2.5">
                                <div
                                    className="bg-gradient-to-r from-red-600 via-red-400 to-pink-400 h-2.5 rounded-full transition-all duration-500"
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
                    w-full py-3 rounded-xl font-bold text-lg 
                    transition-all duration-200 shadow-xl
                    ${idx === 0
                                            ? 'bg-red-600 text-white hover:bg-red-700'
                                            : idx === 1
                                                ? 'bg-gray-700 text-white hover:bg-gray-800'
                                                : 'bg-gray-900 text-gray-300 border border-gray-600'}
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
                                    stroke="#d90429"
                                    strokeWidth={6}
                                    strokeDasharray="48 50"
                                    strokeLinecap="round"
                                    opacity={0.16}
                                />
                                <circle
                                    cx={26}
                                    cy={26}
                                    r={22}
                                    stroke="#ff4d6d"
                                    strokeWidth={6}
                                    strokeDasharray="36 50"
                                    strokeLinecap="round"
                                >
                                    <animateTransform attributeName="transform" type="rotate" values="0 26 26;360 26 26" dur="1.3s" repeatCount="indefinite" />
                                </circle>
                            </svg>
                        </div>
                        <p className="text-lg font-black mb-2 text-gray-200 tracking-wider">결과를 분석하는 중...</p>
                        <p className="text-xs text-gray-500 mt-5">회사 민낯, 금방 공개됩니다...</p>
                    </motion.div>
                )}

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
                            <div className="text-base text-gray-200">{resultDesc.description}</div>
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
                            공유하기
                        </button>
                        <button
                            onClick={() => navigate('/')}
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

export default SocioTest;
