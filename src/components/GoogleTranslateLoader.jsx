import { useEffect, useRef } from "react";

export default function GoogleTranslateLoader() {
  const injectedRef = useRef(false);

  useEffect(() => {
    if (injectedRef.current) return;
    injectedRef.current = true;

    // 숨겨진 컨테이너 생성 (구글 위젯이 여기에 붙음)
    let holder = document.getElementById("google_translate_element");
    if (!holder) {
      holder = document.createElement("div");
      holder.id = "google_translate_element";
      holder.style.position = "fixed";
      holder.style.top = "-9999px";
      holder.style.left = "-9999px";
      document.body.appendChild(holder);
    }

    // 중복 삽입 방지
    const existing = document.querySelector('script[data-gt="1"]');
    if (!existing) {
      const s = document.createElement("script");
      s.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      s.async = true;
      s.defer = true;
      s.setAttribute("data-gt", "1");
      document.body.appendChild(s);
    }

    // 전역 콜백
    window.googleTranslateElementInit = function () {
      if (!window.google || !window.google.translate) return;
      /* eslint-disable no-new */
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko",
          includedLanguages: "en,ko,es",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
      // 초기 언어 기억 복원
      const saved = localStorage.getItem("preferred_lang");
      if (saved && saved !== "ko") {
        queueMicrotask(() => {
          const combo = document.querySelector(".goog-te-combo");
          if (combo) {
            combo.value = saved;
            combo.dispatchEvent(new Event("change"));
          }
        });
      }
    };

    return () => {
      // 정리(필수는 아님, 새로고침 시 재초기화됨)
      // delete window.googleTranslateElementInit;  // 필요시 주석 해제
    };
  }, []);

  return null;
}
