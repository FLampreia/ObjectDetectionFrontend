
"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Sidebar } from "@/components/custom/layout/navBar";


export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth();
    const router = useRouter();


    useEffect(() => {
        if (!loading && user === null) {
            router.replace("/");
        }
    }, [user, loading, router]);

    if (loading || user === undefined) {
        
        return <div>Loading...</div>;
    }

    if (user === null) {
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