// /pages/narcismtest/result/[type].js
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import results from '@/tests/narcismtest/result';
import meta from '@/tests/narcismtest/meta';

import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

if (typeof window !== 'undefined') {
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
}

const Bar = dynamic(() => import('react-chartjs-2').then((m) => m.Bar), { ssr: false });

// s 파라미터 복원 (v1/v2 호환)
function decodeScalesParam(s) {
  if (!s || typeof s !== 'string') return null;
  try {
    const base64 = decodeURIComponent(s);
    const json =
      typeof window === 'undefined'
        ? Buffer.from(base64, 'base64').toString('utf8')
        : decodeURIComponent(escape(atob(base64)));
    const parsed = JSON.parse(json);

    // v2 권장: { v:2, scales:{G,V,A,H,E} } (0~100)
    if (parsed?.scales && (parsed.v === 2 || 'E' in parsed.scales)) {
      const { G = 0, V = 0, A = 0, H = 0, E = null } = parsed.scales;
      return { G, V, A, H, E };
    }
    // v1 구형: { v:1, scales:{G,V,A,H} }
    if (parsed?.scales) {
      const { G = 0, V = 0, A = 0, H = 0 } = parsed.scales;
      return { G, V, A, H, E: null };
    }
    // 기타 예비 처리
    const maybe = parsed?.scores || parsed?.scales || parsed;
    if (maybe && (maybe.G || maybe.V || maybe.A || maybe.H)) {
      return {
        G: Number(maybe.G ?? 0),
        V: Number(maybe.V ?? 0),
        A: Number(maybe.A ?? 0),
        H: Number(maybe.H ?? 0),
        E: 'E' in maybe ? Number(maybe.E) : null,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export default function NarcismResultPage() {
  const router = useRouter();
  const rawType = router.query.type;
  // 과거 링크(observer) 호환 → healthy 매핑
  const type = rawType === 'observer' ? 'healthy' : rawType;

  const [copied, setCopied] = useState(false);

  // 결과 메타 (type 없으면 첫 항목)
  const resultData = useMemo(
    () => results.find((r) => r.id === type) || results[0],
    [type]
  );

  // 점수 디코드 → 그래프 데이터
  const scales = useMemo(() => decodeScalesParam(router.query.s), [router.query.s]);

  const labels = ['우월·통제(G)', '상처민감(V)', '인정의존(A)', '차분자존(H)', '공감·존중(E)'];
  const ordered = useMemo(() => {
    if (!scales) return null;
    return [
      Number(scales.G ?? 0),
      Number(scales.V ?? 0),
      Number(scales.A ?? 0),
      Number(scales.H ?? 0),
      scales.E === null || typeof scales.E === 'undefined' ? null : Number(scales.E),
    ];
  }, [scales]);

  const chartData = useMemo(() => {
    if (!ordered) return null;
    const barColors = ['#34D399', '#10B981', '#059669', '#6EE7B7', '#2DD4BF']; // emerald/teal 팔레트
    return {
      labels,
      datasets: [
        {
          label: '비율(%)',
          data: ordered,
          backgroundColor: barColors,
          borderColor: barColors,
          borderWidth: 1,
        },
      ],
    };
  }, [ordered]);

  const missingE = ordered && ordered[4] === null;

  // 공유/복사
  const handleShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (!shareUrl) return;
    if (navigator.share) {
      navigator.share({
        title: '나르시스트 성향 테스트 결과',
        text: '내 자기애 성향을 확인해보세요!',
        url: shareUrl,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0b0f0c] to-[#0b1a12] flex flex-col items-center justify-start px-4 py-6">
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:image" content={resultData?.image || meta.image} />
        <meta property="og:url" content={`https://test-hugh.co.kr/narcismtest/result/${type}`} />
      </Head>

      <h1 className="text-2xl font-black text-emerald-300 mb-4 drop-shadow">
        나르시스트 성향 결과
      </h1>

      {/* 대표 이미지 */}
      <div
        className="mx-auto mb-6 rounded-2xl shadow-xl bg-black w-44 h-44 relative overflow-hidden"
        style={{
          border: '2px solid rgba(16,185,129,0.5)',
          boxShadow: '0 10px 40px -10px rgba(16, 185, 129, 0.45)',
        }}
      >
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
        <span className="inline-block bg-emerald-700 text-white text-xs px-3 py-1 rounded-full shadow font-semibold tracking-wide">
          {resultData.type}
        </span>
      </div>

      {/* 그래프 (5축) */}
      {chartData ? (
        <div className="w-full max-w-lg mx-auto mb-6">
          <Bar
            data={chartData}
            options={{
              responsive: true,
              plugins: {
                legend: { position: 'top', labels: { color: '#d1fae5' } }, // emerald-100
                tooltip: {
                  titleColor: '#111827',
                  bodyColor: '#111827',
                  backgroundColor: '#d1fae5',
                  borderColor: '#10b981',
                  borderWidth: 1,
                },
              },
              scales: {
                x: {
                  ticks: { color: '#e5e7eb', font: { weight: '600' } },
                  grid: { color: 'rgba(55,65,81,0.35)' },
                },
                y: {
                  beginAtZero: true,
                  max: 100,
                  grace: '10%',
                  ticks: { color: '#e5e7eb' },
                  grid: { color: 'rgba(55,65,81,0.35)' },
                },
              },
            }}
          />
          <p className="text-xs text-emerald-200/80 mt-2">
            그래프는 5개 스케일(우월·통제/상처민감/인정의존/차분자존/공감·존중)을 0~100%로 표시합니다.
            {missingE && <> 과거 공유 링크라면 E(공감·존중) 데이터가 없을 수 있어요.</>}
          </p>
        </div>
      ) : (
        <p className="text-sm text-emerald-200/70 mb-6">
          공유된 점수 데이터가 없어요. 테스트 완료 후 공유하면 5축 그래프가 같이 표시됩니다.
        </p>
      )}

      {/* 상세 설명 */}
      {(resultData.description?.length ?? 0) > 0 && (
        <div className="bg-[#0b1a12]/80 rounded-2xl shadow-lg px-5 py-5 text-left mx-auto max-w-lg mb-6 border-l-4 border-emerald-500">
          <div className="text-lg font-bold text-emerald-200 mb-2">{resultData.type}</div>
          {resultData.description.map((line, i) => (
            <div key={i} className="text-base text-emerald-100/90 mb-1">
              {line}
            </div>
          ))}
        </div>
      )}

      {/* 결과 메시지 (한 줄 조언 등) */}
      {Array.isArray(resultData.message) && resultData.message.length > 0 && (
        <div className="bg-[#0f1f17]/90 rounded-xl shadow-inner px-5 py-4 mx-auto max-w-lg mb-8 border-l-2 border-emerald-700 text-emerald-100 text-base font-semibold">
          {resultData.message.map((line, idx) => (
            <span key={idx}>
              {line}
              <br />
            </span>
          ))}
        </div>
      )}

      {/* 하단 버튼 */}
      <div className="flex flex-col md:flex-row gap-3 md:gap-6 justify-center items-center mt-4">
        <Link
          href="/narcismtest"
          className="bg-emerald-700 hover:bg-emerald-800 text-white py-2 px-6 rounded-xl font-bold shadow-md"
        >
          나도 테스트 하기
        </Link>

        <button
          onClick={handleShare}
          className="border border-emerald-600/70 text-emerald-200 hover:bg-emerald-600/10 py-2 px-6 rounded-xl font-bold shadow-md transition"
        >
          이 결과 공유하기
        </button>

        <Link
          href="/"
          className="text-emerald-200 hover:text-emerald-100 py-2 px-6 rounded-xl font-bold"
        >
          다른 테스트 보러가기
        </Link>
      </div>

      {copied && <div className="mt-2 text-sm text-emerald-400">URL이 복사되었습니다!</div>}
    </div>
  );
}
