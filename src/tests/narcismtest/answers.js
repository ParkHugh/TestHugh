// /tests/narcismtest/answers.js
// Likert 5점 척도 (상단부터 긍정 → 부정)
// 알고리즘은 1..5 값을 그대로 사용하고, 역문항은 질문 메타의 reversed로 보정합니다.

const answers = [
  { label: '매우 그렇다', value: 5 },
  { label: '그렇다', value: 4 },
  { label: '보통이다', value: 3 },
  { label: '아니다', value: 2 },
  { label: '전혀 아니다', value: 1 },
];

export default answers;
