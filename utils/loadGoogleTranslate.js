export const loadGoogleTranslate = () => {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.translate) {
      resolve();
      return;
    }

    window.googleTranslateElementInit = function () {
      resolve();
    };

    const existingScript = document.querySelector("#google-translate-script");
    if (!existingScript) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
};
