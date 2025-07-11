// /pages/api/rss.js
import { db } from "@/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { xml } from "xml"; // npm install xml

export default async function handler(req, res) {
  // Firestore에서 최신 30개 리뷰
  const reviewsQuery = query(
    collection(db, "reviews"),
    orderBy("createdAt", "desc"),
    limit(30)
  );
  const snapshot = await getDocs(reviewsQuery);

  const items = snapshot.docs.map(doc => {
    const r = doc.data();
    return {
      item: [
        { title: `${r.testName} - ${r.nickname}의 후기` },
        { description: r.review },
        { pubDate: r.createdAt ? new Date(r.createdAt.seconds * 1000).toUTCString() : "" },
        { guid: doc.id },
        { link: `https://test-hugh.co.kr/reviews` }
      ]
    };
  });

  const rss = {
    rss: [
      { _attr: { version: "2.0" } },
      {
        channel: [
          { title: "Test 휴 리뷰 최신 피드" },
          { link: "https://test-hugh.co.kr/reviews" },
          { description: "Test 휴의 유저 후기 최신글 피드입니다." },
          { language: "ko" },
          ...items
        ]
      }
    ]
  };

  res.setHeader("Content-Type", "application/xml");
  res.status(200).send(xml(rss, { declaration: true }));
}
