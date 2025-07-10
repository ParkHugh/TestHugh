// src/pages/faq.jsx
import Head from "next/head";
import { useState } from "react";
import Link from "next/link";
const faqList = [
  {
    q: "Q. 모든 심리테스트는 무료인가요?",
    a: "네! Test 休의 모든 심리테스트와 결과 페이지는 100% 무료로 제공됩니다. 회원가입이나 결제 없이 언제든 자유롭게 이용하실 수 있습니다.",
  },
  {
    q: "Q. 테스트 결과가 저장되나요? 개인정보는 안전한가요?",
    a: "테스트 결과는 서버에 저장되지 않으며, 입력하신 답변/정보는 테스트 완료 후 즉시 폐기됩니다. 개인정보는 따로 수집하지 않으니 안심하고 이용하셔도 됩니다.",
  },
  {
    q: "Q. 테스트 결과가 실제 진단과 일치하나요?",
    a: "Test 休의 심리테스트는 자기 이해와 재미를 위한 참고용이며, 전문가의 진단을 대체하지 않습니다. 심리적 고민이 있다면 반드시 전문가의 도움을 받으시기 바랍니다.",
  },
  {
    q: "Q. 결과가 맘에 안 들면 다시 할 수 있나요?",
    a: "네! 언제든지 원하는 만큼 다시 테스트를 진행할 수 있습니다. 답변을 바꾸면 다른 결과가 나올 수도 있으니 여러 번 시도해보세요.",
  },
  {
    q: "Q. 모바일, 태블릿, PC 모두 사용 가능한가요?",
    a: "Test 休는 모든 기기에서 최적화되어 작동합니다. 모바일, 태블릿, PC 등 다양한 환경에서 편하게 테스트를 즐겨보세요.",
  },
  {
    q: "Q. 추가로 궁금한 점은 어디로 문의하나요?",
    a: "사이트 하단의 문의하기 버튼이나 이메일(hughparkhere@gmail.com)로 언제든 질문해 주세요. 빠르게 답변드리겠습니다!",
  },
];

export default function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <>
      <Head>
        <title>자주 묻는 질문(FAQ) | Test 休</title>
        <meta name="description" content="Test 休 심리테스트 이용에 대한 FAQ를 확인하세요!" />
      </Head>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center px-3 py-1 rounded-xl bg-green-100 hover:bg-green-200 text-green-800 font-semibold text-sm shadow transition"
          >
            ← 테스트 메인으로
          </Link>
        </div>
        <h1 className="text-3xl font-bold mb-8 text-green-800">❓ 자주 묻는 질문 (FAQ)</h1>
        <div className="space-y-4">
          {faqList.map((item, i) => (
            <div
              key={i}
              className="border rounded-xl shadow transition bg-white"
            >
              <button
                onClick={() => setOpenIdx(openIdx === i ? null : i)}
                className="flex items-center w-full justify-between px-6 py-4 text-left font-semibold text-orange-800 text-lg focus:outline-none"
              >
                <span>{item.q}</span>
                <span className="ml-2">
                  {openIdx === i ? "▲" : "▼"}
                </span>
              </button>
              {openIdx === i && (
                <div className="px-6 pb-4 text-gray-700 text-base">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
