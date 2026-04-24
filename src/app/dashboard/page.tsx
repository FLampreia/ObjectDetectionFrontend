"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";


export default function HomePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();


    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>Not authenticated</div>;
    }

    return (
        <div>
            <h1>Dashboard</h1>

            <div>
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

            <button
                onClick={() => {
                    logout();
                    router.push("/");
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-900/40 transition"            >
                Logout
            </button>

            <button
                onClick={() => {
                    router.push("/");
                }}
                className="w-full text-left px-4 py-3 text-sm text-white hover:bg-blue-900/40 transition"
            >
                Welcome page
            </button>
        </div>
    );
}