// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import About from './pages/About';

// 테스트 import 경로! (폴더구조 기준)
// 앞으로 다른 테스트도 import만 추가하면 됨
import TetoTest from './tests/tetotest/TetoTest';
import SocioTest from './tests/sociopathtest/SocioTest';
// 예시: 두번째 테스트 추가시
// import SociopathTest from './tests/sociopathtest/SociopathTest';

import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/tetotest" element={<TetoTest />} />
        <Route path="/sociopath" element={<SocioTest />} />
        <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

