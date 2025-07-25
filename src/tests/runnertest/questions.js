// questions.js

const questions = [
  // 순서를 섞은 12문항 (E/I, N/S, P/J 혼합)
  {
    id: 'q1',
    text: '런닝 중 가장 에너지를 얻는 순간은?',
    a: { label: '러너들과 하이파이브할 때!', type: 'E' },
    b: { label: '내 호흡과 발소리에 집중될 때', type: 'I' }
  },
  {
    id: 'q2',
    text: '런닝 목표를 설정할 때 당신은?',
    a: { label: '10km를 몇 분 안에 달성할지 정확히 정한다', type: 'S' },
    b: { label: '달리면서 느낄 기분과 성취감을 기대한다', type: 'N' }
  },
  {
    id: 'q3',
    text: '달리기 직전 당신은?',
    a: { label: '정해진 루틴대로 스트레칭 드릴 등을 꼼꼼히 한다', type: 'J' },
    b: { label: '그냥 생각나는대로 스트레칭 진행', type: 'P' }
  },
  {
    id: 'q4',
    text: '친구가 사람 많은 러닝크루에서 같이 뛰자고 했을 때',
    a: { label: '다같이 뛰면 힘나고 재밌겠다 ! 바로 가입!', type: 'E' },
    b: { label: '혼자 달리는 게 더 편해... 다음에 할래', type: 'I' }
  },
  {
    id: 'q5',
    text: '런닝 중 새로운 길이 보이면?',
    a: { label: '안전하고 익숙한 길로 간다', type: 'S' },
    b: { label: '새로운 길에서 모험을 즐긴다', type: 'N' }
  },
  {
    id: 'q6',
    text: '러닝 스케줄은?',
    a: { label: '정해진 요일과 시간에 맞춰 꾸준히 한다', type: 'J' },
    b: { label: '그날 기분 따라 유동적으로 뛴다', type: 'P' }
  },
  {
    id: 'q7',
    text: '런닝 후 당신은?',
    a: { label: '사람들과 후기를 나누고 인증샷을 찍는다', type: 'E' },
    b: { label: '샤워하고 조용히 회복 모드로 들어간다', type: 'I' }
  },
  {
    id: 'q8',
    text: '런닝 일지를 쓴다면?',
    a: { label: '거리, 속도, 심박수 등을 기록한다', type: 'S' },
    b: { label: '오늘의 기분과 생각 위주로 기록한다', type: 'N' }
  },
  {
    id: 'q9',
    text: '마라톤 참가 시 준비물은?',
    a: { label: '전날 밤 다 챙겨둔다', type: 'J' },
    b: { label: '생각만 해두다가 당일에 챙긴다', type: 'P' }
  },
  {
    id: 'q10',
    text: '런닝 시작 전, 당신은 어떤 마음가짐인가요?',
    a: { label: '다 같이 신나게 뛸 생각에 들뜬다', type: 'E' },
    b: { label: '혼자 나만의 페이스로 뛸 생각에 집중한다', type: 'I' }
  },
  {
    id: 'q11',
    text: '새로운 러닝화를 고를 때 당신은?',
    a: { label: '성능, 스펙, 사용자 후기를 꼼꼼히 본다', type: 'S' },
    b: { label: '디자인과 감성 신었을 때 느낌이 중요하지', type: 'N' }
  },
  {
    id: 'q12',
    text: '러닝 코스를 고를 때 당신은?',
    a: { label: '미리 거리와 루트를 체크해둔다', type: 'J' },
    b: { label: '대략 생각은 해두지만 달리면서 유동적으로', type: 'P' }
  }
];

export default questions;
