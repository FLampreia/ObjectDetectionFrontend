"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();

        // Aqui depois ligas ao backend
        console.log({ email, password});

        // Exemplo de redirect
        // router.push("/dashboard");
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-blue-950 px-4">

            <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

                <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-950">
                    Login
                </h1>

                <p className="text-center text-gray-500 mt-2 mb-6">
                    Access your account
                </p>

                <form onSubmit={handleLogin} className="flex flex-col gap-4">

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

                    <button
                        type="submit"
                        className="bg-emerald-500 hover:bg-emerald-100 text-white hover:text-emerald-950 font-bold py-2 rounded-lg transition mt-2 hover:cursor-pointer"
                    >
                        Log In
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