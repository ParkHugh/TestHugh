// src/tests/tetotest/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import questions from './questions';
import resultImages from './resultImages';
import resultDescriptions from './resultDescriptions';
// 이미지는 public 사용 권장
// import mainImage from './images/main.png';

// Firebase 연동
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase'; // src/firebase.js로 경로 맞춰줘

const calculateResult = (gender, answers) => {
  const aCount = Object.values(answers).filter(v => v === 'a').length;
  const bCount = Object.values(answers).filter(v => v === 'b').length;
  if (aCount >= 8) return gender === 'male' ? '테토남' : '테토녀';
  if (bCount >= 8) return gender === 'male' ? '에겐남' : '에겐녀';
  if (Math.abs(aCount - bCount) <= 2) return gender === 'male' ? '테겐남' : '테겐녀';
  return '중간 성향';
};

export default function TetoTest() {
  const INITIAL_COUNT = 72950;
  const [step, setStep] = useState('intro');
  const [gender, setGender] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);

  const router = useRouter();

  // 참여자 수 불러오기
  useEffect(() => {
    async function fetchCount() {
      const ref = doc(db, 'testCounts', 'tetoTest');
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setCount(INITIAL_COUNT + (snap.data().count || 0));
      }
    }
    fetchCount();
  }, []);

  // 시작 버튼: 참여자 수 증가 + 성별 선택 화면 진입
  const startTest = async () => {
    const ref = doc(db, 'testCounts', 'tetoTest');
    await updateDoc(ref, { count: increment(1) });
    setStep('gender');
  };

  const selectGender = (selected) => {
    setGender(selected);
    setStep('question');
  };

  const handleAnswer = (value) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('loading');
      setTimeout(() => setStep('result'), 2200 + Math.random() * 1000);
    }
  };

  const restart = () => {
    setStep('intro');
    setGender(null);
    setCurrentQuestion(0);
    setAnswers({});
    setCopied(false);
  };

  const result = calculateResult(gender, answers);

  // Next SSR 환경에서 window 사용 방지
  const handleShare = () => {
    if (typeof window === 'undefined') return;
    const shareUrl = `${window.location.origin}/tetotest/result/${encodeURIComponent(result)}`;
    if (navigator.share) {
      navigator.share({
        title: "나의 테토/테겐/에겐 테스트 결과",
        text: `나도 호르몬 유형 테스트 해봤어! 😄 `,
        url: shareUrl
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  // 결과 페이지로 이동
  const goToResultPage = () => {
    router.push(`/tetotest/result/${encodeURIComponent(result)}`);
  };

  return (
    <>
      <Head>
        <title>테토/테겐/에겐 호르몬 테스트 | Test 休</title>
        <meta name="description" content="나의 호르몬 성향을 12문항으로 알아보는 테토/테겐/에겐 테스트. 당신의 성향을 쉽고 빠르게 확인하세요!" />
        <meta property="og:title" content="테토남 에겐녀 테겐남 테스트 | Test 休" />
        <meta property="og:description" content="나의 호르몬 유형이 궁금하다면? 1분만에 결과 확인! 재미와 통찰을 동시에." />
        <meta property="og:image" content="https://test-hugh.co.kr/images/tetotest/main.png" />
        <meta property="og:url" content="https://test-hugh.co.kr/tetotest" />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-2 bg-gradient-to-br from-emerald-50 via-yellow-50 to-orange-50">
        <AnimatePresence mode="wait">
          {/* 인트로 */}
          {step === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 40, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              className="flex flex-col items-center justify-center w-full h-full"
              style={{ minHeight: '80vh' }}
            >
              <img
                src="/images/tetotest/main.png"
                alt="메인"
                className="w-full max-w-lg h-[36vh] object-contain mb-4 drop-shadow-xl"
                style={{
                  borderRadius: '2rem',
                  boxShadow: '0 2px 36px 8px #b4f3de60',
                  background: '#fafff6'
                }}
              />
              <h2 className="text-4xl md:text-5xl font-extrabold mt-2 mb-3 text-emerald-700 tracking-tight drop-shadow animate-bounce">
                테토 / 테겐 / 에겐 테스트
              </h2>
              <p className="mb-3 text-emerald-700 text-lg text-center font-semibold max-w-xl shadow-inner">
                나의 호르몬 성향을 알아보자!<br />
                12가지 질문으로 당신의 호르몬 세계를 탐험해요!
              </p>
              <p className="mb-6 text-emerald-400 text-sm font-semibold">
                🔥 {count.toLocaleString()}명이 참여했어요
              </p>
              <button
                onClick={startTest}
                className="bg-gradient-to-r from-emerald-500 via-yellow-300 to-orange-300 hover:from-emerald-600 hover:to-yellow-400 text-white py-3 px-14 rounded-2xl text-xl font-bold shadow-lg ring-2 ring-emerald-200 animate-bounce-slow transition"
              >
                {`테스트 시작하기 🌱`}
              </button>
            </motion.div>
          )}

          {/* 성별 선택 */}
          {step === 'gender' && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold mb-7 text-emerald-700">당신의 성별은?</h3>
              <div className="flex justify-center gap-5">
                <button
                  onClick={() => selectGender('male')}
                  className="bg-blue-400 hover:bg-blue-500 text-white py-3 px-8 rounded-2xl shadow font-bold text-xl transition"
                >
                  남자
                </button>
                <button
                  onClick={() => selectGender('female')}
                  className="bg-pink-400 hover:bg-pink-500 text-white py-3 px-8 rounded-2xl shadow font-bold text-xl transition"
                >
                  여자
                </button>
              </div>
            </motion.div>
          )}

          {/* 질문 */}
          <div style={{ display: 'none' }}>
            <h3>Q1. 감정이 격해지는 상황에서 나의 반응은?</h3>
            <p>1) 흥분하거나 욱하는 일이 많고, 감정 표현이 격하다.</p>
            <p>2) 감정을 잘 조절하고, 겉으로 드러내지 않는다.</p>

            <h3>Q2. 경쟁 상황에 놓였을 때 당신은?</h3>
            <p>1) 이겨야 직성이 풀리고, 승부욕이 매우 강한 편이다.</p>
            <p>2) 꼭 이기지 않아도 되며, 협력이 더 중요하다고 생각한다.</p>
          </div>

          {step === 'question' && questions[currentQuestion] && (
            <motion.div
              key={currentQuestion}
              initial={{ opacity: 0, y: 28, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -18, scale: 0.97 }}
              transition={{ duration: 0.36, ease: 'easeOut' }}
              className="bg-white/90 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-[2.5px] border-emerald-300"
            >
              {/* 진행 바 */}
              <div className="w-full mb-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-emerald-400 tracking-wider">PROGRESS</span>
                  <span className="text-xs text-emerald-400">{currentQuestion + 1} / {questions.length}</span>
                </div>
                <div className="w-full bg-emerald-100 rounded-full h-2.5">
                  <div
                    className="bg-gradient-to-r from-emerald-400 via-yellow-300 to-orange-300 h-2.5 rounded-full transition-all duration-500"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <h3 className="text-lg font-black mb-5 text-emerald-700 tracking-wide shadow-inner">
                {questions[currentQuestion].text}
              </h3>
              <div className="space-y-3">
                <button
                  onClick={() => handleAnswer('a')}
                  className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl bg-emerald-400 text-white hover:bg-emerald-500"
                >
                  🅰️ {questions[currentQuestion].a}
                </button>
                <button
                  onClick={() => handleAnswer('b')}
                  className="w-full py-3 rounded-xl font-bold text-lg transition-all duration-200 shadow-xl bg-orange-200 text-emerald-800 hover:bg-orange-300"
                >
                  🅱️ {questions[currentQuestion].b}
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
                    stroke="#34d399"
                    strokeWidth={6}
                    strokeDasharray="48 50"
                    strokeLinecap="round"
                    opacity={0.12}
                  />
                  <circle
                    cx={26}
                    cy={26}
                    r={22}
                    stroke="#eab308"
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
              <p className="text-lg font-black mb-2 text-emerald-400 tracking-wider animate-pulse">
                호르몬 밸런스 분석 중...
              </p>
              <p className="text-xs text-emerald-400 mt-5">
                잠시만 기다려주세요!
              </p>
            </motion.div>
          )}

          {/* 결과 */}
          {step === 'result' && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <h2 className="text-3xl font-extrabold text-emerald-500 mb-4 drop-shadow-lg animate-bounce">
                🎉 당신의 호르몬 유형 🎉
              </h2>
              <p className="text-xl mb-4 text-emerald-800">
                당신은 <span className="font-extrabold">{result}</span> 입니다!
              </p>
              <img
                src={resultImages[result]}
                alt={result}
                className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-emerald-300 bg-white"
                style={{ filter: 'drop-shadow(0 0 18px #86efac99)' }}
              />
              {/* 결과별 설명 */}
              {resultDescriptions[result] && (
                <div className="mx-auto max-w-lg space-y-5 text-left">
                  <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg text-orange-600 mb-2">성격적 특성</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {resultDescriptions[result].성격적특성.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg text-emerald-600 mb-2">행동적 특성</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {resultDescriptions[result].행동적특성.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-xl shadow-sm">
                    <h3 className="font-bold text-lg text-pink-600 mb-2">연애 스타일</h3>
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      {resultDescriptions[result].연애스타일.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <button
                onClick={restart}
                className="bg-white hover:bg-emerald-100 text-emerald-400 py-2 px-6 rounded-xl font-bold mt-3 shadow-md border border-emerald-200"
              >
                다시 하기
              </button>
              <button
                onClick={handleShare}
                className="bg-gradient-to-r from-emerald-400 via-yellow-300 to-orange-300 hover:from-emerald-500 hover:to-yellow-400 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
              >
                결과 공유하기
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
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
    </>
  );
}
