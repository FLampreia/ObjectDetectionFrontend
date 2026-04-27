import { LayoutDashboard as Dash, Video, ClipboardClock, Users, Settings, X, LogOut } from "lucide-react";
import { MenuItem } from "@/components/menuitem";
import { useAuth } from "@/hooks/useAuth";
import AppTitle from "@/components/textTitles";
import { UserCard } from "@/components/userCard";
import { useState, useEffect, useRef } from "react";
import { UserDropdown } from "@/components/userDropdown";


interface SidebarProps {
    mobile?: boolean;
    onClose?: () => void;
}

// TODO corrigir sidebar mobile
export function Sidebar({ mobile = false, onClose }: SidebarProps) {

    const { user, logout } = useAuth();

    const [open, setOpen] = useState(false);

    const toggle = () => setOpen(v => !v);
    const close = () => setOpen(false);

    return (
        <aside
            className={`border-b border-blue-900 bg-black/30 backdrop-blur-md text-white flex flex-col ${mobile ? "w-full h-full" : "w-64"}`}
        >
            <div className="flex items-center justify-between px-6 py-5 text-2xl font-bold border-b border-blue-900">

                <AppTitle size="xxs" />

                {mobile && (
                    <button
                        onClick={onClose}
                        aria-label="Fechar menu"
                        title="Fechar menu"
                    >
                        <X size={26} />
                    </button>
                )}
            </div>

            <nav className="flex-1 px-4 py-6 space-y-2">
                <MenuItem
                    icon={<Dash size={20} />}
                    label="Dashboard" to="/dashboard"
                // allowedRoles={["admin", "operator", "viewer"]}
                />
                <MenuItem
                    icon={<Video size={20} />}
                    label="Detections" to="/detect"
                // allowedRoles={["admin", "operator", "viewer"]}
                />
                <MenuItem
                    icon={<ClipboardClock size={20} />}
                    label="History" to="/history"
                // allowedRoles={["admin", "operator"]}
                />
                <MenuItem
                    icon={<Users size={20} />}
                    label="Team" to="/team"
                // allowedRoles={"admin"}
                />

            </nav>


            <div className="p-4 border-t border-blue-900 relative">

                {user && (
                    <div onClick={toggle} className="cursor-pointer">
                        <UserCard user={user} />
                    </div>
                )}

                {open && <UserDropdown onClose={close} placement="top"/>}

            </div>

        </aside>
    );
}
