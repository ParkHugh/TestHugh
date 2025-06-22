// src/tests/tetotest/TetoTestResultPage.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import resultImages from "./resultImages";
import resultDescriptions from "./resultDescriptions";

function TetoTestResultPage() {
  const { type } = useParams(); // 예: '테토남'
  const navigate = useNavigate();

  const result = type;
  const desc = resultDescriptions[result];
  const image = resultImages[result];

  if (!desc) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-xl shadow p-8">
        <h2 className="text-2xl font-bold mb-2">잘못된 결과 값입니다.</h2>
        <button onClick={() => navigate('/tetotest')} className="text-blue-600 underline">테스트 하러가기</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-yellow-50 to-orange-50 flex flex-col items-center justify-center px-4 py-2">
      <h2 className="text-3xl font-extrabold text-emerald-500 mb-4 drop-shadow-lg animate-bounce">
        🎉 당신의 호르몬 유형 🎉
      </h2>
      <p className="text-xl mb-4 text-emerald-800">
        당신은 <span className="font-extrabold">{result}</span> 입니다!
      </p>
      <img
        src={image}
        alt={result}
        className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-emerald-300 bg-white"
        style={{ filter: 'drop-shadow(0 0 18px #86efac99)' }}
      />
      <div className="mx-auto max-w-lg space-y-5 text-left">
        <div className="bg-orange-50 border-l-4 border-orange-400 p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg text-orange-600 mb-2">성격적 특성</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {desc.성격적특성.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="bg-emerald-50 border-l-4 border-emerald-400 p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg text-emerald-600 mb-2">행동적 특성</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {desc.행동적특성.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
        <div className="bg-pink-50 border-l-4 border-pink-400 p-4 rounded-xl shadow-sm">
          <h3 className="font-bold text-lg text-pink-600 mb-2">연애 스타일</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            {desc.연애스타일.map((item, idx) => <li key={idx}>{item}</li>)}
          </ul>
        </div>
      </div>
      <button
        onClick={() => navigate('/tetotest')}
        className="bg-white hover:bg-emerald-100 text-emerald-400 py-2 px-6 rounded-xl font-bold mt-8 shadow-md border border-emerald-200"
      >
        다시 하기
      </button>
      <button
        onClick={() => navigate('/')}
        className="bg-emerald-500 hover:bg-emerald-600 text-white py-2 px-6 rounded-xl font-bold ml-2 mt-8 shadow-md"
      >
        다른 테스트 해보기
      </button>
    </div>
  );
}

export default TetoTestResultPage;
