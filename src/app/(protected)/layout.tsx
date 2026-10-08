"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/custom/layout/navBar";
import LoadingPage from "../loading-page";

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.replace("/auth");
        }
    }, [user, loading, router]);


    if (loading && !user) {
        return <LoadingPage />;
    }

    if (!user) {
        return null;
    }


    return (
        <div className="min-h-screen">
            <Sidebar user={user} />

            <main className="px-4 sm:px-6 lg:px-8 lg:ml-69">
                {children}
            </main>
        </div>
    );
}
