// RunnerTestResultPage.jsx
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import results from './result';
import { Helmet } from 'react-helmet-async';

function getResultByType(type) {
  return results.find((res) => res.id === type) || results[0];
}

export default function RunnerTestResultPage() {
  const { type } = useParams();
  const navigate = useNavigate();
  const result = getResultByType(type);
  const best = result && getResultByType(result.bestMatch);
  const worst = result && getResultByType(result.worstMatch);

  // og meta 동적으로 적용
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-rose-200 flex flex-col items-center justify-center px-4 py-2">
      <Helmet>
        <title>{result.name} | 러너 성향 테스트</title>
        <meta name="description" content={result.description.replace(/(<([^>]+)>)/gi, '')} />
        <meta property="og:title" content={`${result.name} | 러너 성향 테스트`} />
        <meta property="og:description" content={result.description.replace(/(<([^>]+)>)/gi, '')} />
        <meta property="og:image" content={`https://test-hugh.co.kr/tests/runnertest/images/${result.id.toLowerCase()}.png`} />
        <meta property="og:url" content={`https://test-hugh.co.kr/runner/result/${result.id}`} />
      </Helmet>
      <div className="text-center">
        <h2 className="text-2xl font-black text-pink-400 mb-3 drop-shadow-lg animate-bounce">
          🏅 {result.name} 🏅
        </h2>
        <img
          src={result.image}
          alt={result.name}
          className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-rose-200 bg-white"
          style={{ filter: 'drop-shadow(0 0 18px #f99dbb88)' }}
        />
        <div className="bg-white/95 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-rose-300">
          <div className="text-lg font-bold text-pink-500 mb-2">
            {result.name}
          </div>
          <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
        </div>
        {/* 매칭 섹션 */}
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
          onClick={() => navigate('/runner')}
          className="bg-pink-400 hover:bg-pink-500 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md"
        >
          나도 테스트 해보기
        </button>
        <button
          onClick={() => navigate('/')}
          className="bg-white hover:bg-pink-50 text-pink-400 py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md border border-pink-200"
        >
          다른 테스트
        </button>
      </div>
    </div>
  );
}
