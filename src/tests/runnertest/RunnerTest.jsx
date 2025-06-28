import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questions from './questions';
import results, { main } from './result';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '../../firebase';

function getRunnerType(userAnswers) {
  const cnt = { E: 0, I: 0, N: 0, S: 0, P: 0, J: 0 };
  questions.forEach(q => {
    const v = userAnswers[q.id];
    if (v && cnt.hasOwnProperty(v)) cnt[v]++;
  });
  const EI = cnt.E >= cnt.I ? 'E' : 'I';
  const NS = cnt.N > cnt.S ? 'N' : 'S';
  const PJ = cnt.P > cnt.J ? 'P' : 'J';
  return EI + NS + PJ;
}

function getResultByType(type) {
  return results.find((res) => res.id === type) || results[0];
}

function RunnerTest() {
  const INITIAL_COUNT = 51324;
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCount() {
      const ref = doc(db, 'testCounts', 'runnerTest');
      const snap = await getDoc(ref);
      if (snap.exists()) setCount(INITIAL_COUNT + (snap.data().count || 0));
    }
    fetchCount();
  }, []);

  const startTest = async () => {
    const ref = doc(db, 'testCounts', 'runnerTest');
    await updateDoc(ref, { count: increment(1) });
    setStep('question');
  };

  const handleAnswer = (value) => {
    const qid = questions[currentQuestion].id;
    setUserAnswers((prev) => ({ ...prev, [qid]: value }));
    // 마지막 문제에서 넘기면 step='loading'
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('loading');
      setTimeout(() => setStep('result'), 1200 + Math.random() * 900);
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setUserAnswers({});
    setCopied(false);
  };

  const handleShare = () => {
    const type = getRunnerType(userAnswers);
    const url = `${window.location.origin}/runnertest/result/${type}`;
    if (navigator.share) {
      navigator.share({
        title: "러너 성향 테스트 결과",
        text: "나의 러닝 스타일, 너도 해봐! 🏃",
        url,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  const runnerType = step === 'result' ? getRunnerType(userAnswers) : null;
  const result = step === 'result' ? getResultByType(runnerType) : null;
  const best = result && getResultByType(result.bestMatch);
  const worst = result && getResultByType(result.worstMatch);

  // progress 계산 정확히!
  const progress = step === 'question'
    ? ((currentQuestion) / questions.length) * 100
    : step === 'result'
    ? 100
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-orange-100 via-40% to-purple-200 flex flex-col items-center justify-center px-4 py-2 overflow-x-hidden">
      <Helmet>
        <title>러너 성향 테스트 | Test 休</title>
        <meta name="description" content="12문항으로 알아보는 나의 러닝 성향!" />
        <meta property="og:title" content="러너 성향 테스트 | Test 休" />
        <meta property="og:description" content="흥러너, 루틴러너, 자유러너 등 당신의 러너 유형은? 지금 바로 테스트!" />
        <meta property="og:image" content="https://test-hugh.co.kr/tests/runnertest/images/main.png" />
        <meta property="og:url" content="https://test-hugh.co.kr/runnertest" />
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
              className="w-full max-w-lg h-[36vh] object-contain mb-3 drop-shadow-xl rounded-[2rem] bg-white"
              style={{ boxShadow: '0 2px 32px 8px #fc68b3cc' }}
            />
            <h2 className="text-3xl font-extrabold mt-2 mb-2 text-transparent bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 bg-clip-text tracking-tight drop-shadow-lg animate-bounce">
              러너 성향 테스트
            </h2>
            <p className="mb-2 text-pink-500 text-lg text-center font-medium max-w-xl shadow-inner">
              당신의 러닝 스타일, 12문항으로 바로 체크!
            </p>
            <p className="mb-6 text-orange-400 text-sm font-semibold">
              🏃‍♀️ {count.toLocaleString()}명이 참여했어요
            </p>
            <button
              onClick={startTest}
              className="bg-gradient-to-r from-pink-500 via-orange-400 to-purple-400 hover:from-pink-600 hover:to-purple-500 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-2 ring-pink-200 animate-bounce-slow"
            >
              {`테스트 시작하기 🏃`}
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
            className="shadow-2xl rounded-3xl p-8 w-full max-w-md text-center border-2 border-pink-200 bg-white/90"
            style={{
              background: 'linear-gradient(120deg, #fff5fa 65%, #ffe8bc 100%)',
              boxShadow: '0 3px 32px 6px #f9a8d455, 0 1.5px 4px 0 #fae4ff33',
            }}
          >
            <div className="w-full mb-5">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-pink-400 tracking-wider">
                  PROGRESS
                </span>
                <span className="text-xs text-pink-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-gradient-to-r from-gray-100 via-pink-50 to-orange-50 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className="h-2.5 rounded-full bg-gradient-to-r from-pink-400 via-orange-400 to-purple-400 shadow"
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.45, type: 'spring', stiffness: 100 }}
                  style={{ minWidth: 10 }}
                />
              </div>
            </div>
            <h3 className="text-lg font-black mb-5 text-pink-600 tracking-wide shadow-inner">
              {questions[currentQuestion].text}
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer(questions[currentQuestion].a.type)}
                className="w-full py-3 rounded-xl font-bold text-lg shadow-xl 
                bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 
                text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-200"
              >
                {questions[currentQuestion].a.label}
              </button>
              <button
                onClick={() => handleAnswer(questions[currentQuestion].b.type)}
                className="w-full py-3 rounded-xl font-bold text-lg shadow-xl 
                bg-gradient-to-r from-orange-100 via-pink-200 to-purple-200 
                text-pink-800 hover:bg-gradient-to-l hover:from-orange-200 hover:to-pink-200 transition-all duration-200"
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
                  stroke="#f472b6"
                  strokeWidth={6}
                  strokeDasharray="48 50"
                  strokeLinecap="round"
                  opacity={0.14}
                />
                <circle
                  cx={26}
                  cy={26}
                  r={22}
                  stroke="#db2777"
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
              러너 성향 분석 중...
            </p>
            <p className="text-xs text-orange-400 mt-5">
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
            <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 via-orange-400 to-purple-500 bg-clip-text text-transparent mb-3 drop-shadow-lg animate-bounce">
              🏅 나의 러너 유형 🏅
            </h2>
            <img
              src={result.image}
              alt={result.name}
              className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-pink-200 bg-white"
              style={{ filter: 'drop-shadow(0 0 18px #fc68b377)' }}
            />
            <div className="mb-3">
              <span className="inline-block bg-gradient-to-r from-pink-500 via-orange-400 to-purple-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                {result.name}
              </span>
            </div>
            <div className="bg-white/95 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-pink-200">
              <div className="text-lg font-bold text-pink-500 mb-2">
                {result.name}
              </div>
              <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
            </div>
            <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-4 mt-2">
              {best && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-pink-500 font-semibold mb-1">환상의 러닝메이트</span>
                  <img src={best.image} alt={best.name} className="w-20 h-20 rounded-xl mb-1 border-2 border-pink-200" />
                  <span className="text-xs font-bold text-pink-500">{best.name}</span>
                </div>
              )}
              {worst && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-400 font-semibold mb-1">환장의 러닝메이트</span>
                  <img src={worst.image} alt={worst.name} className="w-20 h-20 rounded-xl mb-1 border-2 border-gray-200" />
                  <span className="text-xs font-bold text-gray-500">{worst.name}</span>
                </div>
              )}
            </div>
            <button
              onClick={restart}
              className="bg-white hover:bg-pink-50 text-pink-400 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-pink-200"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-pink-500 via-orange-400 to-purple-400 hover:from-pink-600 hover:to-purple-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              결과 공유하기
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              다른 테스트 해보기
            </button>
            {copied && (
              <div className="mt-2 text-sm text-green-500 animate-fade-in">
                결과 URL이 복사되었습니다!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default RunnerTest;
