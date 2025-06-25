import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questions from './questions';
import results, { main } from './result';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';

// 결과 유형 산출 (E/I, N/S, P/J 각 3문항, 2개 이상 답변)
function getTravelType(userAnswers) {
  const cnt = { E: 0, I: 0, N: 0, S: 0, P: 0, J: 0 };
  questions.forEach(q => {
    const v = userAnswers[q.id];
    if (v && cnt.hasOwnProperty(v)) cnt[v]++;
  });
  const EI = cnt.E >= 2 ? 'E' : 'I';
  const NS = cnt.N >= 2 ? 'N' : 'S';
  const PJ = cnt.P >= 2 ? 'P' : 'J';
  return EI + NS + PJ; // 예: ENP, ISJ 등
}

function getResultByType(type) {
  return results.find((res) => res.id === type) || results[0];
}

function TravelTest() {
  const INITIAL_COUNT = 38740;
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCount() {
      const ref = doc(db, 'testCounts', 'travelTest');
      const snap = await getDoc(ref);
      if (snap.exists()) setCount(INITIAL_COUNT + (snap.data().count || 0));
    }
    fetchCount();
  }, []);

  const startTest = async () => {
    const ref = doc(db, 'testCounts', 'travelTest');
    await updateDoc(ref, { count: increment(1) });
    setStep('question');
  };

  const handleAnswer = (value) => {
    const qid = questions[currentQuestion].id;
    setUserAnswers((prev) => ({ ...prev, [qid]: value }));
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('loading');
      setTimeout(() => setStep('result'), 1400 + Math.random() * 800);
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
      navigator
        .share({
          title: "여행 성향 테스트 결과",
          text: "나만의 여행 성향, 너도 해봐! 🧳🌏",
          url: window.location.href,
        })
        .catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  const travelType = step === 'result' ? getTravelType(userAnswers) : null;
  const result = step === 'result' ? getResultByType(travelType) : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-200 to-blue-400 flex flex-col items-center justify-center px-4 py-2">
      <Helmet>
        <title>여행 성향 테스트 | Test 休</title>
        <meta name="description" content="9가지 질문으로 나만의 여행 스타일과 찰떡 여행지를 알아보세요!" />
        <meta property="og:title" content="여행 성향 테스트 | Test 休" />
        <meta property="og:description" content="여행지 추천, 여행 성향 분석, 여행 스타일까지 한 번에!" />
        <meta property="og:image" content="https://test-hugh.co.kr/tests/traveltest/images/main.png" />
        <meta property="og:url" content="https://test-hugh.co.kr/traveltest" />
      </Helmet>
      <AnimatePresence mode="wait">
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
              src={main}
              alt="메인"
              className="w-full max-w-lg h-[36vh] object-contain mb-3 drop-shadow-xl"
              style={{
                borderRadius: '2rem',
                boxShadow: '0 2px 32px 8px #8ac6fa55',
                background: '#e7f6ff',
              }}
            />
            <h2 className="text-3xl font-extrabold mt-2 mb-2 text-blue-700 tracking-tight drop-shadow-lg animate-bounce">
              여행 성향 테스트
            </h2>
            <p className="mb-2 text-blue-700 text-lg text-center font-medium max-w-xl shadow-inner">
              나만의 여행 스타일, 찰떡 여행지를 9문항으로 찾아보세요!
            </p>
            <p className="mb-6 text-blue-400 text-sm font-semibold">
              🔥 {count.toLocaleString()}명이 참여했어요
            </p>
            <button
              onClick={startTest}
              className="bg-gradient-to-r from-blue-600 via-blue-400 to-sky-300 hover:from-blue-700 hover:to-blue-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-2 ring-blue-300 animate-bounce-slow"
            >
              {`테스트 시작하기 🧳`}
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
            className="bg-white/95 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-blue-300"
          >
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-400 tracking-wider">
                  PROGRESS
                </span>
                <span className="text-xs text-blue-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 via-blue-300 to-sky-200 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <h3 className="text-lg font-black mb-5 text-blue-700 tracking-wide shadow-inner">
              {questions[currentQuestion].text.includes(' vs ') ? (
                <div className="flex items-center justify-center gap-2 text-base md:text-lg">
                  <span className="text-right text-blue-700 flex-1 break-keep">
                    {questions[currentQuestion].text.split(' vs ')[0]}
                  </span>
                  <span className="text-blue-500 font-extrabold px-2">vs</span>
                  <span className="text-left text-sky-400 flex-1 break-keep">
                    {questions[currentQuestion].text.split(' vs ')[1]}
                  </span>
                </div>
              ) : (
                questions[currentQuestion].text
              )}
            </h3>

            <div className="space-y-3">
              <button
                onClick={() => handleAnswer(questions[currentQuestion].a.type)}
                className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl bg-blue-500 text-white hover:bg-blue-600"
              >
                {questions[currentQuestion].a.label}
              </button>
              <button
                onClick={() => handleAnswer(questions[currentQuestion].b.type)}
                className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl bg-sky-200 text-blue-900 hover:bg-sky-300"
              >
                {questions[currentQuestion].b.label}
              </button>
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
                  stroke="#60a5fa"
                  strokeWidth={6}
                  strokeDasharray="48 50"
                  strokeLinecap="round"
                  opacity={0.14}
                />
                <circle
                  cx={26}
                  cy={26}
                  r={22}
                  stroke="#2563eb"
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
            <p className="text-lg font-black mb-2 text-blue-500 tracking-wider animate-pulse">
              여행 성향 분석 중...
            </p>
            <p className="text-xs text-blue-400 mt-5">
              잠시만 기다려주세요!
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
            <h2 className="text-2xl font-black text-blue-400 mb-3 drop-shadow-lg animate-bounce">
              🎉 나의 여행 유형 🎉
            </h2>
            <img
              src={result.image}
              alt={result.name}
              className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-blue-300 bg-white"
              style={{ filter: 'drop-shadow(0 0 18px #5ac8ffbb)' }}
            />
            <div className="mb-3">
              <span className="inline-block bg-blue-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                {result.name}
              </span>
            </div>
            <div className="bg-white/95 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-blue-300">
              <div className="text-lg font-bold text-blue-500 mb-2">
                {result.name}
              </div>
              <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
            </div>
            <button
              onClick={restart}
              className="bg-white hover:bg-blue-100 text-blue-400 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-blue-200"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-400 via-blue-300 to-sky-200 hover:from-blue-500 hover:to-blue-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              결과 공유하기
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
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

export default TravelTest;
