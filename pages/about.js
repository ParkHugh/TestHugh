export default function About() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold mb-4 text-green-800">TEST 휴(休) 서비스 소개</h2>
      <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
        <p className="text-gray-800 text-lg">
          <b>TEST 휴(休)</b>는 잠시 쉬어가는 시간 속에서
          자신과 타인을 더 이해할 수 있도록 다양한 심리 및 유형 테스트를 제공합니다.
        </p>
        <p className="mt-3 text-gray-700">
          가볍게 즐기며, 친구들과 공유하고, 다양한 유형의 테스트를 통해 스스로를 알아보세요.<br />
          모든 결과는 참고용이며, 재미와 자기이해의 계기를 만들어 드리고자 합니다.
        </p>
        <p className="mt-3 text-sm text-gray-500">
          ☺️ 앞으로도 꾸준히 다양한 테스트와 콘텐츠를 추가해 나갈 예정입니다.<br />
          🙏 궁금한 점이나 제안이 있다면 언제든 연락해 주세요!
        </p>
      </div>
      <div className="mt-5 text-sm text-gray-600">
        <b>문의:</b>{' '}
        <a
          href="mailto:hughparkhere@gmail.com"
          className="underline hover:text-emerald-700"
        >
          hughparkhere@gmail.com
        </a>
      </div>
    </div>
  );
}
