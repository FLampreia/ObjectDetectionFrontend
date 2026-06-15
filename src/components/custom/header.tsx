"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/custom/textTitles";
import { UserCard } from "@/components/custom/userCard";
import { UserAvatar } from "@/components/custom/userAvatar";
import { useAuth } from "@/hooks/useAuth";
import { UserDropdown } from "@/components/custom/userDropdown";
import { Button } from "../base/buttons/button";



export default function Header() {
  const router = useRouter();

  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

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
    <header className="w-full py-4 px-6 border-b border-blue-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-50">
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

              {open && <UserDropdown onClose={close} placement="bottom" />}

            </div>
          ) : (
            <Button size="lg" onClick={() => router.push("/auth")}>
              Get Started
            </Button>
            // <GreenBtn desc="Get started" href="/auth" />
          )}
        </div>
      </div>
    </header>
  );
}

