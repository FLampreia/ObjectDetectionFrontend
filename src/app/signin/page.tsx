"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log({ email, password, username });

        // router.push("/dashboard");
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-blue-950 px-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-950">
                    Sign in
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-6">
                    Create a new account
                </p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">

                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />

                    <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-100 text-white hover:text-emerald-950 font-bold py-2 rounded-lg transition mt-2 hover:cursor-pointer"
                    >
                        Sign in
                    </button>

                </form>

                <button
                    onClick={() => router.push("/")}
                    className="mt-4 text-sm text-blue-600 hover:underline w-full hover:cursor-pointer"
                >
                    Back to home
                </button>

            </div>
        </main>
    );
}