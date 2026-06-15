"use client";

import { User } from "@/types/user";
import { UserAvatar } from "./userAvatar"; // ajusta import se necessário

export function UserCard({
  user,
  onClick,
}: {
  user: User;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 bg-blue-900/40 border border-blue-800 px-4 py-2 rounded-xl cursor-pointer"
    >
      <UserAvatar user={user} />

      <div className="text-sm text-left">
        <p className="text-white font-semibold leading-tight">
          {user.username}
        </p>
        <p className="text-blue-300 text-xs leading-tight">
          {user.email}
        </p>
      </div>
    </div>
  );
}