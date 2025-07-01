// src/tests/runnertest/result.js

const results = [
  {
    id: 'INP',
    name: '🌌 감성적인 꿈꾸는 러너',
    image: '/images/runnertest/inp.png',
    description: `
      <b>감성 + 혼자만의 시간, 힐링에 진심!</b><br/>
      감수성과 상상력이 풍부한 당신은 달리기를 통해 내면을 탐험하는 러너예요.<br/>
      계획보다는 그날의 기분에 따라 코스와 페이스를 바꾸곤 하죠.<br/>
      혼자만의 시간과 풍경 속에서 위로받는 스타일입니다.<br/>
      러닝은 당신에게 마음의 안정을 주는 힐링 루틴입니다. 🌙💭
    `,
    bestMatch: 'ISP',
    worstMatch: 'ENJ'
  },
  {
    id: 'INJ',
    name: '🧭 조용한 전략가 러너',
    image: '/images/runnertest/inj.png',
    description: `
      <b>계획적이고 조용하지만 끈기있는 마라토너!</b><br/>
      한 번 마음먹으면 끝까지 해내는 인내심 강한 러너예요.<br/>
      혼자서도 철저한 계획과 목표를 세워 꾸준히 달립니다.<br/>
      결과보다 과정에서 성장하는 걸 더 중요하게 여깁니다.<br/>
      조용하지만 강한 집중력을 가진 당신은 진정한 마라토너! 🏁
    `,
    bestMatch: 'ISJ',
    worstMatch: 'ESP'
  },
  {
    id: 'ISP',
    name: '🌿 자유로운 탐험가 러너',
    image: '/images/runnertest/isp.png',
    description: `
      <b>즉흥적 & 자유분방, 오늘의 기분이 우선!</b><br/>
      혼자 조용히, 하지만 자유롭게 달리는 스타일이에요.<br/>
      규칙보다는 즉흥적이고 유연한 계획을 선호하죠.<br/>
      새로운 러닝 코스나 장소를 탐험하는 걸 즐깁니다.<br/>
      오늘의 바람, 햇살, 기분에 따라 코스를 정하는 자연주의자 🌤️
    `,
    bestMatch: 'INP',
    worstMatch: 'ESJ'
  },
  {
    id: 'ISJ',
    name: '📋 성실한 루틴 지킴이 러너',
    image: '/images/runnertest/isj.png',
    description: `
      <b>아침형 인간, 꾸준함과 계획의 끝판왕!</b><br/>
      정해진 코스와 시간에 맞춰 계획적으로 달리는 타입이에요.<br/>
      작은 성취를 쌓아가는 걸 좋아하며, 꾸준함이 가장 큰 무기입니다.<br/>
      아침마다 같은 시간에 러닝하는 걸 즐기는 타입!<br/>
      러닝은 당신에게 하루를 정돈해주는 루틴이죠. 🕰️
    `,
    bestMatch: 'INJ',
    worstMatch: 'ENP'
  },
  {
    id: 'ENP',
    name: '🚀 에너지 폭발 즉흥 러너',
    image: '/images/runnertest/enp.png',
    description: `
      <b>즉흥적이고 에너지 넘치는 런파티의 주인공!</b><br/>
      느낌오면 바로 달리는, 활기 넘치는 러너입니다!<br/>
      러닝이 떠오르면 바로 운동화를 신고 나가는 타입이에요.<br/>
      다른 사람과의 러닝 약속도 적극적으로 잡는 편이고,<br/>
      새로운 루트나 이벤트 러닝도 즐기는 스타일이에요! 🎉
    `,
    bestMatch: 'ESP',
    worstMatch: 'ISJ'
  },
  {
    id: 'ENJ',
    name: '🎯 야망 가득한 리더형 러너',
    image: '/images/runnertest/enj.png',
    description: `
      <b>목표지향적, 모두를 이끄는 추진력의 리더!</b><br/>
      목표를 세우고 성취해내는 것에 큰 보람을 느끼는 러너예요.<br/>
      대회 참가나 완주 메달 수집에 관심이 많고, 주변 사람들을 이끌기도 해요.<br/>
      러닝 크루에서 중심이 되는 타입이기도 하죠.<br/>
      열정과 추진력으로 러닝에도 방향성을 부여하는 리더! 🏆
    `,
    bestMatch: 'ESJ',
    worstMatch: 'INP'
  },
  {
    id: 'ESP',
    name: '🎶 흥으로 달리는 파티 러너',
    image: '/images/runnertest/esp.png',
    description: `
      <b>음악과 사람, 흥이 최고의 동기부여!</b><br/>
      음악, 친구, 분위기와 함께 달리는 걸 좋아하는 타입이에요.<br/>
      러닝은 당신에게 운동이자 소셜 이벤트입니다!<br/>
      크루 러닝, 이벤트 런에 자주 참여하며 SNS 활동도 활발하죠.<br/>
      늘 에너지 넘치는 모습으로 러닝의 즐거움을 전파합니다! 🕺
    `,
    bestMatch: 'ENP',
    worstMatch: 'INJ'
  },
  {
    id: 'ESJ',
    name: '💼 체계적인 러닝 매니저',
    image: '/images/runnertest/esj.png',
    description: `
      <b>계획·준비·실행까지 완벽! 모두를 이끄는 매니저!</b><br/>
      정해진 러닝 스케줄을 지키고, 목표 달성에 진심인 타입입니다.<br/>
      운동 전후 스트레칭, 식단까지 철저하게 챙기는 성격이에요.<br/>
      사람들과 함께할 땐 그룹의 중심에서 일정과 페이스를 조율하죠.<br/>
      계획형 러닝의 모범 사례! 📅✔️
    `,
    bestMatch: 'ENJ',
    worstMatch: 'ISP'
  },
];

export const mainImage = '/images/runnertest/main.png';
export default results;
