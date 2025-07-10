import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import questions from '@/tests/booktest/questions';
import results from '@/tests/booktest/result';
import meta from '@/tests/booktest/meta';

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';

const mainImage = '/images/booktest/main.png';

// MBTI 동점 랜덤 처리
function getBookType(userAnswers) {
  let E = 0, I = 0, N = 0, S = 0, T = 0, F = 0;
  Object.entries(userAnswers).forEach(([qid, v]) => {
    const q = questions.find(q => q.id === Number(qid));
    if (!q) return;
    // 문항 id 기준
    if (q.a && v === 'a') {
      if (q.a.type === 'E') E++;
      if (q.a.type === 'I') I++;
      if (q.a.type === 'N') N++;
      if (q.a.type === 'S') S++;
      if (q.a.type === 'T') T++;
      if (q.a.type === 'F') F++;
    }
    if (q.b && v === 'b') {
      if (q.b.type === 'E') E++;
      if (q.b.type === 'I') I++;
      if (q.b.type === 'N') N++;
      if (q.b.type === 'S') S++;
      if (q.b.type === 'T') T++;
      if (q.b.type === 'F') F++;
    }
  });
  const ie = E === I ? (Math.random() < 0.5 ? 'E' : 'I') : (E > I ? 'E' : 'I');
  const ns = N === S ? (Math.random() < 0.5 ? 'N' : 'S') : (N > S ? 'N' : 'S');
  const tf = T === F ? (Math.random() < 0.5 ? 'T' : 'F') : (T > F ? 'T' : 'F');
  return ie + ns + tf;
}

// 답변 label이 아닌, type도 함께 명시해둔 구조로 questions 리팩 필요!
// 예시:
/// { a: { label: '혼자...', type: 'I' }, b: { label: '친구와...', type: 'E' } }
// 이미 그렇게 만들어뒀다면 아래 그대로 사용 가능!

