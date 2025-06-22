import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Contact from './pages/Contact';
import About from './pages/About';
import TestsResults from './pages/TestsResults';
import TetoTest from './tests/tetotest/TetoTest';
import SocioTest from './tests/sociopathtest/SocioTest';
import RomanticTest from './tests/romantictest/RomanticTest'; // ⭐️ 추가!
import TetoTestResultPage from './tests/tetotest/TetoTestResultPage';
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
          <Route path="/romantic" element={<RomanticTest />} /> {/* ⭐️ 추가! */}
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}

export default App;
