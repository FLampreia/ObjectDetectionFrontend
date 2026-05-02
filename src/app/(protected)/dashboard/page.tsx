"use client";

import { useAuth } from "@/hooks/useAuth";


export default function HomePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Not authenticated</div>;
    }

    return (
        <div className="flex min-h-screen">


            <main className="flex-1 p-8 max-w-4xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

                <div className="space-y-2">
                    <p><strong>ID:</strong> {user.id}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                    <p><strong>Role:</strong> {user.role}</p>

                    {"username" in user && (
                        <p><strong>Username:</strong> {user.username}</p>
                    )}

                    {"full_name" in user && (
                        <p><strong>Full name:</strong> {user.full_name}</p>
                    )}
                </div>
            </main>

        </div>
    );
}