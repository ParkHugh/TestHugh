// pages/TetoTest.jsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import questions from './questions';
import resultImages from './resultImages';
import mainImage from './images/main.png';
import resultDescriptions from './resultDescriptions';
import { useNavigate } from 'react-router-dom';



const calculateResult = (gender, answers) => {
  const aCount = Object.values(answers).filter(v => v === 'a').length;
  const bCount = Object.values(answers).filter(v => v === 'b').length;
  if (aCount >= 8) return gender === 'male' ? '테토남' : '테토녀';
  if (bCount >= 8) return gender === 'male' ? '에겐남' : '에겐녀';
  if (Math.abs(aCount - bCount) <= 2) return gender === 'male' ? '테겐남' : '테겐녀';
  return '중간 성향';
};

function TetoTest() {
  const [step, setStep] = useState('intro');
  const [gender, setGender] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  // 결과 로딩
  const [loadingTime, setLoadingTime] = useState(0);

  const startTest = () => setStep('gender');
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
      setTimeout(() => setStep('result'), 3000); // 3초 후 결과
    }
  };

  const restart = () => {
    setStep('intro');
    setGender(null);
    setCurrentQuestion(0);
    setAnswers({});
    setCopied(false);
  };

  // ✨ 최신 브라우저 공유 지원 + fallback (클립보드)
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "테토/테겐/에겐 테스트 결과",
        text: "나도 호르몬 유형 테스트 해봤어! 😄",
        url: window.location.href
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    }
  };

  const result = calculateResult(gender, answers);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-2">
      <AnimatePresence mode="wait">
        {step === 'intro' && (
          <motion.div
            key="intro"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full h-full"
            style={{ minHeight: '80vh' }}
          >
            <img
              src={mainImage}
              alt="메인"
              className="w-full max-w-2xl h-[40vh] object-contain mb-2"
              style={{
                borderRadius: '1.5rem',
                boxShadow: '0 2px 16px rgba(0,0,0,0.15)',
                background: 'none'
              }}
            />
            <h2 className="text-3xl font-bold mt-4 mb-2">테토 / 테겐 / 에겐 테스트</h2>
            <p className="mb-6 text-gray-600">나의 호르몬 성향을 알아보자!</p>
            <button
              onClick={startTest}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-8 rounded-lg shadow-md text-lg"
            >
              시작하기
            </button>
          </motion.div>
        )}

        {step === 'gender' && (
          <motion.div
            key="gender"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center"
          >
            <h3 className="text-xl font-semibold mb-4">당신의 성별은?</h3>
            <div className="space-x-4">
              <button
                onClick={() => selectGender('male')}
                className="bg-blue-400 hover:bg-blue-500 text-white py-2 px-4 rounded-lg"
              >
                남자
              </button>
              <button
                onClick={() => selectGender('female')}
                className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-4 rounded-lg"
              >
                여자
              </button>
            </div>
          </motion.div>
        )}

        {step === 'question' && questions[currentQuestion] && (
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.98 }}
            transition={{ duration: 0.36, ease: 'easeOut' }}
            className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md text-center"
          >
            {/* 진행 바 */}
            <div className="w-full mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-indigo-700">진행도</span>
                <span className="text-xs text-gray-500">{currentQuestion + 1} / {questions.length}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>
            <h3 className="text-lg font-bold mb-4">{questions[currentQuestion].text}</h3>
            <div className="space-y-4">
              <button
                onClick={() => handleAnswer('a')}
                className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-lg"
              >
                🅰️ {questions[currentQuestion].a}
              </button>
              <button
                onClick={() => handleAnswer('b')}
                className="w-full bg-indigo-400 hover:bg-indigo-500 text-white py-2 rounded-lg"
              >
                🅱️ {questions[currentQuestion].b}
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
            <div className="animate-pulse mb-5 mt-7">
              <svg width={56} height={56} viewBox="0 0 48 48" fill="none">
                <circle
                  cx={24}
                  cy={24}
                  r={20}
                  stroke="#818cf8"
                  strokeWidth={7}
                  strokeDasharray="47 50"
                  strokeLinecap="round"
                  opacity={0.22}
                />
                <circle
                  cx={24}
                  cy={24}
                  r={20}
                  stroke="#6366f1"
                  strokeWidth={7}
                  strokeDasharray="34 50"
                  strokeLinecap="round"
                >
                  <animateTransform attributeName="transform" type="rotate" values="0 24 24;360 24 24" dur="1s" repeatCount="indefinite" />
                </circle>
              </svg>
            </div>
            <p className="text-lg font-bold mb-3">결과를 분석하는 중...</p>
            {/* 👉 여기에 광고 코드 삽입 (나중에 애드센스 승인 후) */}
            <p className="text-xs text-gray-400 mt-6">잠시만 기다려주세요!</p>
          </motion.div>
        )}

        {step === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-indigo-600 mb-4">테스트 결과</h2>
            <p className="text-xl mb-4">당신은 <strong>{result}</strong>입니다!</p>
            <img
              src={resultImages[result]}
              alt={result}
              className="w-40 h-40 mx-auto mb-6 rounded-full shadow-md object-cover"
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
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-xl shadow-sm">
                  <h3 className="font-bold text-lg text-blue-600 mb-2">행동적 특성</h3>
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
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg mt-8"
            >
              다시 하기
            </button>
            <button
              onClick={handleShare}
              className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded-lg ml-2 mt-8"
            >
              공유하기
            </button>
            <button
              onClick={() => navigate('/')}
              className="bg-emerald-800 hover:bg-emerald-900 text-white py-2 px-4 rounded-lg ml-2 mt-8"
            >
              다른 테스트 해보기
            </button>
            {copied && (
              <div className="mt-2 text-sm text-green-600 animate-fade-in">URL이 복사되었습니다!</div>
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}

export default TetoTest;
