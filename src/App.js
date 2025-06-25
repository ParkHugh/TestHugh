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

// ⭐️ TravelTest 추가
import TravelTest from './tests/traveltest/TravelTest';

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

          {/* ⭐️ traveltest 경로 추가 */}
          <Route path="/traveltest" element={<TravelTest />} />

          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
