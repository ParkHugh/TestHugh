import { useEffect } from "react";

export default function GoogleTranslateLoader() {
  useEffect(() => {
    const addTranslateScript = () => {
      if (document.querySelector("#google-translate-script")) return;

      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.head.appendChild(script);
    };

    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "ko",
          includedLanguages: "ko,en,es",
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );
    };

    addTranslateScript();
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{
        position: "fixed",
        bottom: 16,
        left: 16,
        zIndex: 9999,
        background: "#fff",
        padding: "4px 10px",
        borderRadius: "8px",
        boxShadow: "0 0 6px rgba(0,0,0,0.15)",
      }}
    />
  );
}
