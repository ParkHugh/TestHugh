// pages/attachmenttest/result/[type].js
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import results from '@/tests/attachmenttest/result';
import meta from '@/tests/attachmenttest/meta';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

// Chart.js는 브라우저에서만 등록
if (typeof window !== 'undefined') {
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
}

// CSR 로드
const Bar = dynamic(() => import('react-chartjs-2').then(m => m.Bar), { ssr: false });

// s 파라미터 복원 함수 (서버/클라이언트 겸용)
function decodeScoresParam(s) {
  if (!s || typeof s !== 'string') return null;
  try {
    const base64 = decodeURIComponent(s);
    const json =
      typeof window === 'undefined'
        ? Buffer.from(base64, 'base64').toString('utf8')
        : decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(json);
    return parsed?.scores ?? null;
  } catch {
    return null;
  }
}

export default function ResultPage() {
  const router = useRouter();
  const { type, s } = router.query;
  const [copied, setCopied] = useState(false);

  // 결과 메타 찾기 (없으면 첫 번째로)
  const resultData = useMemo(
    () => results.find(r => r.id === type) || results[0],
    [type]
  );

  // 점수 디코드 → 그래프 데이터 준비
  const scores = useMemo(() => decodeScoresParam(s), [s]);

  const labels = ['안정형', '회피형', '불안형', '혼란형'];
  const orderedScores = useMemo(() => {
    if (!scores) return null;
    const arr = [
      Number(scores.secure ?? 0),
      Number(scores.avoidant ?? 0),
      Number(scores.anxious ?? 0),
      Number(scores.disorganized ?? 0),
    ];
    const min = Math.min(...arr);
    return arr.map(v => v - min + 1); // 시각차 강조 (최소 1)
  }, [scores]);

  const chartData = useMemo(() => {
    if (!orderedScores) return null;
    const barColors = ['#FFB6C1', '#FFFACD', '#F0E68C', '#E6E6FA']; // 연핑크/연노랑/카키/연보라
    return {
      labels,
      datasets: [
        {
          label: '비율',
          data: orderedScores,
          backgroundColor: barColors,
          borderColor: barColors,
          borderWidth: 1,
        },
      ],
    };
  }, [orderedScores]);

  // 현재 URL(쿼리 포함)을 공유/복사 => s 파라미터 포함 시 그래프까지 그대로 복원됨
  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (!shareUrl) return;
    if (navigator.share) {
      navigator.share({
        title: '애착 스타일 테스트 결과',
        text: '내 애착 스타일을 확인해보세요!',
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F7E1E1] via-[#F7D7C4] to-[#F5F5DC] flex flex-col items-center justify-start px-4 py-6">
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={resultData?.image || meta.image} />
        <meta property="og:url" content={`https://test-hugh.co.kr/attachmenttest/result/${type}`} />
      </Head>

      <h1 className="text-2xl font-black text-pink-500 mb-4 drop-shadow">
        당신의 애착 유형 결과
      </h1>

      {/* 대표 이미지 */}
      <div className="mx-auto mb-6 rounded-2xl shadow-xl border-4 border-pink-600/60 bg-black w-44 h-44 relative overflow-hidden">
        <Image
          src={resultData.image}
          alt={resultData.type}
          fill
          sizes="176px"
          className="object-cover"
        />
      </div>

      {/* 유형 배지 */}
      <div className="mb-3">
        <span className="inline-block bg-pink-700 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide">
          {resultData.type}
        </span>
      </div>

      {/* 점수가 있으면 그래프 복원 */}
      {chartData ? (
        <div className="w-full max-w-lg mx-auto mb-6">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: { legend: { position: 'top' } },
              scales: { y: { beginAtZero: true, grace: '10%' } },
            }}
          />
        </div>
      ) : (
        <p className="text-sm text-gray-600 mb-6">
          공유된 점수 데이터가 없어요. 테스트를 완료하고 공유하면 그래프가 같이 표시됩니다.
        </p>
      )}

      {/* 상세 설명 */}
      <div className="bg-zinc-900/85 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-pink-400">
        <div className="text-lg font-bold text-pink-200 mb-2">{resultData.type}</div>
        {resultData.description?.map((line, i) => (
          <div key={i} className="text-base text-gray-200 mb-1">
            {line}
          </div>
        ))}
      </div>

      {/* 결과 메시지 (result.js의 message) */}
      {Array.isArray(resultData.message) && resultData.message.length > 0 && (
        <div className="bg-[#17223b]/90 rounded-xl shadow-inner px-5 py-4 mx-auto max-w-lg mb-8 border-l-2 border-pink-800 text-pink-200 text-base font-semibold">
          {resultData.message.map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </div>
      )}

      {/* 하단 버튼들 */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center mt-8">
        {/* 다시 테스트 (경로 필요시 변경) */}
        <Link
          href="/attachmenttest"
          className="bg-pink-500 hover:bg-pink-600 text-white py-2 px-6 rounded-xl font-bold shadow-md transition"
        >
          나도 테스트 하기
        </Link>

        <Link
          href="/"
          className="bg-pink-100 hover:bg-pink-200 text-pink-600 py-2 px-6 rounded-xl font-bold shadow-md border border-pink-200 transition"
        >
          다른 테스트 보러가기
        </Link>
      </div>

      {copied && (
        <div className="mt-2 text-sm text-green-500">URL이 복사되었습니다!</div>
      )}
    </div>
  );
}
