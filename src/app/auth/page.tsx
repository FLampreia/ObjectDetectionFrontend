"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/textTitles";
import GreenBtn from "@/components/greenBtn";

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "signup">("login");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleAuth = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        // TODO: call backend API
        console.log({ username, email, password });

        router.push("/login");
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <AppTitle size="lg" />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-6">
                {/* Toggle */}
                <div className="flex rounded-xl bg-gray-100 p-1 mb-6">
                    <button
                        onClick={() => setMode("login")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${mode === "login"
                            ? "bg-white text-blue-950 shadow"
                            : "text-gray-500"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        onClick={() => setMode("signup")}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${mode === "signup"
                            ? "bg-white text-blue-950 shadow"
                            : "text-gray-500"
                            }`}
                    >
                        Sign up
                    </button>
                </div>

                {/* Content */}
                {mode === "login" ? (
                    <>
                        <h1 className="text-2xl font-bold text-center text-blue-950">
                            Welcome back
                        </h1>

                        <p className="text-center text-gray-500 mt-2 mb-6">
                            Enter your credentials to access your account
                        </p>

                        {/* TODO: login form */}
                        <form onSubmit={handleAuth} className="flex flex-col gap-4">

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                required
                            />

                            <button
                                type="submit"
                                className="bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-semibold py-2 px-5 rounded-full transition"
                            >
                                Login
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-center text-blue-950">
                            Create account
                        </h1>

                        <p className="text-center text-gray-500 mt-2 mb-6">
                            Sign up to start detecting
                        </p>

                        <form onSubmit={handleAuth} className="flex flex-col gap-4">

                            <input
                                type="username"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                required
                            />

                            <input
                                type="email"
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-black"
                                required
                            />

                            <button
                                type="submit"
                                className="bg-emerald-500 hover:bg-emerald-400 text-blue-950 font-semibold py-2 px-5 rounded-full transition"
                            >
                                Create account
                            </button>

                        </form>
                    </>
                )}

                <button
                    onClick={() => router.push("/")}
                    className="mt-6 text-sm text-blue-600 hover:underline w-full"
                >
                    Back to home
                </button>
            </div>
        </div >
    );
}
