// src/tests/traveltest/TravelTestResultPage.jsx

import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import results from "./result";
import { Helmet } from "react-helmet-async";

function getResultByType(type) {
  return results.find((res) => res.id === type) || results[0];
}

export default function TravelTestResultPage() {
  const { type } = useParams();
  const navigate = useNavigate();

  const result = getResultByType(type);
  const best = result && getResultByType(result.bestMatch);
  const worst = result && getResultByType(result.worstMatch);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-yellow-50 flex flex-col items-center justify-center px-4 py-8">
      <Helmet>
        <title>여행 성향 테스트 | {result.name} | Test 休</title>
        <meta name="description" content={result.name + ' 유형의 여행 스타일, 추천 여행지까지!'} />
        <meta property="og:title" content={`여행 성향 테스트 | ${result.name} | Test 休`} />
        <meta property="og:description" content={result.name + ' 유형의 여행 스타일, 추천 여행지까지!'} />
        <meta property="og:image" content={result.image} />
        <meta property="og:url" content={`https://test-hugh.co.kr/traveltest/result/${type}`} />
      </Helmet>
      <div className="flex flex-col items-center w-full">
        <h2 className="text-2xl font-black text-cyan-500 mb-3 drop-shadow-lg animate-bounce">
          🧳 나의 여행 유형 🧳
        </h2>
        <img
          src={result.image}
          alt={result.name}
          className="w-44 h-44 mx-auto mb-7 rounded-2xl shadow-xl object-cover border-4 border-cyan-200 bg-white"
          style={{ filter: 'drop-shadow(0 0 18px #60e7ff99)' }}
        />
        <div className="mb-3">
          <span className="inline-block bg-cyan-400 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide mb-2">
            {result.name}
          </span>
        </div>
        <div className="bg-white/95 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-cyan-300">
          <div className="text-lg font-bold text-cyan-500 mb-2">
            {result.name}
          </div>
          <div className="text-base text-gray-700" dangerouslySetInnerHTML={{ __html: result.description }} />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-5 mb-4 mt-2">
          {best && (
            <div className="flex flex-col items-center">
              <span className="text-sm text-cyan-500 font-semibold mb-1">환상의 여행메이트</span>
              <img src={best.image} alt={best.name} className="w-20 h-20 rounded-xl mb-1 border-2 border-cyan-200" />
              <span className="text-xs font-bold text-cyan-500">{best.name}</span>
            </div>
          )}
          {worst && (
            <div className="flex flex-col items-center">
              <span className="text-sm text-gray-400 font-semibold mb-1">환장의 여행메이트</span>
              <img src={worst.image} alt={worst.name} className="w-20 h-20 rounded-xl mb-1 border-2 border-gray-200" />
              <span className="text-xs font-bold text-gray-500">{worst.name}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate("/traveltest")}
          className="bg-cyan-400 hover:bg-cyan-500 text-white py-2 px-6 rounded-xl font-bold mt-5 shadow-md"
        >
          나도 다시 테스트하기
        </button>
        <button
          onClick={() => navigate("/")}
          className="bg-white hover:bg-cyan-50 text-cyan-400 py-2 px-6 rounded-xl font-bold ml-2 mt-3 shadow-md border border-cyan-200"
        >
          다른 테스트 보러가기
        </button>
      </div>
    </div>
  );
}
