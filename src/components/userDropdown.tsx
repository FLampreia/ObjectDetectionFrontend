import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Settings, LogOut } from "lucide-react";

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
      className={`absolute left-0 right-0 ${positionClass} rounded-2xl border border-blue-900 bg-slate-950 shadow-xl overflow-hidden z-50`}
    >
      <button
        onClick={() => {
          onClose();
          router.push("/settings");
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-blue-900/40 cursor-pointer"
      >
        <Settings size={18} />
        <span>Settings</span>
      </button>

      <button
        onClick={() => {
          onClose();
          logout();
          router.push("/");
        }}
        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-white hover:bg-blue-900/40 cursor-pointer"
      >
        <LogOut size={18} />
        <span>Logout</span>
      </button>
    </div>
  );
}