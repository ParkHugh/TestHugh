const results = [
  {
    id: 'ENT',
    name: '🔥 직진 플러팅 리더',
    image: '/images/flirttest/ent.png',
    description: `
      • 🗣️ 대화 주도, 분위기메이커! 새로운 사람 만나는 데 주저함이 없음<br/>
      • 💬 플러팅은 ‘밀당’보다 솔직+직진 스타일!<br/>
      • 논리적이면서도 즉흥적인 매력으로 상대를 사로잡음<br/>
      • 톡이나 DM 답장 속도, 유머감각 모두 빠름<br/>
      <b>어울리는 플러팅:</b> 오픈카톡, 번개 약속, 대놓고 “오늘 심심한데 뭐해?”<br/>
    `,
    bestMatch: 'INF',
    worstMatch: 'ESF'
  },
  {
    id: 'ENF',
    name: '🌸 설렘 전파자',
    image: '/images/flirttest/enf.png',
    description: `
      • 😊 감정 풍부, 관심과 애정표현이 아낌없음<br/>
      • 썸 상대가 기분 나쁠까봐 늘 신경 씀. 대화 분위기 맞춰주는 센스 만렙!<br/>
      • 매번 작은 이벤트와 설렘포인트를 놓치지 않음<br/>
      • 즉흥 데이트/귀여운 사진/짧은 연락도 금방 기획함<br/>
      <b>어울리는 플러팅:</b> “지금 뭐해요?” “보고 싶다” 갑작스런 선톡<br/>
    `,
    bestMatch: 'INT',
    worstMatch: 'IST'
  },
  {
    id: 'EST',
    name: '💼 플러팅 계획러',
    image: '/images/flirttest/est.png',
    description: `
      • 🧑‍💻 연락 일정, 데이트 루트, 플랜까지 다 짜놓는 스타일<br/>
      • 애매한 감정보다 "확실하게" 진행되는 썸을 선호<br/>
      • 밀당 NO! 투명하게 의사표현, 논리적으로 설득하는 편<br/>
      • 플러팅의 성패도 본인이 컨트롤하고 싶어함<br/>
      <b>어울리는 플러팅:</b> 데이트 사전예약, “몇 시 어디서 볼까?”<br/>
    `,
    bestMatch: 'IST',
    worstMatch: 'INF'
  },
  {
    id: 'ESF',
    name: '🍰 다정다감 현실 플러터',
    image: '/images/flirttest/esf.png',
    description: `
      • 🎀 섬세함+현실감각! 상대 감정에 민감하고 잘 맞춰줌<br/>
      • 감정 표현도, 사소한 배려도 절대 놓치지 않음<br/>
      • 연락·데이트 모두 부드럽게 이어가고, 상대 걱정도 많음<br/>
      • 과한 돌직구나 거친 농담은 부담스러움<br/>
      <b>어울리는 플러팅:</b> 맛집 추천, “힘들면 언제든 얘기해~”<br/>
    `,
    bestMatch: 'ISF',
    worstMatch: 'ENT'
  },
  {
    id: 'INT',
    name: '🧊 플러팅 이성주의자',
    image: '/images/flirttest/int.png',
    description: `
      • 🧐 논리적 분석력, 대화할 때 한 발짝 떨어져 관찰<br/>
      • 장난/썸 분위기에도 쉽게 휘둘리지 않음<br/>
      • 관심가는 사람만큼은 천천히, 오래 알아가고 싶어함<br/>
      • 감정보다 사실·논리·리액션 위주<br/>
      <b>어울리는 플러팅:</b> 장문의 DM, 신중한 질문, 심도 깊은 대화<br/>
    `,
    bestMatch: 'ENF',
    worstMatch: 'ESF'
  },
  {
    id: 'INF',
    name: '☁️ 몽글몽글 감성 플러터',
    image: '/images/flirttest/inf.png',
    description: `
      • 🎨 감정 이입력·공감력 최고! 로맨틱한 분위기 좋아함<br/>
      • 플러팅은 마치 영화 속 한 장면처럼...<br/>
      • “그런 말 해줘서 고마워” 등 감정 교류에 진심<br/>
      • 현실보다는 감성, 느낌, 설렘을 더 중시<br/>
      <b>어울리는 플러팅:</b> 심야감성톡, 플레이리스트 공유, 손글씨 사진<br/>
    `,
    bestMatch: 'ENT',
    worstMatch: 'EST'
  },
  {
    id: 'IST',
    name: '👓 신중 신중 현실파',
    image: '/images/flirttest/ist.png',
    description: `
      • 🕵️‍♂️ 플러팅도 연애도 천천히, 절대 서두르지 않음<br/>
      • 상대방이 확실히 마음을 표현해야 그때서야 반응<br/>
      • 장난·설렘보단 차분하고 꾸준한 연락을 선호<br/>
      • 계획적인 연락, 약속을 지키는 게 가장 중요<br/>
      <b>어울리는 플러팅:</b> 아침/저녁 인사, 일정 체크, "잘 들어갔어?"<br/>
    `,
    bestMatch: 'EST',
    worstMatch: 'ENF'
  },
  {
    id: 'ISF',
    name: '🫧 말랑말랑 소심 플러터',
    image: '/images/flirttest/isf.png',
    description: `
      • 🙊 내성적이지만, 호감 있는 상대 앞에선 귀엽게 변신!<br/>
      • 썸, 플러팅 모두 조심스럽게 한걸음씩<br/>
      • 표현보단 관찰, 직진보단 신호 확인 먼저<br/>
      • 작은 관심에도 쉽게 흔들림<br/>
      <b>어울리는 플러팅:</b> "오늘 하루 어땠어?", 취향 공유, 조심스런 응원<br/>
    `,
    bestMatch: 'ESF',
    worstMatch: 'INT'
  },
];

export const mainImage = '/images/flirttest/main.png';
export default results;
