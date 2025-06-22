import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu as MenuIcon } from "lucide-react";

export default function MenuDropdown() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef();

  // 바깥 클릭시 닫기
  useEffect(() => {
    function handler(e) {
      if (open && menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    window.addEventListener("mousedown", handler);
    return () => window.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="p-2 rounded-full hover:bg-orange-100 transition"
        aria-label="메뉴 열기"
      >
        <MenuIcon size={28} className="text-orange-700" />
      </button>
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 mt-2 w-48 rounded-xl shadow-xl border bg-white py-2 z-50 animate-fade-in"
        >
          <Link
            to="/results"
            onClick={() => setOpen(false)}
            className="block px-5 py-3 text-orange-700 font-semibold hover:bg-orange-50 transition"
          >
            📝 테스트 결과 확인
          </Link>
          <Link
            to="/about"
            onClick={() => setOpen(false)}
            className="block px-5 py-3 text-orange-600 font-semibold hover:bg-orange-50 transition"
          >
            ℹ️ About
          </Link>
        </div>
      )}
    </div>
  );
}
