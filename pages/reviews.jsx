// src/pages/reviews.jsx

import Head from "next/head";
import ReviewBoard from "@/components/ReviewBoard";

export default function ReviewsPage() {
  return (
    <>
      <Head>
        <title>테스트 후기 게시판 | Test 休</title>
        <meta name="description" content="실제 유저들의 심리테스트 후기와 평가를 확인해보세요!" />
      </Head>
      <ReviewBoard />
    </>
  );
}
