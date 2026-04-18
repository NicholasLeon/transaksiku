"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut } from "lucide-react";
import { logout } from "@/lib/logout";

export default function UserMenu({ initial }: { initial: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 sm:w-12 sm:h-12 bg-[#ffbf69] rounded-full border-2 border-white shadow-md flex items-center justify-center text-gray-800 font-bold text-base sm:text-lg hover:scale-105 transition-transform outline-none cursor-pointer"
      >
        {initial}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-48 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <form action={logout}>
            <button
              type="submit"
              className="w-full text-left px-5 py-4 text-sm font-bold text-red-500 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <LogOut size={18} strokeWidth={2.5} />
              Keluar Akun
            </button>
          </form>
        </div>
      )}
    </div>
  );
}