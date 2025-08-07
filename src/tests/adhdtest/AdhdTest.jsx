import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import questions from '@/tests/adhdtest/questions';
import results, { mainImage } from '@/tests/adhdtest/result';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';
import meta from '@/tests/adhdtest/meta';

// ADHD 점수 계산 함수
function getAdhdType(userAnswers) {
  let IA = 0; // Inattention
  let HI = 0; // Hyperactivity/Impulsivity
  questions.forEach((q, idx) => {
    if (userAnswers[q.id] === 'a') {
      if (q.category === 'IA') IA++;
      else if (q.category === 'HI') HI++;
    }
  });

  // 결과 매칭
  if (IA <= 2 && HI <= 2) return 'low_ia_low_hi';
  if ((IA === 3 || IA === 4 || IA === 5) && HI <= 2) return 'mid_ia_low_hi';
  if (IA <= 2 && (HI === 3 || HI === 4 || HI === 5)) return 'low_ia_mid_hi';
  if ((IA === 3 || IA === 4) && (HI === 3 || HI === 4)) return 'mid_ia_mid_hi';
  if (IA >= 5 && HI >= 5) return 'high_ia_high_hi';
  // 기타 경우는 중간으로
  return 'mid_ia_mid_hi';
}

export default function AdhdTest() {
  const INITIAL_COUNT = 38740;
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);

  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const ref = doc(db, 'testCounts', 'adhdTest');
        const snap = await getDoc(ref);
        if (snap.exists()) setCount(INITIAL_COUNT + (snap.data().count || 0));
      } catch (e) { }
    }
    fetchCount();
  }, []);

  const startTest = async () => {
    try {
      const ref = doc(db, 'testCounts', 'adhdTest');
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
      setTimeout(() => setStep('result'), 1700 + Math.random() * 1000);
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setUserAnswers({});
    setCopied(false);
  };

  // 결과 유형 계산
  const type = step === 'result' ? getAdhdType(userAnswers) : null;
  const result = type ? results.find(r => r.id === type) : null;

  const handleShare = () => {
    if (!result) return;
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/adhdtest/result/${result.id}`
      : '';
    if (navigator.share) {
      navigator.share({
        title: "성인 ADHD 테스트 결과",
        text: "나의 ADHD 잠재력! 너도 해봐! 🌈",
        url: shareUrl
      }).catch(() => { });
    } else if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4 py-2"
      style={{
        background: "linear-gradient(120deg,#f472b6 0%,#fbbf24 25%,#4ade80 45%,#38bdf8 70%,#a21caf 100%)"
      }}
    >
      <Head>
        <title>성인 ADHD 테스트 | Test 休</title>
        <meta name="description" content="12문항으로 알아보는 성인 ADHD 잠재력, 당신의 뇌는 얼마나 정신없는가? (가볍게 즐기는 테스트, 실제 진단 아님!)" />
        <meta property="og:title" content="성인 ADHD 테스트 | Test 休" />
        <meta property="og:description" content="12문항으로 나의 산만/충동/집중력 스타일 분석! 무지개 정신사나운 결과, 진짜 ADHD 검사는 병원에서 받으세요!" />
        <meta property="og:image" content="https://test-hugh.co.kr/images/adhdtest/main.webp" />
        <meta property="og:url" content="https://test-hugh.co.kr/adhdtest" />
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
              src={meta.image}
              alt="메인"
              className="w-full max-w-lg h-[36vh] object-contain mb-3 drop-shadow-xl"
              style={{
                borderRadius: '2rem',
                boxShadow: '0 2px 32px 8px #ff87bdbb',
                background: '#fff3ff',
              }}
            />
            <h2 className="text-3xl font-extrabold mt-2 mb-2 text-fuchsia-700 tracking-tight drop-shadow-lg animate-bounce">
              성인 ADHD 테스트
            </h2>
            <p className="mb-2 text-fuchsia-600 text-lg text-center font-medium max-w-xl shadow-inner">
              <span className="text-fuchsia-700 font-bold">성인 ADHD 잠재력, </span>
              당신의 뇌는 얼마나 <span className="text-amber-500 font-extrabold">정신없고 창의적</span>일까? <span className="text-blue-500 font-bold">🌀</span><br />

              <span className="text-violet-700 font-semibold">
                DSM-5 기준을 참고했지만<br />
                어디까지나 재미로 즐기는 테스트!
              </span> <span className="text-blue-700 font-bold">(실제 진단 아님)</span> <br />

              <span className="text-pink-500 font-bold">
                12가지 질문으로 내 안의
                <span className="text-yellow-600"> 산만함</span>과 <span className="text-green-600">에너지</span>를 진단해보세요! <span className="font-bold text-pink-500">🌈</span>
              </span><br />

              <span className="text-orange-600 font-semibold">
                아이디어 넘치는 머릿속,
                충동과 집중 사이에서 오가는<br />
                진짜 나의 모습을 발견할 시간!
              </span><br />

              <span className="text-fuchsia-500 font-bold">
                결과는 유쾌하지만,
                진짜 고민이 있다면 전문가 상담을 추천해요!
              </span>

            </p>
            <p className="mb-6 text-yellow-200 text-sm font-semibold">
              🌀 {count.toLocaleString()}명이 참여했어요
            </p>
            <button
              onClick={startTest}
              className="bg-gradient-to-r from-pink-400 via-yellow-200 to-fuchsia-400 hover:from-pink-500 hover:to-blue-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-2 ring-pink-200 animate-bounce-slow"
            >
              {`테스트 시작하기 🧠`}
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
            className="bg-white/90 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-fuchsia-400"
          >
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-fuchsia-500 tracking-wider">PROGRESS</span>
                <span className="text-xs text-pink-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-pink-200 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-fuchsia-500 via-yellow-200 via-blue-400 to-pink-400 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            <div className="mb-7">
              <span className="text-base md:text-lg font-bold text-fuchsia-700 drop-shadow">{questions[currentQuestion].text}</span>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('a')}
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-pink-400 via-yellow-300 to-blue-300 text-white hover:bg-fuchsia-500 transition-all duration-200 shadow-xl"
              >
                {questions[currentQuestion].a.label}
              </button>
              <button
                onClick={() => handleAnswer('b')}
                className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-blue-400 via-green-300 to-yellow-300 text-white hover:bg-pink-300 transition-all duration-200 shadow-xl"
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
                  stroke="#d946ef"
                  strokeWidth={6}
                  strokeDasharray="48 50"
                  strokeLinecap="round"
                  opacity={0.14}
                />
                <circle
                  cx={26}
                  cy={26}
                  r={22}
                  stroke="#f59e42"
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
            <p className="text-lg font-black mb-2 text-fuchsia-400 tracking-wider animate-pulse">
              집중력 검사 중...
            </p>
            <p className="text-xs text-fuchsia-500 mt-5">
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
            <h2 className="text-2xl font-black text-fuchsia-600 mb-3 drop-shadow-lg animate-bounce">
              🎉 당신의 ADHD 스타일 결과 🎉
            </h2>
            <img
              src={result.image}
              alt={result.type}
              className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-pink-300 bg-white"
              style={{ filter: 'drop-shadow(0 0 18px #f472b6)' }}
            />
            <div className="mb-3">
              <span className="inline-block bg-fuchsia-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                {result.type}
              </span>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-fuchsia-400">
              <div className="text-lg font-bold text-fuchsia-400 mb-2">
                {result.type}
              </div>
              <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
            </div>
            <button
              onClick={restart}
              className="bg-white hover:bg-pink-100 text-fuchsia-500 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-pink-200"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-fuchsia-400 via-yellow-300 to-blue-400 hover:from-pink-500 hover:to-blue-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              결과 공유하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-fuchsia-400 hover:bg-fuchsia-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
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
