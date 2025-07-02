import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <>
      <Head>
        <title>개인정보 처리방침 | Test 休</title>
        <meta name="description" content="Test 休 개인정보 처리방침. 본 사이트는 회원가입 등 개인정보를 일절 수집하지 않습니다." />
        <meta property="og:title" content="개인정보 처리방침 | Test 休" />
        <meta property="og:description" content="Test 休는 개인정보를 수집/저장하지 않으며, 광고(Google AdSense) 과정에서 구글이 일부 정보를 수집할 수 있습니다." />
        <meta property="og:url" content="https://test-hugh.co.kr/privacy" />
      </Head>
      <div className="max-w-2xl mx-auto py-12 px-6">
        <h1 className="text-2xl font-bold mb-6">개인정보 처리방침</h1>
        <p className="mb-4">
          <strong>Test 휴</strong>(이하 &quot;사이트&quot;)는 이용자의 개인정보를 일절 수집, 저장, 처리하지 않습니다.
        </p>
        <h2 className="font-semibold mt-6 mb-2">1. 개인정보 수집 및 이용</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>본 사이트는 회원가입, 로그인, 댓글, 게시판 등의 기능이 없으며, 어떠한 개인정보도 저장하거나 수집하지 않습니다.</li>
        </ul>
        <h2 className="font-semibold mt-6 mb-2">2. 쿠키/로그/트래킹</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>본 사이트는 별도의 쿠키, 로그, 웹비콘, 트래킹 도구를 사용하지 않습니다.</li>
          <li>
            단, 구글 애드센스 등 광고를 위해 외부 서비스의 쿠키가 사용될 수 있습니다. 해당 내용은 구글의&nbsp;
            <a
              className="underline text-blue-700"
              href="https://policies.google.com/technologies/ads?hl=ko"
              target="_blank"
              rel="noopener noreferrer"
            >
              광고정책
            </a>
            을 참고 바랍니다.
          </li>
        </ul>
        <h2 className="font-semibold mt-6 mb-2">3. 광고 노출</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>본 사이트는 구글 애드센스(Google AdSense) 광고를 노출할 수 있으며, 광고 과정에서 구글이 개인정보를 수집할 수 있습니다. 이는 사이트 관리자가 접근/보유하지 않으며, 자세한 내용은 구글 광고정책을 참고하십시오.</li>
        </ul>
        <h2 className="font-semibold mt-6 mb-2">4. 문의</h2>
        <ul className="list-disc pl-6 mb-4 text-sm">
          <li>기타 문의 사항은 이메일(hughparkhere@gmail.com)로 연락해 주시기 바랍니다.</li>
        </ul>
        <div className="mt-6 text-gray-500 text-xs">시행일: 2024년 7월 6일</div>
      </div>
    </>
  );
}
