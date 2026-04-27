"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

type UserDropdownProps = {
  onClose: () => void;
  placement?: "top" | "bottom";
};

export function UserDropdown({
  onClose,
  placement = "bottom",
}: UserDropdownProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const positionClass =
    placement === "top"
      ? "bottom-full mb-2"
      : "top-full mt-2";

  return (
    <div
      className={`absolute right-0 ${positionClass} w-52 rounded-2xl border border-blue-900 bg-slate-950 shadow-xl overflow-hidden z-50`}
    >
      <button
        onClick={() => {
          onClose();
          router.push("/settings");
        }}
        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-900/40"
      >
        Settings
      </button>

      <button
        onClick={() => {
          onClose();
          logout();
          router.push("/");
        }}
        className="w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-900/40"
      >
        Logout
      </button>
    </div>
  );
}

// TODO Verify if its better do do everything as a component only, without, userCard, userAvatar and userDropsown beeing separated