// src/pages/runnertest/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import questions from '@/tests/runnertest/questions';
import results, { mainImage } from '@/tests/runnertest/result';

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';

// MBTI 로직
function getRunnerType(userAnswers) {
  let E = 0, I = 0, N = 0, S = 0, P = 0, J = 0;
  Object.entries(userAnswers).forEach(([qid, v]) => {
    const q = questions.find(q => q.id === qid);
    if (!q) return;
    const choice = v === 'a' ? q.a : q.b;
    if (choice.type === 'E') E++;
    if (choice.type === 'I') I++;
    if (choice.type === 'N') N++;
    if (choice.type === 'S') S++;
    if (choice.type === 'P') P++;
    if (choice.type === 'J') J++;
  });
  const ie = E >= I ? 'E' : 'I';
  const ns = N >= S ? 'N' : 'S';
  const pj = P >= J ? 'P' : 'J';
  return ie + ns + pj;
}

export default function RunnerTest() {
  const INITIAL_COUNT = 10210;
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);
  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const ref = doc(db, 'testCounts', 'runnerTest');
        const snap = await getDoc(ref);
        if (snap.exists()) setCount(INITIAL_COUNT + (snap.data().count || 0));
      } catch (e) { }
    }
    fetchCount();
  }, []);

  const startTest = async () => {
    try {
      const ref = doc(db, 'testCounts', 'runnerTest');
      await updateDoc(ref, { count: increment(1) });
    } catch (e) { }
    setStep('question');
  };

  const handleAnswer = (value) => {
    const qid = questions[currentQuestion].id;
    setUserAnswers(prev => ({ ...prev, [qid]: value }));
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('loading');
      setTimeout(() => setStep('result'), 1600 + Math.random() * 800);
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setUserAnswers({});
    setCopied(false);
  };

  // 결과
  const type = step === 'result' ? getRunnerType(userAnswers) : null;
  const result = type ? results.find(r => r.id === type) : null;
  const bestMatch = result ? results.find(r => r.id === result.bestMatch) : null;
  const worstMatch = result ? results.find(r => r.id === result.worstMatch) : null;

  const handleShare = () => {
    if (!result) return;
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/runnertest/result/${result.id}`
      : '';
    if (navigator.share) {
      navigator.share({
        title: "러너 성향 테스트 결과",
        text: "나의 러닝 성향은? 너도 해봐! 🏃‍♂️",
        url: shareUrl
      }).catch(() => { });
    } else if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-50 to-yellow-50 flex flex-col items-center justify-center px-4 py-2">
      <Head>
        <title>러너 성향 테스트 | Test 休</title>
        <meta name="description" content="12가지 질문으로 알아보는 나의 러닝 유형! 나만의 러닝 스타일을 찾아보세요." />
        <meta property="og:title" content="러너 성향 테스트 | Test 休" />
        <meta property="og:description" content="12가지 질문으로 나의 러닝 성향을 진단해보세요!" />
        <meta property="og:image" content="https://test-hugh.co.kr/images/runnertest/main.png" />
        <meta property="og:url" content="https://test-hugh.co.kr/runnertest" />
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
                boxShadow: '0 2px 32px 8px #c7fad6',
                background: '#f3fff8',
              }}
            />
            <h2 className="text-3xl font-extrabold mt-2 mb-2 text-green-500 tracking-tight drop-shadow-lg animate-bounce">
              러너 성향 테스트
            </h2>
            <p className="mb-2 text-green-600 text-lg text-center font-medium max-w-xl shadow-inner">
              나만의 러닝 스타일!<br />
              12가지 질문으로 러닝 DNA를 찾아보세요!<br />
              <span className="text-green-600 font-semibold">
                오늘은 마라톤 준비생, 내일은 러닝 크루 리더?<br />
                나도 몰랐던 내 운동 본능을 꺼내보세요.<br />
              </span>
              <span className="text-emerald-900 font-bold">
                트랙 위의 열정파, 꾸준한 페이스 조절러, 즉흥 러너!<br />
                당신만의 러닝 타입을 진단하고,<br />
                <span className="text-pink-500">함께 달리면 좋은 궁합 메이트</span>도 추천해드립니다!
              </span>

            </p>
            <p className="mb-6 text-green-700 text-sm font-semibold">
              🏃‍♂️ {count.toLocaleString()}명이 참여했어요
            </p>
            <button
              onClick={startTest}
              className="bg-gradient-to-r from-green-400 via-yellow-200 to-blue-300 hover:from-green-500 hover:to-blue-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-2 ring-green-200 animate-bounce-slow"
            >
              {`테스트 시작하기 🏃`}
            </button>
          </motion.div>
        )}
        <div style={{ display: 'none' }}>
          <h3>Q1. 달리기를 시작하게 된 이유는?</h3>
          <p>1) 체력 향상과 기록 달성을 목표로 한다.</p>
          <p>2) 스트레스 해소나 감정 정리를 위해 달린다.</p>

          <h3>Q2. 평소 달리는 스타일은?</h3>
          <p>1) 목표 거리와 페이스를 정해두고 계획적으로 달린다.</p>
          <p>2) 그날의 기분과 분위기에 따라 자유롭게 달린다.</p>
        </div>


        {/* 질문 */}
        {step === 'question' && questions[currentQuestion] && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.33, ease: 'easeOut' }}
            className="bg-white/90 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-green-300"
          >
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-green-400 tracking-wider">PROGRESS</span>
                <span className="text-xs text-green-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-green-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-green-400 via-yellow-200 to-blue-300 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="flex-1 text-right font-bold text-base md:text-lg text-green-600 pr-2 break-keep">
                {questions[currentQuestion].a.label}
              </span>
              <span className="text-lg md:text-2xl font-black text-yellow-500 px-2 select-none drop-shadow animate-pulse">
                vs
              </span>
              <span className="flex-1 text-left font-bold text-base md:text-lg text-blue-400 pl-2 break-keep">
                {questions[currentQuestion].b.label}
              </span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('a')}
                className="w-full py-3 rounded-xl font-bold text-lg bg-green-400 text-white hover:bg-green-500 transition-all duration-200 shadow-xl"
              >
                {questions[currentQuestion].a.label}
              </button>
              <button
                onClick={() => handleAnswer('b')}
                className="w-full py-3 rounded-xl font-bold text-lg bg-blue-300 text-white hover:bg-blue-500 transition-all duration-200 shadow-xl"
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
                  stroke="#31cb84"
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
            <p className="text-lg font-black mb-2 text-green-400 tracking-wider animate-pulse">
              러닝 성향 분석 중...
            </p>
            <p className="text-xs text-green-400 mt-5">
              곧 결과가 공개됩니다!
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
            <h2 className="text-2xl font-black text-green-400 mb-3 drop-shadow-lg animate-bounce">
              🎉 당신의 러너 성향 결과 🎉
            </h2>
            <img
              src={result.image}
              alt={result.name}
              className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-green-300 bg-white"
              style={{ filter: 'drop-shadow(0 0 18px #77e6ad)' }}
            />
            <div className="mb-3">
              <span className="inline-block bg-green-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                {result.name}
              </span>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-green-300">
              <div className="text-lg font-bold text-green-400 mb-2">
                {result.name}
              </div>
              <div
                className="text-base text-gray-700"
                dangerouslySetInnerHTML={{ __html: result.description }}
              />
            </div>
            {/* Best/Worst match */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10 mb-3">
              {bestMatch && (
                <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center border-2 border-green-200 shadow">
                  <div className="text-xs font-semibold text-green-600 mb-1">🙆‍♂️환상의 러닝메이트</div>
                  <img
                    src={bestMatch.image}
                    alt={bestMatch.name}
                    className="w-16 h-16 rounded-xl mb-2 border-2 border-green-300 shadow"
                  />
                  <div className="font-bold text-green-700 text-sm">{bestMatch.name}</div>
                </div>
              )}
              {worstMatch && (
                <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center border-2 border-red-200 shadow">
                  <div className="text-xs font-semibold text-red-600 mb-1">🤦‍♀️환장의 러닝메이트</div>
                  <img
                    src={worstMatch.image}
                    alt={worstMatch.name}
                    className="w-16 h-16 rounded-xl mb-2 border-2 border-red-300 shadow"
                  />
                  <div className="font-bold text-red-700 text-sm">{worstMatch.name}</div>
                </div>
              )}
            </div>
            <button
              onClick={restart}
              className="bg-white hover:bg-green-100 text-green-400 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-green-200"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-green-400 via-yellow-200 to-blue-300 hover:from-green-500 hover:to-blue-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              결과 공유하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-green-400 hover:bg-green-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              다른 테스트 해보기
            </button>
            <button
              onClick={() => router.push('/results')}
              className="bg-yellow-300 hover:bg-yellow-500 text-green-500 py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              결과 설명 보기
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
