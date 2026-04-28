
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/layout/sideBar";
import { Menu } from "lucide-react";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>;
    if (!user) return null;

    return (
        <div className="min-h-screen">
            
            {/* Sidebar Desktop */}
            <div className="hidden md:block">
                <Sidebar />
            </div>

            {/* Sidebar Mobile */}
            {mobileOpen && (
                <div className="md:hidden z-50">
                    <Sidebar mobile onClose={() => setMobileOpen(false)} />
                </div>
            )}

            {/* Page Content */}
            <main className="md:ml-64 min-h-screen">
                
                {/* Topbar Mobile */}
                <div className="md:hidden flex items-center gap-3 p-4 border-b border-blue-900 bg-slate-950/40 backdrop-blur-md sticky top-0 z-40">
                    <button
                        onClick={() => setMobileOpen(true)}
                        aria-label="Open Menu"
                    >
                        <Menu size={28} />
                    </button>

                    <span className="font-bold text-lg">Menu</span>
                </div>

                <div className="p-4 md:p-8">
                    {children}
                </div>

            </main>
        </div>
    );
}