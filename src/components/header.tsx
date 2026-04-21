"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import AppTitle from "@/components/textTitles";
import { UserCard, UserAvatar, type User} from "./userCard";
import GreenBtn from "./greenBtn";

type Props = {
  user?: User | null;
};


export default function Header({ user }: Props) {
  const router = useRouter();

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
            // TODO colocar overlay para terminar sessão ou ir para definições
            <>
              {/* Desktop */}
              <div className="hidden md:block">
                <UserCard user={user} />
              </div>

              {/* Mobile - only avatar */}
              <div className="md:hidden">
                <UserAvatar user={user} />
              </div>
            </>
          ) : (
            <GreenBtn desc="Get started" href="/signin"/>
          )}
        </div>
      </div>
    </header>
  );
}

