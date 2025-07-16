import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import questions from '@/tests/traveltest/questions';
import results, { mainImage } from '@/tests/traveltest/result';

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';

// MBTI 카운팅 방식
function getTravelType(userAnswers) {
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

export default function TravelTest() {
  const INITIAL_COUNT = 42195;
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);

  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const ref = doc(db, 'testCounts', 'travelTest');
        const snap = await getDoc(ref);
        if (snap.exists()) setCount(INITIAL_COUNT + (snap.data().count || 0));
      } catch (e) { }
    }
    fetchCount();
  }, []);

  const startTest = async () => {
    try {
      const ref = doc(db, 'testCounts', 'travelTest');
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
      setTimeout(() => setStep('result'), 2000 + Math.random() * 700);
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setUserAnswers({});
    setCopied(false);
  };

  // 결과 유형 계산 (MBTI처럼)
  const type = step === 'result' ? getTravelType(userAnswers) : null;
  const result = type ? results.find(r => r.id === type) : null;
  const bestMatch = result ? results.find(r => r.id === result.bestMatch) : null;
  const worstMatch = result ? results.find(r => r.id === result.worstMatch) : null;

  const handleShare = () => {
    if (!result) return;
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/traveltest/result/${result.id}`
      : '';
    if (navigator.share) {
      navigator.share({
        title: "여행 성향 테스트 결과",
        text: "나의 여행 성향은? 너도 해봐! 🌍",
        url: shareUrl
      }).catch(() => { });
    } else if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-yellow-50 to-green-100 flex flex-col items-center justify-center px-4 py-2">
      <Head>
        <title>여행 성향 테스트 | Test 休</title>
        <meta name="description" content="나는 여행갈 때 어떤 타입? 12가지 질문으로 알아보는 나의 여행 스타일! 추천 여행지" />
        <meta property="og:title" content="여행 성향 테스트 | Test 休" />
        <meta property="og:description" content="12문항으로 알아보는 여행 MBTI, 당신의 여행 유형은? 추천 여행지" />
        <meta property="og:image" content="https://test-hugh.co.kr/images/traveltest/main.webp" />
        <meta property="og:url" content="https://test-hugh.co.kr/traveltest" />
      </Head>

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
              src={mainImage}
              alt="테스트 휴"
              className="w-full max-w-lg h-[36vh] object-contain mb-3 drop-shadow-xl"
              style={{
                borderRadius: '2rem',
                boxShadow: '0 2px 32px 8px #9de3ffbb',
                background: '#ecf8ff',
              }}
            />
            <h2 className="text-3xl font-extrabold mt-2 mb-2 text-blue-500 tracking-tight drop-shadow-lg animate-bounce">
              여행 성향 테스트
            </h2>
            <p className="mb-2 text-blue-600 text-lg text-center font-medium max-w-xl shadow-inner">
              나는 어떤 여행자일까?<br />
              12가지 질문으로 나만의 여행 스타일을 진단해보세요!<br />
              <span className="text-blue-800 font-semibold">
                배낭여행 마니아, 맛집 사냥꾼, 계획형, 즉흥형…<br />
                내 안의 숨은 여행 DNA를 발견하고<br />
                나에게 딱 맞는 여행지까지 추천받을 수 있어요!<br />
                이번엔 어디로 떠나볼까요?
              </span>

            </p>
            <p className="mb-6 text-blue-400 text-sm font-semibold">
              🔥 {count.toLocaleString()}명이 참여했어요
            </p>
            <button
              onClick={startTest}
              className="bg-gradient-to-r from-blue-400 via-yellow-300 to-green-300 hover:from-blue-500 hover:to-green-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-2 ring-blue-200 animate-bounce-slow"
            >
              {`테스트 시작하기 🧳`}
            </button>
          </motion.div>
        )}
        <div style={{ display: 'none' }}>
          <h3>Q1. 다음 중 당신의 여행 스타일에 가장 가까운 것은?</h3>
          <p>1) 철저한 계획형 – 여행 전 모든 일정을 미리 준비한다.</p>
          <p>2) 즉흥 탐험형 – 그때그때 기분 따라 움직인다.</p>
          <h3>Q2. 여행지에서 가장 중요하게 생각하는 것은?</h3>
          <p>1) 맛집과 명소 위주 일정</p>
          <p>2) 현지인처럼 살아보기</p>
        </div>

        {step === 'question' && questions[currentQuestion] && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.33, ease: 'easeOut' }}
            className="bg-white/90 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-blue-300"
          >
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-blue-400 tracking-wider">PROGRESS</span>
                <span className="text-xs text-blue-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-blue-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-400 via-yellow-300 to-green-300 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            {/* vs 분할 렌더링 */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="flex-1 text-right font-bold text-base md:text-lg text-blue-500 pr-2 break-keep">
                {questions[currentQuestion].a.label}
              </span>
              <span className="text-lg md:text-2xl font-black text-yellow-500 px-2 select-none drop-shadow animate-pulse">
                vs
              </span>
              <span className="flex-1 text-left font-bold text-base md:text-lg text-green-600 pl-2 break-keep">
                {questions[currentQuestion].b.label}
              </span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('a')}
                className="w-full py-3 rounded-xl font-bold text-lg bg-blue-400 text-white hover:bg-blue-500 transition-all duration-200 shadow-xl"
              >
                {questions[currentQuestion].a.label}
              </button>
              <button
                onClick={() => handleAnswer('b')}
                className="w-full py-3 rounded-xl font-bold text-lg bg-green-300 text-white hover:bg-green-500 transition-all duration-200 shadow-xl"
              >
                {questions[currentQuestion].b.label}
              </button>
            </div>
          </motion.div>
        )}

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
                  stroke="#48b1f7"
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
            <p className="text-lg font-black mb-2 text-blue-400 tracking-wider animate-pulse">
              여행 성향 분석 중...
            </p>
            <p className="text-xs text-blue-400 mt-5">
              곧 결과가 공개됩니다!
            </p>
          </motion.div>
        )}

        {step === 'result' && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-black text-blue-500 mb-3 drop-shadow-lg animate-bounce">
              🎉 당신의 여행 성향 결과 🎉
            </h2>
            <img
              src={result.image}
              alt={result.name}
              className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-blue-300 bg-white"
              style={{ filter: 'drop-shadow(0 0 18px #9de3ffbb)' }}
            />
            <div className="mb-3">
              <span className="inline-block bg-blue-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                {result.name}
              </span>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-blue-300">
              <div className="text-lg font-bold text-blue-400 mb-2">
                {result.name}
              </div>
              {/* description에 <br> 포함되므로 html로 렌더 */}
              <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
            </div>
            {/* Best/Worst match */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10 mb-3">
              {bestMatch && (
                <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center border-2 border-blue-200 shadow">
                  <div className="text-xs font-semibold text-blue-600 mb-1">🙆‍♀️환상의 여행메이트</div>
                  <img
                    src={bestMatch.image}
                    alt={bestMatch.name}
                    className="w-16 h-16 rounded-xl mb-2 border-2 border-blue-300 shadow"
                  />
                  <div className="font-bold text-blue-700 text-sm">{bestMatch.name}</div>
                </div>
              )}
              {worstMatch && (
                <div className="bg-red-50 rounded-xl p-4 flex flex-col items-center border-2 border-red-200 shadow">
                  <div className="text-xs font-semibold text-red-600 mb-1">🤦‍♂️환장의 여행메이트</div>
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
              className="bg-white hover:bg-blue-100 text-blue-400 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-blue-200"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-blue-400 via-yellow-300 to-green-300 hover:from-blue-500 hover:to-green-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              결과 공유하기
            </button>
            <button
              onClick={() => router.push('/')}
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
