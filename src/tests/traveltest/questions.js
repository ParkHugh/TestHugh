const questions = [
  // 1. E/I
  {
    id: "q1",
    text: "여행 중 하루쯤은 낯선 사람들과 어울리는 게 재밌다 vs 익숙한 사람들과 조용히 보내는 게 더 좋다",
    a: { label: "새로운 사람들과 금방 친해져서 여행도 풍성해진다", type: "E" },
    b: { label: "편한 사람이랑 조용히 보내야 진짜 힐링이지", type: "I" }
  },
  // 2. N/S
  {
    id: "q2",
    text: "현지인의 숨은 맛집, 골목길 감성이 좋다 vs 유명한 핫플, 인증샷 명소는 꼭 들러야 한다",
    a: { label: "나만 아는 감성 맛집 찾아다니는 게 꿀잼", type: "N" },
    b: { label: "핫플은 기본! SNS용 인증샷도 중요해", type: "S" }
  },
  // 3. P/J
  {
    id: "q3",
    text: "여행은 가볍게 가서 즉흥적으로 즐기는 게 최고 vs 계획표 짜야 마음이 놓인다",
    a: { label: "어디든 가서 즉흥으로 다니다 보면 재미가 터진다", type: "P" },
    b: { label: "계획 짜서 움직여야 시간 낭비 없이 뿌듯하지", type: "J" }
  },
  // 4. N/S
  {
    id: "q4",
    text: "처음 가보는 액티비티나 도전적인 코스가 좋다 vs 이미 검증된 코스로 안전하게 다니는 게 좋다",
    a: { label: "남들이 안 해본 거 해보고 싶어!", type: "N" },
    b: { label: "후기 많은 코스가 실패 없지", type: "S" }
  },
  // 5. E/I
  {
    id: "q5",
    text: "사람 많은 곳에서 북적이는 분위기를 즐긴다 vs 조용한 자연이나 한적한 동네가 좋다",
    a: { label: "사람이 많아야 살아있는 느낌이지!", type: "E" },
    b: { label: "사람 없는 조용한 곳에서 진짜 쉰다", type: "I" }
  },
  // 6. P/J
  {
    id: "q6",
    text: "계획은 참고용, 현지 분위기 따라 바뀌어도 괜찮다 vs 계획이 틀어지면 스트레스 받는다",
    a: { label: "그날그날 기분 따라 움직이는 게 여행이지", type: "P" },
    b: { label: "일정 어긋나면 불안해서 놀지도 못해", type: "J" }
  },
  // 7. N/S
  {
    id: "q7",
    text: "여행에서 감정적인 울림이나 영감 받는 게 중요하다 vs 시간/비용 대비 얼마나 즐겼는지가 중요하다",
    a: { label: "감성이 터지는 순간들이 기억에 남아", type: "N" },
    b: { label: "가성비 있게 알차게 다녀야지", type: "S" }
  },
  // 8. E/I
  {
    id: "q8",
    text: "혼자 여행보단 같이 떠나는 게 더 즐겁다 vs 여행은 혼자 가야 진짜 나다운 시간을 보낼 수 있다",
    a: { label: "함께 떠나야 재미도 추억도 배가돼!", type: "E" },
    b: { label: "혼자서 느긋하게 보내야 진짜 힐링", type: "I" }
  },
  // 9. P/J
  {
    id: "q9",
    text: "길 잃어도 재밌고 우연히 발견하는 맛집이 좋다 vs 지도와 계획표가 없으면 불안하다",
    a: { label: "계획 없이 걷다가 만나는 장소가 진짜다", type: "P" },
    b: { label: "동선대로 딱딱 움직여야 마음 편해", type: "J" }
  },
  // 10. E/I
  {
    id: "q10",
    text: "낯선 여행지에서 처음 만난 사람과 대화가 잘 통한다 vs 혼자만의 시간에 더 집중하는 편이다",
    a: { label: "누구와도 금방 친구가 되는 나", type: "E" },
    b: { label: "여행은 내 마음대로 쉬는 시간이 제일!", type: "I" }
  },
  // 11. N/S
  {
    id: "q11",
    text: "특별한 경험이나 신기한 문화 체험이 여행의 꽃이다 vs 전통적인 관광지와 명소가 빠지면 아쉽다",
    a: { label: "새로운 체험, 이색 문화가 여행의 매력!", type: "N" },
    b: { label: "관광 명소 투어는 필수 코스지", type: "S" }
  },
  // 12. P/J
  {
    id: "q12",
    text: "숙소는 직접 가보고 위치를 파악하고 최적의 숙소로 잡는게 좋다 vs 여행 전에 모든 숙소 예약은 끝내야 한다",
    a: { label: "잘 곳은 어차피 다 있어! 첫숙소만 잡고 가도 충분", type: "P" },
    b: { label: "당연히 여행전에 숙소 예약은 다 끝내야지", type: "J" }
  },
];

export default questions;
