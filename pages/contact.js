export default function Contact() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-10 bg-white">
      <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-3">Contact</h1>
      <p className="text-gray-700 mb-5 text-center">
        궁금한 점, 제안, 광고 문의 등이 있으시면 아래 메일로 언제든 연락주세요.
      </p>
      <a
        href="mailto:hughparkhere@gmail.com"
        className="text-lg font-mono text-green-600 bg-green-50 px-4 py-2 rounded-lg shadow hover:bg-green-100 transition"
      >
        hughparkhere@gmail.com
      </a>
      <div className="mt-8 text-sm text-gray-400">
        😆 빠르게 답변드릴 수 있도록 노력하겠습니다 :)
      </div>
    </div>
  );
}
