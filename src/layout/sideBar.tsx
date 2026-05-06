// Sidebar.tsx corrigida para mobile fechar corretamente

import {
    LayoutDashboard as Dash,
    Video,
    ClipboardClock,
    Users,
    X,
} from "lucide-react";

import { MenuItem } from "@/components/menuitem";
import { useAuth } from "@/hooks/useAuth";
import AppTitle from "@/components/textTitles";
import { UserCard } from "@/components/userCard";
import { useState } from "react";
import { UserDropdown } from "@/components/userDropdown";

interface SidebarProps {
    mobile?: boolean;
    onClose?: () => void;
}

export function Sidebar({
    mobile = false,
    onClose,
}: SidebarProps) {
    const { user } = useAuth();
    const [open, setOpen] = useState(false);

    const toggle = () => setOpen((v) => !v);

    const closeDropdown = () => setOpen(false);

    const handleCloseSidebar = () => {
        closeDropdown();
        onClose?.();
    };

    return (
        <aside
            className={`bg-slate-950 backdrop-blur-md text-white flex flex-col z-50 ${mobile
                    ? "fixed inset-0 w-full h-full"
                    : "fixed top-0 left-0 h-screen w-64 border-r border-blue-900 rounded-tr-2xl rounded-br-2xl"
                }`}
        >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 text-2xl font-bold border-b border-blue-900">
                <AppTitle size="xxs" />

                {mobile && (
                    <button
                        onClick={handleCloseSidebar}
                        aria-label="Close menu"
                        className="p-1"
                    >
                        <X size={28} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                <MenuItem
                    icon={<Dash size={20} />}
                    label="Dashboard"
                    to="/dashboard"
                    onClick={mobile ? handleCloseSidebar : undefined}
                />

                <MenuItem
                    icon={<Video size={20} />}
                    label="Detections"
                    to="/detect"
                    onClick={mobile ? handleCloseSidebar : undefined}
                />

                <MenuItem
                    icon={<ClipboardClock size={20} />}
                    label="History"
                    to="/history"
                    onClick={mobile ? handleCloseSidebar : undefined}
                />

                <MenuItem
                    icon={<Users size={20} />}
                    label="Team"
                    to="/team"
                    onClick={mobile ? handleCloseSidebar : undefined}
                />
            </nav>

            {/* User */}
            <div className="p-4 border-t border-blue-900 relative">
                {user && (
                    <div
                        onClick={toggle}
                        className="cursor-pointer"
                    >
                        <UserCard user={user} />
                    </div>
                )}

                {open && (
                    <UserDropdown
                        onClose={handleCloseSidebar}
                        placement="top"
                    />
                )}
            </div>
        </aside>
    );
}