export default function BookTest() {
  const INITIAL_COUNT = 11000;
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);

  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const ref = doc(db, 'testCounts', 'bookTest');
        const snap = await getDoc(ref);
        if (snap.exists()) setCount(INITIAL_COUNT + (snap.data().count || 0));
      } catch (e) { }
    }
    fetchCount();
  }, []);

  const startTest = async () => {
    try {
      const ref = doc(db, 'testCounts', 'bookTest');
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
      setTimeout(() => setStep('result'), 1400 + Math.random() * 800);
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setUserAnswers({});
    setCopied(false);
  };

  // 결과/파트너
  const type = step === 'result' ? getBookType(userAnswers) : null;
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
      ? `${window.location.origin}/booktest/result/${result.id}`
      : '';
    if (navigator.share) {
      navigator.share({
        title: "독서 성향 테스트 결과",
        text: "나의 독서 성향은? 너도 해봐! 📚",
        url: shareUrl
      }).catch(() => { });
    } else if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-200 to-orange-400 flex flex-col items-center justify-center px-4 py-2">
      <Head>
        <title>독서 성향 테스트 | Test 休</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title + ' | Test 休'} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={`https://test-hugh.co.kr${meta.image}`} />
        <meta property="og:url" content={`https://test-hugh.co.kr${meta.path}`} />
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
              alt="테스트 휴"
              className="w-full max-w-lg h-[36vh] object-contain mb-3 drop-shadow-xl"
              style={{
                borderRadius: '2rem',
                boxShadow: '0 2px 32px 8px #ffe066cc',
                background: '#fffae5',
              }}
            />
            <h2 className="text-3xl font-extrabold mt-2 mb-2 text-orange-500 tracking-tight drop-shadow-lg animate-bounce">
              독서 성향 테스트
            </h2>
            <p className="mb-2 text-orange-700 text-lg text-center font-medium max-w-xl shadow-inner">
              책 읽는 스타일에도 성격이 있다? <span className="text-fuchsia-600 font-bold">🤯</span><br />
              나의 독서 스타일, 어울리는 책과 독서법까지!<br />
              12문항으로 내 안의 <span className="text-amber-600 font-semibold">북 DNA</span>를 찾아보세요.<br />
              <span className="text-orange-700 font-bold">
                소설을 좋아하는 낭만러, 현실을 꿰뚫는 실천가,
              </span><br />
              <span className="text-green-700 font-semibold">
                당신만을 위한 추천 도서, 독서 습관, 독서 메이트까지 알려드립니다! 📚
              </span>

            </p>
            <p className="mb-6 text-lime-600 text-sm font-semibold">
              📚 {count.toLocaleString()}명이 참여했어요
            </p>
            <button
              onClick={startTest}
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg ring-2 ring-yellow-200 animate-bounce-slow"
            >
              {`테스트 시작하기 📚`}
            </button>
          </motion.div>
        )}
        <div style={{ display: 'none' }}>
          <h3>Q1. 책을 고를 때 당신의 기준은?</h3>
          <p>1) 실용적이고 요약이 잘 된 책 위주로 고른다.</p>
          <p>2) 분위기나 문체, 감성적인 요소를 중요하게 여긴다.</p>

          <h3>Q2. 독서하는 장소로 더 선호하는 곳은?</h3>
          <p>1) 조용하고 혼자만의 공간에서 집중해서 읽는 것을 좋아한다.</p>
          <p>2) 북카페나 야외 같은 분위기 있는 곳에서 여유롭게 읽는 것을 좋아한다.</p>
        </div>


        {/* 질문 */}
        {step === 'question' && questions[currentQuestion] && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 32, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.33, ease: 'easeOut' }}
            className="bg-white/90 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-yellow-300"
          >
            {/* 진행바 */}
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-yellow-500 tracking-wider">PROGRESS</span>
                <span className="text-xs text-orange-500">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-yellow-100 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-300 h-2.5 rounded-full transition-all duration-500"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
            {/* 질문 텍스트 */}
            <div className="mb-6 text-lg font-bold text-yellow-700 min-h-[42px] flex items-center justify-center">
              {questions[currentQuestion].text}
            </div>
            {/* 선택지 */}
            <div className="space-y-3">
              <button
                onClick={() => handleAnswer('a')}
                className="w-full py-3 rounded-xl font-bold text-lg bg-yellow-400 text-white hover:bg-orange-400 transition-all duration-200 shadow-xl"
              >
                {questions[currentQuestion].a.label}
              </button>
              <button
                onClick={() => handleAnswer('b')}
                className="w-full py-3 rounded-xl font-bold text-lg bg-orange-300 text-white hover:bg-yellow-500 transition-all duration-200 shadow-xl"
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
                  stroke="#ffe066"
                  strokeWidth={6}
                  strokeDasharray="48 50"
                  strokeLinecap="round"
                  opacity={0.16}
                />
                <circle
                  cx={26}
                  cy={26}
                  r={22}
                  stroke="#ffd43b"
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
            <p className="text-lg font-black mb-2 text-yellow-600 tracking-wider animate-pulse">
              독서 DNA 분석 중...
            </p>
            <p className="text-xs text-orange-500 mt-5">
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
            <h2 className="text-2xl font-black text-yellow-700 mb-3 drop-shadow-lg animate-bounce">
              📚 당신의 독서 성향 결과 📚
            </h2>
            <img
              src={result.image}
              alt={result.name}
              className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-yellow-300 bg-white"
              style={{ filter: 'drop-shadow(0 0 18px #ffe066)' }}
            />
            <div className="mb-3">
              <span className="inline-block bg-yellow-500 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
                {result.name}
              </span>
            </div>
            <div className="bg-white/90 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-yellow-300">
              <div className="text-lg font-bold text-yellow-600 mb-2">
                {result.name}
              </div>
              {/* description에 <br> 포함되므로 html로 렌더 */}
              <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
            </div>
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mt-10 mb-3">
              {bestMatch && (
                <div className="bg-yellow-50 rounded-xl p-4 flex flex-col items-center border-2 border-yellow-200 shadow">
                  <div className="text-xs font-semibold text-yellow-600 mb-1">🥰 환상의 독서 메이트</div>
                  <img
                    src={bestMatch.image}
                    alt={bestMatch.name}
                    className="w-16 h-16 rounded-xl mb-2 border-2 border-yellow-300 shadow"
                  />
                  <div className="font-bold text-yellow-700 text-sm">{bestMatch.name}</div>
                </div>
              )}
              {worstMatch && (
                <div className="bg-gray-50 rounded-xl p-4 flex flex-col items-center border-2 border-gray-200 shadow">
                  <div className="text-xs font-semibold text-gray-600 mb-1">🤬 상극의 독서 메이트</div>
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
              className="bg-white hover:bg-yellow-50 text-yellow-500 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-yellow-200"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="bg-gradient-to-r from-yellow-500 via-orange-400 to-yellow-400 hover:from-yellow-600 hover:to-orange-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              결과 공유하기
            </button>
            <button
              onClick={() => router.push('/')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
            >
              다른 테스트 해보기
            </button>
            {copied && (
              <div className="mt-2 text-sm text-yellow-600 animate-fade-in">
                URL이 복사되었습니다!
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
