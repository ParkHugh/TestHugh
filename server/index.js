// 필요한 모듈 불러오기
const express = require('express');
const cors = require('cors');

// 앱 생성
const app = express();
const PORT = 5050; // 서버가 실행될 포트 번호

// 미들웨어 설정
app.use(cors()); // CORS 허용
app.use(express.json()); // JSON 형식의 요청 본문을 파싱

// 기본 라우트 설정
app.get('/', (req, res) => {
  res.send('백엔드 서버가 잘 작동 중입니다!');
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중`);
});
