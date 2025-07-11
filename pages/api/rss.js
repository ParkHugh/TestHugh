// /pages/api/rss.js
import { db } from "@/firebase";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import xml from "xml"; // <-- default import

export default async function handler(req, res) {
  try {
    const reviewsQuery = query(
      collection(db, "reviews"),
      orderBy("createdAt", "desc"),
      limit(30)
    );
    const snapshot = await getDocs(reviewsQuery);

    const items = snapshot.docs.map(doc => {
      const r = doc.data();
      // createdAt 유효성 검사
      let pubDate = "";
      if (r.createdAt && r.createdAt.seconds) {
        pubDate = new Date(r.createdAt.seconds * 1000).toUTCString();
      }
      return {
        item: [
          { title: `${r.testName} - ${r.nickname}의 후기` },
          { description: r.review },
          { pubDate },
          { guid: doc.id },
          { link: `https://www.test-hugh.co.kr/reviews` }
        ]
      };
    });

    const rss = {
      rss: [
        { _attr: { version: "2.0" } },
        {
          channel: [
            { title: "Test 휴 리뷰 최신 피드" },
            { link: "https://www.test-hugh.co.kr/reviews" },
            { description: "Test 휴의 유저 후기 최신글 피드입니다." },
            { language: "ko" },
            ...items
          ]
        }
      ]
    };

    res.setHeader("Content-Type", "application/xml; charset=utf-8");
    res.status(200).send(xml(rss, { declaration: true, indent: "  " }));
  } catch (err) {
    console.error(err);
    res.status(500).send("피드 생성 중 오류가 발생했습니다.");
  }
}
