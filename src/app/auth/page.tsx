"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/textTitles";
import { signup } from "@/services/auth";
import { useAuth } from "@/hooks/useAuth";

// TODO se houver uma conta logada, nao permite aceder À pagina de auth

export default function AuthPage() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "signup">("login");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");


    const [usernameError, setUsernameError] = useState(false);


    const { login } = useAuth()

    const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        const hasSpace = value.includes(" ");

        setUsername(value);
        setUsernameError(hasSpace);
    };

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
                setFullName("");

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
        <div className="flex flex-col items-center min-h-screen pt-10 px-4 ">
            <AppTitle size="lg" />

            <div className="w-full max-w-md bg-slate-900 border border-blue-800 rounded-2xl shadow-2xl p-8 mt-6 flex flex-col transition-all duration-300">
                {/* Toggle */}
                <div className="relative grid grid-cols-2 rounded-xl bg-slate-800 p-1 mb-6">

                    {/* Sliding indicator */}
                    <div
                        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-emerald-500 shadow-md transition-all duration-300 ease-in-out ${mode === "login"
                            ? "translate-x-0"
                            : "translate-x-full"
                            }`}
                    />

                    <button
                        type="button"
                        onClick={() => setMode("login")}
                        className={`relative z-10 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${mode === "login"
                            ? "text-white"
                            : "text-slate-400"
                            }`}
                    >
                        Login
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode("signup")}
                        className={`relative z-10 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${mode === "signup"
                            ? "text-white"
                            : "text-slate-400"
                            }`}
                    >
                        Sign up
                    </button>
                </div>

                {mode === "login" ? (
                    <>
                        <h1 className="text-2xl font-bold text-center ">
                            Welcome back
                        </h1>

                        <form
                            onSubmit={handleAuth}
                            className="flex flex-col gap-4 py-5"
                        >
                            <input
                                type="email"
                                placeholder="Example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                            />

                            <button
                                type="submit"
                                className="bg-emerald-500 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-full transition cursor-pointer"
                            >
                                Login
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold text-center ">
                            Create an account
                        </h1>

                        <form
                            onSubmit={handleAuth}
                            className="flex flex-col gap-4 py-5"
                        >
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                                className={`bg-slate-800 border rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition
                                            ${usernameError ? "border-red-500 focus:ring-red-500" : "border-slate-700"}
                                        `}
                                required
                            />
                            {usernameError && (
                                <p className="text-red-400 text-sm mt-1">
                                    Username cannot contain spaces.
                                </p>
                            )} 

                            {/* TODO fazer erro para formulário como fiz para este  e rever esta questão dos inputs  */}

                            <input
                                type="email"
                                placeholder="Example@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                            />

                            <input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                            />

                            <input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                required
                            />

                            <button
                                type="submit"
                                className="bg-emerald-500 hover:bg-emerald-700 text-white font-semibold py-2 px-5 rounded-full transition cursor-pointer"
                            >
                                Create account
                            </button>
                        </form>
                    </>
                )}

                <button
                    onClick={() => router.push("/")}
                    className="text-sm text-blue-400 hover:text-blue-300 hover:underline w-full cursor-pointer"
                >
                    Back to home
                </button>
            </div>
        </div>
    );
}