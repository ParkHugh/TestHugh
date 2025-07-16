import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import questions from '@/tests/flirttest/questions';
import results, { mainImage } from '@/tests/flirttest/result';

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';

// MBTI 동점 랜덤 처리
function getFlirtType(userAnswers) {
  let E = 0, I = 0, N = 0, S = 0, T = 0, F = 0;
  Object.entries(userAnswers).forEach(([qid, v]) => {
    const q = questions.find(q => q.id === qid);
    if (!q) return;
    const choice = v === 'a' ? q.a : q.b;
    if (choice.type === 'E') E++;
    if (choice.type === 'I') I++;
    if (choice.type === 'N') N++;
    if (choice.type === 'S') S++;
    if (choice.type === 'T') T++;
    if (choice.type === 'F') F++;
  });

  // 동점 랜덤 (E/I, N/S, T/F)
  const ie = E === I ? (Math.random() < 0.5 ? 'E' : 'I') : (E > I ? 'E' : 'I');
  const ns = N === S ? (Math.random() < 0.5 ? 'N' : 'S') : (N > S ? 'N' : 'S');
  const tf = T === F ? (Math.random() < 0.5 ? 'T' : 'F') : (T > F ? 'T' : 'F');
  return ie + ns + tf;
}

export default function FlirtTest() {
  const INITIAL_COUNT = 72310;
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);

  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const ref = doc(db, 'testCounts', 'flirtTest');
        const snap = await getDoc(ref);
        if (snap.exists()) setCount(INITIAL_COUNT + (snap.data().count || 0));
      } catch (e) { }
    }
    fetchCount();
  }, []);

  const startTest = async () => {
    try {
      const ref = doc(db, 'testCounts', 'flirtTest');
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
      setTimeout(() => setStep('result'), 1700 + Math.random() * 600);
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setUserAnswers({});
    setCopied(false);
  };

  // 결과/파트너
  const type = step === 'result' ? getFlirtType(userAnswers) : null;
  const result = type ? results.find(r => r.id === type) : null;
  const bestMatch = result && result.bestMatch
    ? results.find(r => r.id === result.bestMatch)
    : null;
  const worstMatch = result && result.worstMatch
    ? results.find(r => r.id === result.worstMatch)
    : null;

  const handleShare = () => {
    if (!result) return;
    const shareUrl = typeof window !== 'undefined'
      ? `${window.location.origin}/flirttest/result/${result.id}`
      : '';
    if (navigator.share) {
      navigator.share({
        title: "플러팅 성향 테스트 결과",
        text: "나의 플러팅 스타일은? 너도 해봐! 💘",
        url: shareUrl
      }).catch(() => { });
    } else if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-100 via-pink-200 to-red-400 flex flex-col items-center justify-center px-4 py-2">
      <Head>
        <title>플러팅 성향 테스트 | Test 休</title>
        <meta name="description" content="나의 플러팅 스타일, 설레는 첫 인상과 찰떡 케미! 12가지 질문으로 알아보는 플러팅 MBTI" />
        <meta property="og:title" content="플러팅 성향 테스트 | Test 休" />
        <meta property="og:description" content="플러팅 스타일, 당신은 어떤 타입? 설렘주의보 발령! 12문항으로 확인해보세요" />
        <meta property="og:image" content="https://test-hugh.co.kr/images/flirttest/main.webp" />
        <meta property="og:url" content="https://test-hugh.co.kr/flirttest" />
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
                boxShadow: '0 2px 32px 8px #ff5c7090',
                background: '#ffeff1',
              }}
            />
            <h2 className="text-3xl font-extrabold mt-2 mb-2 text-pink-500 tracking-tight drop-shadow-lg animate-bounce">
              플러팅 성향 테스트
            </h2>
            <p className="mb-2 text-red-500 text-lg text-center font-medium max-w-xl shadow-inner">
              설레는 첫마디부터 내 스타일 플러팅까지!<br />
              12가지 질문으로 플러팅 DNA를 찾아보세요!<br />
              <span className="text-pink-500 font-bold">
                오늘의 내 플러팅은 달콤? 시크? 센스만점?<br />
              </span>
              <span className="text-rose-600 font-semibold">
                나도 몰랐던 썸 능력치, 지금 바로 확인!<br />
              </span>
              <span className="text-fuchsia-400 font-bold">
                상대방과 케미 폭발하는 플러팅 궁합도 확인하세요!
              </span>

            </p>
            <p className="mb-6 text-pink-400 text-sm font-semibold">
              💘 {count.toLocaleString()}명이 참여했어요
            </p>
            <button
              onClick={startTest}
              className="bg-gradient-to-r from-red-500 via-pink-400 to-orange-300 hover:from-pink-600 hover:to-red-400 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-2 ring-pink-100 animate-bounce-slow"
            >
              {`테스트 시작하기 💘`}
            </button>
          </motion.div>
        )}
        <div style={{ display: 'none' }}>
          <h3>Q1. 좋아하는 사람이 생겼을 때 나의 행동은?</h3>
          <p>1) 마음에 들면 뚝딱이더라도 먼저 말걸고 직진한다.</p>
          <p>2) 인사하고 카톡하는 것만으로도 플러팅이라고 생각한다.</p>

          <h3>Q2. 향기에 대한 나의 취향은?</h3>
          <p>1) 빨래할 때 피죤이면 충분하다.</p>
          <p>2) 다양한 향기를 좋아하고 향수를 자주 뿌린다.</p>
        </div>


        {/* 질문 */}
        {step === 'question' && questions[currentQuestion] && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.33, ease: 'easeOut' }}
            className="bg-white/90 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-pink-300"
          >
            {/* 진행바 */}
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-pink-400 tracking-wider">PROGRESS</span>
                <span className="text-xs text-red-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-pink-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-red-400 via-pink-300 to-orange-200 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            {/* 질문 텍스트 */}
            <div className="mb-6 text-lg font-bold text-pink-600 min-h-[42px] flex items-center justify-center">
              {questions[currentQuestion].text}
            </div>
            {/* 선택지 */}
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('a')}
                className="w-full py-3 rounded-xl font-bold text-lg bg-red-400 text-white hover:bg-pink-500 transition-all duration-200 shadow-xl"
              >
                {questions[currentQuestion].a.label}
              </button>
              <button
                onClick={() => handleAnswer('b')}
                className="w-full py-3 rounded-xl font-bold text-lg bg-orange-300 text-white hover:bg-orange-400 transition-all duration-200 shadow-xl"
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
                  stroke="#fa4788"
                  strokeWidth={6}
                  strokeDasharray="48 50"
                  strokeLinecap="round"
                  opacity={0.16}
                />
                <circle
                  cx={26}
                  cy={26}
                  r={22}
                  stroke="#fc9ab7"
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
              플러팅 DNA 분석 중...
            </p>
            <p className="text-xs text-red-400 mt-5">
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
            <h2 className="text-2xl font-black text-pink-500 mb-3 drop-shadow-lg animate-bounce">
              💘 당신의 플러팅 성향 결과 💘
            </h2>
            <img
              src={result.image}
              alt={result.name}
              className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-pink-300 bg-white"
              style={{ filter: 'drop-shadow(0 0 18px #ffb6d2)' }}
            />
            <div className="mb-3">
              <span className="inline-block bg-pink-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                {result.name}
              </span>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-pink-300">
              <div className="text-lg font-bold text-pink-400 mb-2">
                {result.name}
              </div>
              {/* description에 <br> 포함되므로 html로 렌더 */}
              <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10 mb-3">
              {bestMatch && (
                <div className="bg-pink-50 rounded-xl p-4 flex flex-col items-center border-2 border-pink-200 shadow">
                  <div className="text-xs font-semibold text-pink-600 mb-1">💞환상의 궁합</div>
                  <img
                    src={bestMatch.image}
                    alt={bestMatch.name}
                    className="w-16 h-16 rounded-xl mb-2 border-2 border-pink-300 shadow"
                  />
                  <div className="font-bold text-pink-700 text-sm">{bestMatch.name}</div>
                </div>
              )}
              {worstMatch && (
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center border-2 border-gray-200 shadow">
                  <div className="text-xs font-semibold text-gray-600 mb-1">💔환장의 궁합</div>
                  <img
                    src={worstMatch.image}
                    alt={worstMatch.name}
                    className="w-16 h-16 rounded-xl mb-2 border-2 border-gray-300 shadow"
                  />
                  <div className="font-bold text-gray-700 text-sm">{worstMatch.name}</div>
                </div>
              )}
            </div>
            <button
              onClick={restart}
              className="bg-white hover:bg-pink-100 text-pink-400 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-pink-200"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-pink-400 via-red-300 to-orange-300 hover:from-pink-500 hover:to-orange-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              결과 공유하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              다른 테스트 해보기
            </button>
            {copied && (
              <div className="mt-2 text-sm text-pink-600 animate-fade-in">
                URL이 복사되었습니다!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
