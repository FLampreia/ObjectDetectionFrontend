
import { User } from "@/types/user";

export function UserCard({ user }: { user: User }) {
  return (
    
    <div className="flex items-center gap-3 bg-blue-900/40 border border-blue-800 px-4 py-2 rounded-xl">
      <UserAvatar user={user} />

      <div className="text-sm text-left">
        <p className="text-white font-semibold leading-tight">{user.username}</p>
        <p className="text-blue-300 text-xs leading-tight">{user.email}</p>
      </div>
    </div>
  );
}

export function UserAvatar({ user }: { user: User }) {
  return (
    <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold">
      {user.username.charAt(0).toUpperCase()}
    </div>
  );
}