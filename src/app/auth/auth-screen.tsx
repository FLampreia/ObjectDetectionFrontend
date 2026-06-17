"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AppTitle from "@/components/custom/welcome/textTitles";
import { signup } from "@/services/auth";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { Button } from "@/components/base/buttons/button";
import { ArrowLeft } from "@untitledui/icons";
import { Input } from "@/components/base/input/input";


// TODO se houver uma conta logada, nao permite aceder À pagina de auth

export default function AuthScreen() {
    const router = useRouter();
    const [mode, setMode] = useState<"login" | "signup">("login");

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");


    const [usernameError, setUsernameError] = useState(false);


    const { login, user, loading } = useAuth();

    useEffect(() => {
        if (!loading && user) {
            router.push("/dashboard");
        }
    }, [user, loading, router]);

    const handleUsernameChange = (value: string) => {

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

            <div className="w-full max-w-md bg-slate-900 border border-blue-800 rounded-2xl shadow-2xl p-8 mt-6 flex flex-col transition-all duration-300 ">
                {/* Toggle */}
                <div className="relative grid grid-cols-2 rounded-xl bg-slate-800 p-1 mb-6">

                    {/* Sliding indicator */}
                    <div
                        className={`absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-lg bg-emerald-600 shadow-md transition-all duration-300 ease-in-out ${mode === "login"
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
                         {/* TODO se possivel dividir este ficheiro em componentes */}
                        <form
                            onSubmit={handleAuth}
                            className="flex flex-col gap-4 py-5"
                        >
                            <Input
                                size="lg"
                                type="email"
                                placeholder="Example@gmail.com"
                                value={email}
                                onChange={(value) => setEmail(value)}
                                isRequired
                            />

                            <Input
                                size="lg"
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(value) => setPassword(value)}
                                isRequired
                            />

                            <Button type="submit" size="md">
                                Login
                            </Button>

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
                            <Input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={handleUsernameChange}
                                isRequired
                                isInvalid={usernameError}
                            />

                            {/* TODO fazer erro para formulário como fiz para este  e rever esta questão dos inputs  */}

                            <Input
                                type="email"
                                placeholder="Example@gmail.com"
                                value={email}
                                onChange={(value) => setEmail(value)}
                                isRequired
                            />

                            <Input
                                type="text"
                                placeholder="Full Name"
                                value={fullName}
                                onChange={(value) => setFullName(value)}
                                isRequired
                            />

                            <Input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(value) => setPassword(value)}
                                isRequired
                            />

                            <Input
                                type="password"
                                placeholder="Confirm password"
                                value={confirmPassword}
                                onChange={(value) => setConfirmPassword(value)}
                                isRequired
                            />

                            <Button type="submit" size="md">
                                Create Account
                            </Button>
                        </form>
                    </>
                )}
                <div className="flex justify-center">
                    <Button color="link-gray" size="md" iconLeading={ArrowLeft} onClick={() => router.push("/")}>
                        Back to Home
                    </Button>
                </div>
            </div>
        </div>
    );
}