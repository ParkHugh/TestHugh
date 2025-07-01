// pages/results.js
import { useState } from "react";
import Link from "next/link";

// 실제 경로에 맞게 수정!
import tetotestMeta from "@/tests/tetotest/meta";
import tetotestResults from "@/tests/tetotest/resultDescriptions";
import tetotestImages from "@/tests/tetotest/resultImages";

import sociopathMeta from "@/tests/sociopathtest/meta";
import sociopathResults from "@/tests/sociopathtest/resultDescriptions";
import sociopathImages from "@/tests/sociopathtest/resultImages";

import romanticMeta from "@/tests/romantictest/meta";
import romanticResults from "@/tests/romantictest/result";

import travelMeta from "@/tests/traveltest/meta";
import travelResults from "@/tests/traveltest/result";

import runnerMeta from "@/tests/runnertest/meta";
import runnerResults from "@/tests/runnertest/result";

// (색상 헬퍼)
const color = (accent, type = "text") => {
  const colors = {
    red: { bg: "bg-red-50", text: "text-red-500" },
    pink: { bg: "bg-pink-50", text: "text-pink-400" },
    blue: { bg: "bg-blue-50", text: "text-blue-500" },
    emerald: { bg: "bg-emerald-50", text: "text-emerald-700" },
    rose: { bg: "bg-rose-50", text: "text-rose-500" },
  };
  return colors[accent]?.[type] || "";
};

// 오브젝트형 결과 렌더
const ObjectResultItem = ({ keyName, res, image }) => (
  <div key={keyName} className="flex items-center gap-4 border-b py-3 last:border-b-0">
    {image && (
      <img
        src={image}
        alt={keyName}
        className="w-16 h-16 object-cover rounded-xl border border-emerald-100 bg-gray-50"
      />
    )}
    <div className="flex-1">
      <div className="font-bold text-base mb-1 text-emerald-800">{keyName}</div>
      <div className="mb-1">
        <span className="font-semibold text-green-600 text-xs mr-1">성격적 특성</span>
        <span className="text-gray-700 text-xs">{res.성격적특성?.join(" / ")}</span>
      </div>
      <div className="mb-1">
        <span className="font-semibold text-blue-600 text-xs mr-1">행동적 특성</span>
        <span className="text-gray-700 text-xs">{res.행동적특성?.join(" / ")}</span>
      </div>
      <div>
        <span className="font-semibold text-pink-600 text-xs mr-1">연애스타일</span>
        <span className="text-gray-700 text-xs">{res.연애스타일?.join(" / ")}</span>
      </div>
    </div>
  </div>
);

// 배열형 결과 렌더
const ArrayResultItem = ({ res, image, accent }) => (
  <div key={res.id || res.name} className="flex items-center gap-4 border-b py-3 last:border-b-0">
    {image && (
      <img
        src={image}
        alt={res.name}
        className="w-16 h-16 object-cover rounded-xl border border-red-100 bg-gray-50"
      />
    )}
    {!image && res.image && (
      <img
        src={res.image}
        alt={res.name}
        className="w-16 h-16 object-cover rounded-xl border border-blue-100 bg-blue-50"
      />
    )}
    <div>
      <div className={`font-bold text-base mb-1 ${color(accent)}`}>{res.name}</div>
      <div
        className="text-gray-700 text-xs"
        dangerouslySetInnerHTML={{ __html: res.description }}
      />
    </div>
  </div>
);

const testResultSets = [
  {
    meta: tetotestMeta,
    results: tetotestResults,
    images: tetotestImages,
    isObject: true,
    description: "호르몬 유형 테스트의 다양한 결과와 상세 특성을 확인할 수 있습니다.",
    accent: "emerald",
  },
  {
    meta: sociopathMeta,
    results: sociopathResults,
    images: sociopathImages,
    isObject: false,
    description: "직장인 소시오패스 테스트의 결과별 해설과 이미지를 한 눈에!",
    accent: "red",
  },
  {
    meta: romanticMeta,
    results: romanticResults,
    images: null,
    isObject: false,
    description: "낭만 vs 현실 밸런스게임의 나의 결과와 설명을 볼 수 있습니다.",
    accent: "pink",
  },
  {
    meta: travelMeta,
    results: travelResults,
    images: null,
    isObject: false,
    description: "여행 성향 테스트의 결과별 특징과 추천 여행지를 확인해보세요!",
    accent: "blue",
  },
  {
    meta: runnerMeta,
    results: runnerResults,
    images: null,
    isObject: false,
    description: "러닝 성향 테스트의 8가지 유형별 특징과 매칭 궁합까지 한 눈에!",
    accent: "pink",
  },
];

export default function ResultsPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="max-w-2xl mx-auto p-6 pb-16">
      <h1 className="text-3xl font-bold mb-6 text-emerald-600">테스트별 결과 유형 모아보기</h1>
      <p className="mb-9 text-black-400">각 테스트별 결과를 클릭해서 상세 해설과 이미지를 볼 수 있습니다.</p>
      <div className="space-y-4">
        {testResultSets.map(({ meta, results, images, isObject, description, accent }, i) => (
          <div key={meta.id} className={`border rounded-xl shadow ${color(accent, "bg")} bg-white`}>
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
            {openIndex === i && (
              <div className="px-6 pb-6">
                <p className={`mb-4 ${color(accent)}`}>{description}</p>
                <div className="grid gap-6">
                  {isObject
                    ? Object.entries(results).map(([key, res]) => (
                        <ObjectResultItem key={key} keyName={key} res={res} image={images?.[key]} />
                      ))
                    : results.map((res, idx) => (
                        <ArrayResultItem key={res.id || res.name} res={res} image={images?.[idx]} accent={accent} />
                      ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-12">
        <Link
          href="/"
          className="bg-emerald-500 hover:bg-green-500 text-white font-bold px-8 py-3 rounded-2xl text-lg shadow-lg transition"
        >
          🏁 테스트 하러가기
        </Link>
      </div>
    </div>
  );
}
