"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/custom/textTitles";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../base/buttons/button";
import { NavAccountCard } from "../application/app-navigation/base-components/nav-account-card";



export default function Header() {
  const router = useRouter();

  const { user } = useAuth();
  const menuRef = useRef<HTMLDivElement>(null);



  return (
    <header className="w-full py-4 px-6 ring-secondary bg-primary/40 backdrop-blur-md sticky top-0 z-50">
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
              <div className="hidden md:block cursor-pointer">
                <NavAccountCard user={user}/>
              </div>

              {/* Mobile - only avatar */}
              <div className="md:hidden">
                <NavAccountCard user={user}/>
              </div>

            </div>
          ) : (
            <Button size="lg" onClick={() => router.push("/auth")}>
              Get Started
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

