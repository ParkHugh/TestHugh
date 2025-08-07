import { useEffect } from "react";

export default function GoogleTranslateLoader({ onReady }) {
  useEffect(() => {
    window.googleTranslateElementInit = function () {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko",
          includedLanguages: "ko,en,es",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
        },
        "google_translate_element"
      );
      onReady(); // ✅ 위젯 로드 후 부모에게 알림
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        width: 1,
        height: 1,
        opacity: 0.01,
        pointerEvents: "none",
        zIndex: -1,
      }}
    />
  );
}
