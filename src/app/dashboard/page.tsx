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
            <h1>Home</h1>

            <div>
                <p><strong>ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Role:</strong> {user.role}</p>

                {/* só aparece se vier do /me */}
                {"username" in user && (
                    <p><strong>Username:</strong> {(user as any).username}</p>
                )}

                {"full_name" in user && (
                    <p><strong>Full name:</strong> {(user as any).full_name}</p>
                )}
            </div>

            <button
                onClick={() => {
                    logout();
                    router.push("/");
                }}
                className="cursor-pointer bg-emerald-200"
            >
                Logout
            </button>

            <button
                onClick={() => {
                    router.push("/");
                }}
                className="cursor-pointer bg-emerald-200"
            >
                Welcome page
            </button>
        </div>
    );
}