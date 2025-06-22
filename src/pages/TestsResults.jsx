import React, { useState } from "react";
import { Link } from 'react-router-dom';
import tetotestMeta from "../tests/tetotest/meta";
import tetotestResults from "../tests/tetotest/resultDescriptions";
import tetotestImages from "../tests/tetotest/resultImages";

import sociopathMeta from "../tests/sociopathtest/meta";
import sociopathResults from "../tests/sociopathtest/resultDescriptions";
import sociopathImages from "../tests/sociopathtest/resultImages";

import romanticMeta from "../tests/romantictest/meta";
import romanticResults from "../tests/romantictest/result"; // 배열 (image 포함)
 
const testResultSets = [
  {
    meta: tetotestMeta,
    results: tetotestResults,
    images: tetotestImages,
    isObject: true,
    description: "호르몬 유형 테스트의 다양한 결과와 상세 특성을 확인할 수 있습니다.",
    accent: 'emerald',  // 추가
  },
  {
    meta: sociopathMeta,
    results: sociopathResults,
    images: sociopathImages,
    isObject: false,
    description: "직장인 소시오패스 테스트의 결과별 해설과 이미지를 한 눈에!",
    accent: 'red', // 추가
  },
  {
    meta: romanticMeta,
    results: romanticResults,
    images: null, // 이미지가 results 배열에 포함됨!
    isObject: false,
    description: "낭만 vs 현실 밸런스게임의 나의 결과와 설명을 볼 수 있습니다.",
    accent: 'pink', // 추가
  },
];

export default function TestsResults() {
  const [openIndex, setOpenIndex] = useState(null);

  // 각 테스트별 테마(색상) 처리
  const color = (accent, type = 'text') => {
    if (accent === 'red') return type === 'bg' ? 'bg-red-50' : 'text-red-500';
    if (accent === 'pink') return type === 'bg' ? 'bg-pink-50' : 'text-pink-400';
    return type === 'bg' ? 'bg-emerald-50' : 'text-emerald-700';
  };

  return (
    <div className="max-w-2xl mx-auto p-6 pb-16">
      <h1 className="text-3xl font-bold mb-6 text-emerald-600">테스트별 결과 유형 모아보기</h1>
      <p className="mb-9 text-black-400">각 테스트별 결과를 클릭해서 상세 해설과 이미지를 볼 수 있습니다.</p>
      <div className="space-y-4">
        {testResultSets.map(({ meta, results, images, isObject, description, accent }, i) => (
          <div key={meta.id} className={`border rounded-xl shadow ${color(accent, 'bg')} bg-white`}>
            {/* 테스트 목록 아코디언 헤더 */}
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className={`flex w-full items-center justify-between px-6 py-4 font-bold text-lg ${color(accent)} focus:outline-none`}
            >
              <span className="flex items-center gap-2">
                <img src={meta.image} alt={meta.title} className="w-8 h-8 rounded-md object-cover border border-emerald-200" />
                {meta.title}
              </span>
              <span className="text-xl">{openIndex === i ? "▲" : "▼"}</span>
            </button>
            {/* 펼쳐진 결과 상세 */}
            {openIndex === i && (
              <div className="px-6 pb-6">
                <p className={`mb-4 ${color(accent)}`}>{description}</p>
                <div className="grid gap-6">
                  {isObject
                    ? Object.entries(results).map(([key, res], idx) => (
                        <div key={key} className="flex items-center gap-4 border-b py-3 last:border-b-0">
                          {images && images[key] && (
                            <img
                              src={images[key]}
                              alt={key}
                              className="w-16 h-16 object-cover rounded-xl border border-emerald-100 bg-gray-50"
                            />
                          )}
                          <div className="flex-1">
                            <div className="font-bold text-base mb-1 text-emerald-800">{key}</div>
                            <div className="mb-1">
                              <span className="font-semibold text-green-600 text-xs mr-1">성격적 특성</span>
                              <span className="text-gray-700 text-xs">{res.성격적특성?.join(' / ')}</span>
                            </div>
                            <div className="mb-1">
                              <span className="font-semibold text-blue-600 text-xs mr-1">행동적 특성</span>
                              <span className="text-gray-700 text-xs">{res.행동적특성?.join(' / ')}</span>
                            </div>
                            <div>
                              <span className="font-semibold text-pink-600 text-xs mr-1">연애스타일</span>
                              <span className="text-gray-700 text-xs">{res.연애스타일?.join(' / ')}</span>
                            </div>
                          </div>
                        </div>
                      ))
                    : results.map((res, idx) => (
                        <div key={res.id || res.name} className="flex items-center gap-4 border-b py-3 last:border-b-0">
                          {/* 이미지 처리 (romanticResults는 res.image) */}
                          {images
                            ? (images[res.id || idx] || images[idx]) && (
                                <img
                                  src={images[res.id || idx] || images[idx]}
                                  alt={res.name}
                                  className="w-16 h-16 object-cover rounded-xl border border-red-100 bg-gray-50"
                                />
                              )
                            : res.image && (
                                <img
                                  src={res.image}
                                  alt={res.name}
                                  className="w-16 h-16 object-cover rounded-xl border border-pink-100 bg-pink-50"
                                />
                              )}
                          <div>
                            <div className={`font-bold text-base mb-1 ${color(accent)}`}>{res.name}</div>
                            <div className="text-gray-700 text-xs">{res.description}</div>
                          </div>
                        </div>
                      ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Link
          to="/"
          className="bg-emerald-500 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-2xl text-lg shadow-lg transition"
        >
          🏁 테스트 하러가기
        </Link>
      </div>
    </div>
  );
}
