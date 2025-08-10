import { useEffect, useRef, useState } from "react";

function setCookie(name, value) {
  // 구글 위젯이 참조하는 쿠키 (보완용)
  document.cookie = `${name}=${value};path=/;expires=${new Date(
    Date.now() + 365 * 24 * 60 * 60 * 1000
  ).toUTCString()}`;
}

function triggerTranslate(to) {
  const combo = document.querySelector(".goog-te-combo");
  if (combo) {
    // 선호 언어 저장
    localStorage.setItem("preferred_lang", to);

    // 구글 쿠키도 맞춰줌(원본: ko → 대상: to)
    setCookie("googtrans", `/ko/${to}`);

    combo.value = to;
    combo.dispatchEvent(new Event("change"));
    return true;
  }
  return false;
}

export default function LanguageSwitcher({ languages, position = "bottom-right" }) {
  const [current, setCurrent] = useState("ko");
  const tries = useRef(0);

  // 초기 선택값 표시
  useEffect(() => {
    const saved = localStorage.getItem("preferred_lang");
    if (saved) setCurrent(saved);
  }, []);

  // 위젯 콤보가 늦게 생성될 수 있으므로 재시도 로직
  const ensureAndTranslate = (to) => {
    if (triggerTranslate(to)) {
      setCurrent(to);
      return;
    }
    // 재시도 (최대 30 * 200ms = 6초)
    tries.current = 0;
    const timer = setInterval(() => {
      tries.current += 1;
      if (triggerTranslate(to) || tries.current > 30) {
        clearInterval(timer);
        if (triggerTranslate(to)) setCurrent(to);
      }
    }, 200);
  };

  const containerPos =
    position === "top-right"
      ? "top-3 right-3"
      : position === "top-left"
      ? "top-3 left-3"
      : position === "bottom-left"
      ? "bottom-3 left-3"
      : "bottom-3 right-3";

  return (
    <div
      className={`fixed ${containerPos} z-[9999]`}
      role="group"
      aria-label="Language switcher"
    >
      <div className="flex gap-2 bg-white/80 backdrop-blur rounded-2xl shadow-md p-2">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => ensureAndTranslate(lang.code)}
            className={`px-3 py-1.5 rounded-xl text-sm border transition
              ${
                current === lang.code
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-800 border-gray-300 hover:border-gray-500"
              }`}
            aria-pressed={current === lang.code}
          >
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
}
