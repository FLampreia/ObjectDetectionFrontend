import { User } from "@/types/user";


export function UserAvatar({
  user,
  onClick,
}: {
  user: User;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-black font-bold cursor-pointer"
    >
      {user.username.charAt(0).toUpperCase()}
    </div>
  );
}

// todo arranjar o overlay quando carrega no avatar