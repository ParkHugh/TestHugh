// src/components/NavBar.jsx
import { Link, useLocation } from "react-router-dom";

const menus = [
  { to: "/", label: "테스트 전체" },
  { to: "/results", label: "결과 유형 보기" },
  { to: "/about", label: "About" },
];

export default function NavBar() {
  const location = useLocation();
  return (
    <nav className="sticky top-0 z-30 w-full bg-[#fdf6ec] border-b border-orange-100/60 shadow-sm">
      <div className="max-w-3xl mx-auto flex items-center px-4 h-16">
        <div className="font-brand text-2xl font-black text-orange-600 tracking-tight flex-1">
          TEST <span className="text-rose-400 font-bold align-middle">/ 休</span>
        </div>
        <div className="flex items-center gap-2">
          {menus.map((m) => (
            <Link
              key={m.to}
              to={m.to}
              className={`px-4 py-1.5 rounded-lg font-bold transition 
                ${
                  location.pathname === m.to
                    ? "bg-orange-200 text-orange-900 shadow"
                    : "text-orange-600 hover:bg-orange-100"
                }
              `}
            >
              {m.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
