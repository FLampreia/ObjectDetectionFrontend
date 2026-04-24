"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/textTitles";
import { UserCard, UserAvatar } from "@/components/userCard";
import GreenBtn from "@/components/greenBtn";
import { useAuth } from "@/hooks/useAuth";



export default function Header() {
  const router = useRouter();

  const { user ,logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full py-4 px-6 border-b border-blue-900 bg-black/30 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">

        {/* Left - Title */}
        <div
          className="cursor-pointer z-50"
          onClick={() => {
            router.push("/");
          }}
        >
          <AppTitle size="xs" />
        </div>


        {/* Right - Auth/User + Mobile Toggle */}
        <div className="flex items-center gap-4">
          {user ? (
            // TODO colocar no overlay para ir para definições
            <div className="relative" ref={menuRef}>
              {/* Desktop */}
              <div className="hidden md:block cursor-pointer"
                onClick={() => setOpen(!open)}
              >
                <UserCard user={user} />
              </div>

              {/* Mobile - only avatar */}
              <div className="md:hidden"
                onClick={() => setOpen(!open)}
              >
                <UserAvatar user={user} />
              </div>
              
              {/* Logout overlay */}
              {open && (
                <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-blue-900 bg-slate-950 shadow-xl overflow-hidden z-50">
                  <button
                    onClick={() => {
                      setOpen(false);
                      router.push("/settings");
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-900/40 transition"
                  >
                    Settings
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                      router.push("/");
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-900/40 transition"

                  >
                    Logout
                  </button>
                </div>
              )}

            </div>
          ) : (
            <GreenBtn desc="Get started" href="/auth" />
          )}
        </div>
      </div>
    </header>
  );
}

