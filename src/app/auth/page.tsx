"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/textTitles";
import { signup } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";


export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "signup">("login");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");

    const { login } = useAuth();

    const handleAuth = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            if (mode === "signup") {
                if (password !== confirmPassword) {
                    alert("Passwords do not match");
                    return;
                }

                await signup(username, email, password, fullName);

                setUsername("");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                setMode("login");
                return;
            }

            await login(email, password);

            router.push("/dashboard");

        } catch (error: unknown) {
            if (error instanceof Error) {
                alert(error.message);
            } else {
                alert("An unexpected error occurred");
            }
        }
    };
    
    return (
        <div className="flex flex-col items-center min-h-screen pt-10 px-4">
            <AppTitle size="lg" />

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 mt-6 flex flex-col transition-all duration-300">
                {/* Toggle */}
                <div className="relative grid grid-cols-2 rounded-xl bg-gray-100 p-1 mb-6">

                    {/* Sliding indicator */}
                    <div
                        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-white shadow-md transition-all duration-300 ease-in-out ${mode === "login" ? "translate-x-0" : "translate-x-full"
                            }`}
                    />

                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={`relative z-10 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${mode === "login" ? "text-blue-950" : "text-gray-500"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className={`relative z-10 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${mode === "signup" ? "text-blue-950" : "text-gray-500"
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

                        <form onSubmit={handleAuth} className="flex flex-col gap-4 py-5">

                            <input
                                type="email"
                                name="email"
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
                            Create an account
                        </h1>

                        <form onSubmit={handleAuth} className="flex flex-col gap-4 py-5">

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
                                type="fullName"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
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
                    className=" text-sm text-blue-600 hover:underline w-full"
                >
                    Back to home
                </button>
            </div>
        </div >
    );
}
