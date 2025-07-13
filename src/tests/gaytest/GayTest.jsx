// GayTest.jsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';

import questions from '@/tests/gaytest/questions';
import results from '@/tests/gaytest/result';
import meta from '@/tests/gaytest/meta';

import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/firebase';

// 점수: a=2, b=1, c=0 (항상 이 순서라 가정)
const answerScore = [2, 1, 0];

function getResultIdx(userAnswers) {
  const total = Object.values(userAnswers).reduce((sum, v) => sum + v, 0);
  if (total <= 4) return 0;
  if (total <= 9) return 1;
  if (total <= 14) return 2;
  if (total <= 19) return 3;
  return 4;
}

export default function GayTest() {
  const INITIAL_COUNT = 8000;
  const [step, setStep] = useState('intro');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const [count, setCount] = useState(INITIAL_COUNT);
  const [showHidden, setShowHidden] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchCount() {
      try {
        const ref = doc(db, 'testCounts', 'gayTest');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setCount(INITIAL_COUNT + (snap.data().count || 0));
        }
      } catch (e) {}
    }
    fetchCount();
  }, []);

  const startTest = async () => {
    try {
      const ref = doc(db, 'testCounts', 'gayTest');
      await updateDoc(ref, { count: increment(1) });
    } catch (e) {}
    setStep('question');
  };

  const handleAnswer = (score) => {
    const qid = questions[currentQuestion].id;
    setUserAnswers((prev) => ({ ...prev, [qid]: score }));

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setStep('loading');
      setTimeout(() => setStep('result'), 2100 + Math.random() * 900);
    }
  };

  const restart = () => {
    setStep('intro');
    setCurrentQuestion(0);
    setUserAnswers({});
    setCopied(false);
  };

  const resultIdx = step === 'result' ? getResultIdx(userAnswers) : null;
  const resultData = resultIdx !== null ? results[resultIdx] : null;

  // 공유 버튼
  const handleShare = () => {
    if (step !== 'result' || !resultData) return;
    const shareUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}${meta.path}/result/${resultIdx}`
        : '';
    if (navigator.share) {
      navigator
        .share({
          title: "게이력 테스트 | Test 休",
          text: "내 안의 숨겨진 감성 게이력 테스트 결과",
          url: shareUrl,
        })
        .catch(() => {});
    } else if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#541a88] via-[#35165c] to-black flex flex-col items-center justify-center px-4 py-2">
      <Head>
        <title>게이력 테스트 | Test 休</title>
        <meta
          name="description"
          content="찐 남자도, 찐 감성도 아닌…? 12가지 질문으로 알아보는 나의 숨은 게이력! 요즘 남자 매력의 새로운 공식, 지금 테스트해보세요."
        />
        <meta property="og:title" content="게이력 테스트 | Test 休" />
        <meta
          property="og:description"
          content="12가지 질문으로 감성/상남자 두 마리 토끼를 잡는 나의 숨은 게이력! 유쾌하고 현실감 있는 유형 결과로 친구랑 공유해보세요!"
        />
        <meta property="og:image" content="https://test-hugh.co.kr/images/gaytest/main.png" />
        <meta property="og:url" content="https://test-hugh.co.kr/gaytest" />
      </Head>

      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full"
            style={{ minHeight: '78vh' }}
          >
            <img
              src={meta.image}
              alt="게이력 테스트"
              className="w-full max-w-lg h-[36vh] object-contain mb-3 drop-shadow-xl rounded-2xl"
            />
            <h2 className="text-3xl font-black mt-2 mb-2 text-fuchsia-300 tracking-tight drop-shadow-lg">
              게이 vs 상남자 판별 테스트
            </h2>
            <p className="mb-8 text-gray-200 text-lg text-center font-medium max-w-xl">
                “당신이 생각하는 남성성의 정의는 무엇인가요?”<br />
              전통적인 남자다움, 알파메일, 투박함, 가부장 이런게 진정한 남성성일까? <br />
              <b className="text-fuchsia-400">감성있는 남자에게 '게이냐?' 라고 묻는 요즘..</b> <br />
              <span className="font-bold text-fuchsia-300">
                요즘 시대 남자의 관리, 감성, 디테일, 그리고 남다른 센스까지. <br />
              </span>
              <span className="text-gray-400">
                12가지 질문으로 남성성과 게이력을 확인해보세요!<br />
                (성 정체성, 성적지향 과는 무관한 오락용으로만 생각해주세요 🏳️‍🌈)
              </span>
            </p>
            <p className="mb-6 text-fuchsia-300 text-sm font-semibold">
              💅 {count.toLocaleString()}명이 참여했어요
            </p>
            <button
              onClick={startTest}
              className="bg-gradient-to-r from-fuchsia-800 via-purple-700 to-purple-600 hover:from-fuchsia-700 hover:to-purple-500 text-white py-3 px-12 rounded-2xl text-lg font-bold shadow-lg animate-bounce-slow"
            >
              테스트 시작하기 🌈
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
            transition={{ duration: 0.32, ease: 'easeOut' }}
            className="bg-[#22163a]/95 shadow-2xl rounded-3xl p-7 w-full max-w-md text-center border-2 border-fuchsia-400/40 relative"
          >
            {/* 진행 바 */}
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-fuchsia-300 tracking-wider">PROGRESS</span>
                <span className="text-xs text-gray-400">
                  {currentQuestion + 1} / {questions.length}
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-fuchsia-400 via-purple-500 to-purple-900 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <h3 className="text-lg font-black mb-5 text-white tracking-wide shadow-inner">
              {questions[currentQuestion].text}
            </h3>
            <div className="space-y-3">
              {['a', 'b', 'c'].map((key, idx) =>
                questions[currentQuestion][key] ? (
                  <button
                    key={key}
                    onClick={() => handleAnswer(answerScore[idx])}
                    className={`
                      w-full py-3 rounded-xl font-bold text-base
                      transition-all duration-200 shadow-xl
                      ${idx === 0
                        ? 'bg-fuchsia-600 text-white hover:bg-fuchsia-700'
                        : idx === 1
                        ? 'bg-purple-700 text-white hover:bg-purple-900'
                        : 'bg-violet-900 text-gray-300 hover:bg-black'
                      }
                    `}
                  >
                    {questions[currentQuestion][key].label}
                  </button>
                ) : null
              )}
            </div>
            {/* 숨은 질문 전체 보기 */}
            <div className="mt-7 text-center">
              <button
                onClick={() => setShowHidden((v) => !v)}
                className="text-xs text-fuchsia-400 underline hover:text-fuchsia-200 transition font-bold"
              >
                {showHidden ? '질문/답변 전체 닫기 ▲' : '질문/답변 전체 펼치기 ▼'}
              </button>
              {showHidden && (
                <div className="bg-[#2a1d46]/80 rounded-xl mt-5 p-3 max-h-60 overflow-y-auto border border-fuchsia-400 text-left text-xs text-fuchsia-100 font-semibold shadow-inner">
                  {questions.map((q, qi) => (
                    <div key={q.id} className="mb-3">
                      <span className="text-fuchsia-200 font-bold">{qi + 1}. {q.text}</span>
                      <ul className="ml-2 mt-1 space-y-1">
                        {['a', 'b', 'c'].map(
                          (key) => q[key]?.label && <li key={key}>- {q[key].label}</li>
                        )}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
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
            className="flex flex-col items-center justify-center min-h-[320px]"
          >
            <div className="animate-spin mb-6 mt-9">
              <div className="w-12 h-12 border-4 border-fuchsia-500 border-t-transparent rounded-full"></div>
            </div>
            <p className="text-lg font-black text-fuchsia-200">결과 분석 중...</p>
          </motion.div>
        )}

        {/* 결과 */}
        {step === 'result' && resultData && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <img
              src={resultData.image}
              alt={resultData.type}
              className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-fuchsia-600/60"
              style={{ filter: 'drop-shadow(0 0 18px #c026d3cc)' }}
            />
            <div className="text-xl font-bold text-fuchsia-300 mb-2">{resultData.type}</div>
            <div
              className="bg-zinc-900/80 rounded-xl px-6 py-5 text-left mx-auto max-w-lg border-l-4 border-fuchsia-400 text-gray-200"
              dangerouslySetInnerHTML={{ __html: resultData.description }}
            ></div>
            <div className="mt-6">
              <button
                onClick={restart}
                className="bg-zinc-800 hover:bg-zinc-700 text-white py-2 px-6 rounded-xl font-bold mt-3"
              >
                다시 하기
              </button>
              <button
                onClick={handleShare}
                className="bg-fuchsia-800 hover:bg-fuchsia-700 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3"
              >
                결과 공유하기
              </button>
              <button
                onClick={() => router.push('/')}
                className="bg-purple-700 hover:bg-purple-800 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3"
              >
                다른 테스트 해보기
              </button>
              {copied && <p className="mt-2 text-sm text-green-400">링크가 복사되었습니다!</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
