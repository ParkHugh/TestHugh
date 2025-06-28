import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import About from './pages/About';
import TestsResults from './pages/TestsResults';
import TetoTest from './tests/tetotest/TetoTest';
import SocioTest from './tests/sociopathtest/SocioTest';
import RomanticTest from './tests/romantictest/RomanticTest';
import TetoTestResultPage from './tests/tetotest/TetoTestResultPage';
import TravelTest from './tests/traveltest/TravelTest';
import TravelTestResultPage from './tests/traveltest/TravelTestResultPage';

// ⭐️ 러너테스트 import
import RunnerTest from './tests/runnertest/RunnerTest';
import RunnerTestResultPage from './tests/runnertest/RunnerTestResultPage';

import './index.css';
import { HelmetProvider } from 'react-helmet-async';

function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/results" element={<TestsResults />} />
          <Route path="/tetotest" element={<TetoTest />} />
          <Route path="/tetotest/result/:type" element={<TetoTestResultPage />} />
          <Route path="/sociopath" element={<SocioTest />} />
          <Route path="/romantic" element={<RomanticTest />} />
          <Route path="/traveltest" element={<TravelTest />} />
          <Route path="/traveltest/result/:type" element={<TravelTestResultPage />} />

          {/* 👟 러너테스트 경로 추가 */}
          <Route path="/runnertest" element={<RunnerTest />} />
          <Route path="/runnertest/result/:type" element={<RunnerTestResultPage />} />

          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
