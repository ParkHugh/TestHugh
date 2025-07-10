import { useState, useEffect, useRef } from "react";
import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy, limit, startAfter, endBefore, getDocs } from "firebase/firestore";
import { TESTS_INFO } from "@/data/testInfo";
import Link from "next/link";
const PAGE_SIZE = 10; // 한 페이지당 보여줄 후기 개수 (10으로 바꿔도 됨)

export default function ReviewBoard() {
    const [nickname, setNickname] = useState("");
    const [testName, setTestName] = useState(TESTS_INFO[0].name);
    const [review, setReview] = useState("");
    const [rating, setRating] = useState(5);

    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [pageCursors, setPageCursors] = useState([]); // 각 페이지 커서
    const [currentPage, setCurrentPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    const lastVisibleRef = useRef(null);

    // 처음 페이지 불러오기
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
        await addDoc(collection(db, "reviews"), {
            nickname,
            testName,
            review,
            rating,
            createdAt: serverTimestamp(),
        });
        setNickname("");
        setReview("");
        setRating(5);
        setTestName(TESTS_INFO[0].name);
        setLoading(false);
        // 새 글 등록 후 첫 페이지로 이동
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
            // 이전 커서 활용 (이전 페이지 마지막 리뷰 기준)
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
        // 현재 페이지 마지막 리뷰의 커서를 저장
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
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        className="border rounded px-2 py-1 w-32"
                        maxLength={8}
                        placeholder="닉네임(8자)"
                        value={nickname}
                        onChange={e => setNickname(e.target.value)}
                    />
                    <select
                        className="border rounded px-2 py-1"
                        value={testName}
                        onChange={e => setTestName(e.target.value)}
                    >
                        {TESTS_INFO.map(({ name }) => (
                            <option key={name}>{name}</option>
                        ))}
                    </select>
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

            <div className="space-y-3">
                {pageLoading ? (
                    <div className="text-center py-6 text-gray-400">로딩 중...</div>
                ) : reviews.length === 0 ? (
                    <div className="text-gray-400 text-center py-8">아직 등록된 후기가 없습니다.</div>
                ) : (
                    <>
                        {reviews.map(r => (
                            <div key={r.id} className="bg-orange-50 rounded-lg px-4 py-3 shadow flex items-start gap-3">
                                <img
                                    src={getTestImage(r.testName)}
                                    alt={r.testName}
                                    className="w-20 h-20 md:w-16 md:h-16 rounded-xl border object-cover"
                                    style={{ minWidth: 80, minHeight: 80 }}
                                />
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-orange-800">{r.nickname}</span>
                                        <span className="text-xs text-gray-500">| {r.testName}</span>
                                    </div>
                                    {/* 별점 한 줄, 항상 아래쪽! */}
                                    <div className="flex items-center gap-1 mt-1 mb-1">
                                        {[1, 2, 3, 4, 5].map(n => (
                                            <span
                                                key={n}
                                                className={`text-2xl ${r.rating >= n ? "text-yellow-400" : "text-gray-300"}`}
                                            >★</span>
                                        ))}
                                    </div>
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
