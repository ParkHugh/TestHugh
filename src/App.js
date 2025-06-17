import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import TetoTest from './pages/TetoTest'; // PersonalityTest에서 파일명만 변경!
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import './index.css'; // CSS 그대로 사용

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tetotest" element={<TetoTest />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        {/* 앞으로 다른 테스트도 아래에 계속 추가하면 됨 */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
