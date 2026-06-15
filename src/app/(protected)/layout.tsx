
"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/custom/sideBar";


export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) return <div>Loading...</div>; //TODO fazer loading
    if (!user) return null;

    return (
        <div className="min-h-screen">
            <Sidebar user={user} />
            <main className="lg:pl-70">
                {children}
            </main>
        </div>
    );
}