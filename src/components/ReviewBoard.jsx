import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, startAfter, getDocs } from "firebase/firestore";
import { TESTS_INFO } from "@/data/testInfo";
import Link from "next/link";
const PAGE_SIZE = 10;

export default function ReviewBoard() {
  const [nickname, setNickname] = useState("");
  const [testName, setTestName] = useState(TESTS_INFO[0].name);
  const [resultId, setResultId] = useState(""); // 추가: 결과유형(선택)
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(5);

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [pageCursors, setPageCursors] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);

  const lastVisibleRef = useRef(null);

  // 선택한 테스트 정보/결과리스트
  const currentTest = TESTS_INFO.find(t => t.name === testName);
  const resultsList = currentTest?.results || [];

  // 후기 목록 불러오기
  useEffect(() => {
    fetchPage(0);
    // eslint-disable-next-line
  }, []);

  // 후기 등록
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nickname.trim() || !review.trim()) return alert("닉네임과 후기를 입력해주세요!");
    if (review.length > 100) return alert("후기는 100자 이내로 작성해주세요.");
    if (nickname.length > 8) return alert("닉네임은 8자 이내로 작성해주세요.");
    setLoading(true);

    // 결과유형 정보
    let resultLabel = "", resultImage = "";
    if (resultId && resultsList.length > 0) {
      const sel = resultsList.find(r => r.id === resultId);
      if (sel) {
        resultLabel = sel.label;
        resultImage = sel.image;
      }
    }
    // 후기 등록
    await addDoc(collection(db, "reviews"), {
      nickname,
      testName,
      resultId: resultId || "",
      resultLabel,
      resultImage,
      review,
      rating,
      createdAt: serverTimestamp(),
    });

    setNickname("");
    setReview("");
    setRating(5);
    setTestName(TESTS_INFO[0].name);
    setResultId("");
    setLoading(false);
    fetchPage(0, true);
  };

  // 페이지별 후기 불러오기
  async function fetchPage(page, forceFirst = false) {
    setPageLoading(true);
    let q;
    if (page === 0 || forceFirst) {
      q = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc"),
        limit(PAGE_SIZE)
      );
    } else {
      const prevCursor = pageCursors[page - 1];
      if (!prevCursor) return;
      q = query(
        collection(db, "reviews"),
        orderBy("createdAt", "desc"),
        startAfter(prevCursor),
        limit(PAGE_SIZE)
      );
    }
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setReviews(data);
    if (snapshot.docs.length > 0) {
      const newCursors = [...pageCursors];
      newCursors[page] = snapshot.docs[snapshot.docs.length - 1];
      setPageCursors(newCursors);
      lastVisibleRef.current = snapshot.docs[snapshot.docs.length - 1];
    }
    setCurrentPage(page);
    setIsLastPage(snapshot.docs.length < PAGE_SIZE);
    setPageLoading(false);
  }

  function getTestImage(testName) {
    const info = TESTS_INFO.find(t => t.name === testName);
    return info ? info.image : "/images/default.png";
  }

  return (
    <div className="max-w-2xl mx-auto my-10 px-4">
      <div className="mb-3">
        <Link
          href="/"
          className="inline-flex items-center px-3 py-1 rounded-xl bg-green-100 hover:bg-green-200 text-green-700 font-semibold text-sm shadow transition"
        >
          ← 테스트 메인으로
        </Link>
      </div>
      <h2 className="text-2xl font-bold mb-4 text-green-800">📝 테스트 후기 게시판</h2>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow p-4 mb-8 space-y-3">
        <div className="flex flex-col md:flex-row gap-2 items-stretch md:items-center">
          <input
            type="text"
            className="border rounded px-2 py-1 w-full md:w-32"
            maxLength={8}
            placeholder="닉네임(8자)"
            value={nickname}
            onChange={e => setNickname(e.target.value)}
          />
          {/* 테스트 선택 */}
          <select
            className="border rounded px-2 py-1 w-full md:w-auto"
            value={testName}
            onChange={e => {
              setTestName(e.target.value);
              setResultId(""); // 테스트 바뀌면 결과유형 리셋
            }}
          >
            {TESTS_INFO.map(({ name }) => (
              <option key={name}>{name}</option>
            ))}
          </select>
          {/* 결과유형 선택 */}
          <select
            className="border rounded px-2 py-1 w-full md:w-auto"
            value={resultId}
            onChange={e => setResultId(e.target.value)}
          >
            <option value="">결과유형(선택)</option>
            {resultsList.map(({ id, label }) => (
              <option key={id} value={id}>{label}</option>
            ))}
          </select>
          {/* 별점 */}
          <div className="flex items-center justify-start md:justify-center flex-shrink-0 min-w-[90px]">
            {[1, 2, 3, 4, 5].map(n => (
              <span
                key={n}
                className={`cursor-pointer text-2xl md:text-xl ${rating >= n ? "text-yellow-400" : "text-gray-300"}`}
                onClick={() => setRating(n)}
                aria-label={`${n}점`}
                style={{ marginRight: n < 5 ? 2 : 0 }}
              >★</span>
            ))}
          </div>
        </div>
        <textarea
          className="border rounded w-full px-2 py-1"
          maxLength={100}
          placeholder="후기를 100자 이내로 입력해주세요!"
          value={review}
          onChange={e => setReview(e.target.value)}
        />
        <button
          disabled={loading}
          type="submit"
          className="bg-green-500 text-white px-6 py-2 rounded-xl shadow font-semibold hover:bg-green-700 transition"
        >
          {loading ? "등록 중..." : "후기 등록"}
        </button>
      </form>

      {/* 후기 목록 */}
      <div className="space-y-3">
        {pageLoading ? (
          <div className="text-center py-6 text-gray-400">로딩 중...</div>
        ) : reviews.length === 0 ? (
          <div className="text-gray-400 text-center py-8">아직 등록된 후기가 없습니다.</div>
        ) : (
          <>
            {reviews.map(r => (
              <div
                key={r.id}
                className="bg-orange-50 rounded-lg px-4 py-3 shadow flex gap-3 items-center"
              >
                {/* 이미지: 결과유형 있으면 결과유형 이미지, 없으면 테스트 메인 이미지 */}
                <img
                  src={r.resultImage || getTestImage(r.testName)}
                  alt={r.resultLabel || r.testName}
                  className="w-20 h-20 md:w-16 md:h-16 rounded-2xl object-contain"
                  style={{ minWidth: 90, minHeight: 80 }}
                />
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-orange-800">{r.nickname}</span>
                    <span className="text-xs text-gray-500">| {r.testName}</span>
                  </div>
                  {/* 별점 */}
                  <div className="flex items-center gap-1 mt-0.5 mb-0.5">
                    {[1, 2, 3, 4, 5].map(n => (
                      <span
                        key={n}
                        className={`text-lg md:text-xl ${r.rating >= n ? "text-yellow-400" : "text-gray-300"}`}
                      >★</span>
                    ))}
                  </div>
                  {/* 결과유형(선택) */}
                  {r.resultLabel &&
                    <div className="text-sm text-emerald-600 font-semibold mb-1">
                      {r.resultLabel}
                    </div>
                  }
                  {/* 후기 */}
                  <div className="text-gray-700">{r.review}</div>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center mt-4">
              <button
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                onClick={() => fetchPage(currentPage - 1)}
                disabled={currentPage === 0 || pageLoading}
              >
                이전
              </button>
              <span className="text-sm text-gray-500">
                {currentPage + 1} 페이지
              </span>
              <button
                className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold disabled:opacity-50"
                onClick={() => fetchPage(currentPage + 1)}
                disabled={isLastPage || pageLoading}
              >
                다음
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
