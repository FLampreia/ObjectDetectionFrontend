"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowLeft, ArrowRight, FileBarChart, LogIn, ScanLine, UserPlus, Users } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { NavigationBrand } from "@/components/custom/layout/navigation-brand";
import { InlineFeedback } from "@/components/custom/layout/inline-feedback";
import { useAuth } from "@/hooks/use-auth";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { signup } from "@/services/auth";
import { cx } from "@/utils/cx";
import detectionPreview from "../../../public/images/image.png";

type AuthMode = "login" | "signup";

const highlights = [
    { icon: ScanLine, label: "Detect and track objects across your visual sources." },
    { icon: Users, label: "Share results and collaborate with your teams." },
    { icon: FileBarChart, label: "Keep your history organized and export reports." },
];

export default function AuthScreen() {
    const router = useRouter();
    const { login, user, loading } = useAuth();
    const submittingRef = useRef(false);
    const cardContentRef = useRef<HTMLDivElement>(null);
    const [cardHeight, setCardHeight] = useState<number | null>(null);
    const prefersReducedMotion = useReducedMotion();
    const [mode, setMode] = useState<AuthMode>("login");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [fullName, setFullName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const isSignup = mode === "signup";
    const usernameError = username.includes(" ");

    const measureCard = useCallback(() => {
        if (cardContentRef.current) {
            // Include the card's top and bottom borders in its measured height.
            setCardHeight(cardContentRef.current.offsetHeight + 2);
        }
    }, []);

    useResizeObserver({ ref: cardContentRef, box: "border-box", onResize: measureCard });

    useEffect(() => {
        if (!loading && user) router.replace("/dashboard");
    }, [user, loading, router]);

    function changeMode(nextMode: AuthMode) {
        if (submittingRef.current) return;
        setMode(nextMode);
        setError(null);
        setSuccess(null);
    }

    async function handleAuth(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submittingRef.current || loading) return;
        setError(null);
        setSuccess(null);

        if (isSignup && usernameError) {
            setError("Please choose a username without spaces.");
            return;
        }
        if (isSignup && password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        submittingRef.current = true;
        setIsSubmitting(true);

        try {
            if (isSignup) {
                await signup(username, email, password, fullName);
                setUsername("");
                setFullName("");
                setPassword("");
                setConfirmPassword("");
                setMode("login");
                setSuccess("Your account has been created. Log in to get started.");
            } else {
                await login(email, password);
                router.replace("/dashboard");
            }
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Something went wrong. Please try again.");
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    return (
        <div className="flex min-h-screen flex-col text-primary">

            <header className="border-b border-primary bg-primary/95">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">

                    <NavigationBrand href="/" />

                    <Button href="/" color="link-gray" size="sm" iconLeading={ArrowLeft}>
                        Back to home
                    </Button>
                </div>
            </header>

            <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 px-4 py-10 sm:px-6 sm:py-14 lg:grid-cols-2 lg:gap-20 lg:px-8">
                <section aria-labelledby="auth-intro-title" className="hidden lg:block">

                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-solid px-4 py-2 text-sm font-semibold text-white shadow-xs">
                        <ScanLine aria-hidden="true" className="size-4" />
                        Object detection & tracking
                    </span>

                    <h2 id="auth-intro-title" className="mt-6 max-w-lg text-display-md font-semibold tracking-tight sm:text-display-lg">
                        Your visual data.<br />
                        <span className="text-brand-secondary">A clearer picture.</span>
                    </h2>

                    <p className="mt-5 max-w-lg text-md leading-7 text-tertiary">
                        One place to detect objects, explore results and work together.
                        Pick up where you left off or start your first detection.
                    </p>

                    <ul className="mt-7 space-y-4">
                        {highlights.map(({ icon: Icon, label }) => (
                            <li key={label} className="flex items-center gap-3 text-sm text-secondary">
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-secondary bg-primary">
                                    <Icon aria-hidden="true" className="size-4 text-brand-secondary" />
                                </span>
                                {label}
                            </li>
                        ))}
                    </ul>

                    <figure className="mt-8 overflow-hidden rounded-xl border border-primary bg-primary shadow-sm">
                        <Image
                            src={detectionPreview}
                            alt="Example detection showing labeled people and vehicles on a city street."
                            sizes="(min-width: 1024px) 520px, 100vw"
                            className="h-auto w-full"
                        />
                        <figcaption className="border-t border-secondary px-4 py-3 text-xs text-tertiary">
                            From photos to live streams, keep every result in view.
                        </figcaption>
                    </figure>
                </section>

                <motion.section
                    aria-labelledby="auth-title"
                    initial={false}
                    animate={{ height: cardHeight ?? "auto" }}
                    transition={{ duration: prefersReducedMotion ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-primary bg-primary shadow-xl"
                >
                    <div ref={cardContentRef} className="p-5 sm:p-8">
                        <div role="group" aria-label="Account access" className="relative mb-7 grid grid-cols-2 rounded-xl border border-secondary bg-secondary p-1">
                            <span
                                aria-hidden="true"
                                className={cx(
                                    "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-lg bg-brand-solid shadow-xs transition-transform duration-300 ease-in-out motion-reduce:transition-none",
                                    isSignup ? "translate-x-full" : "translate-x-0",
                                )}
                            />
                            {([
                                { id: "login", label: "Log in" },
                                { id: "signup", label: "Sign up" },
                            ] as const).map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    aria-pressed={mode === item.id}
                                    disabled={isSubmitting}
                                    onClick={() => changeMode(item.id)}
                                    className={cx(
                                        "relative z-10 cursor-pointer rounded-lg px-4 py-2.5 text-sm font-semibold outline-focus-ring transition-colors duration-300 motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
                                        mode === item.id
                                            ? "text-white"
                                            : "text-tertiary hover:text-primary",
                                    )}
                                >
                                    {item.label}
                                </button>
                            ))}
                        </div>

                        <div className="mb-5 flex size-12 items-center justify-center rounded-xl bg-brand-solid text-white shadow-xs">
                            {isSignup ? <UserPlus aria-hidden="true" className="size-6" /> : <LogIn aria-hidden="true" className="size-6" />}
                        </div>
                        <h1 id="auth-title" className="text-display-xs font-semibold tracking-tight text-primary">
                            {isSignup ? "Create your account" : "Welcome back"}
                        </h1>
                        <p className="mt-2 text-sm leading-6 text-tertiary">
                            {isSignup
                                ? "Start organizing your detections and collaborating with your team."
                                : "Log in to access your detections, teams and reports."}
                        </p>

                        <form onSubmit={handleAuth} aria-busy={isSubmitting} className="mt-6 space-y-4">
                            {isSignup && (
                                <>
                                    <Input
                                        label="Username"
                                        name="username"
                                        autoComplete="username"
                                        placeholder="Choose a username"
                                        value={username}
                                        onChange={(value) => {
                                            setUsername(value);
                                            setError(null);
                                        }}
                                        isRequired
                                        isDisabled={isSubmitting}
                                        isInvalid={usernameError}
                                        hint={usernameError ? "Your username cannot contain spaces." : undefined}
                                    />
                                    <Input
                                        label="Full name"
                                        name="name"
                                        autoComplete="name"
                                        placeholder="Your full name"
                                        value={fullName}
                                        onChange={setFullName}
                                        isRequired
                                        isDisabled={isSubmitting}
                                    />
                                </>
                            )}

                            <Input
                                label="Email address"
                                name="email"
                                type="email"
                                autoComplete={isSignup ? "email" : "username"}
                                placeholder="you@example.com"
                                value={email}
                                onChange={setEmail}
                                isRequired
                                isDisabled={isSubmitting}
                            />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                autoComplete={isSignup ? "new-password" : "current-password"}
                                placeholder={isSignup ? "Create a password" : "Enter your password"}
                                value={password}
                                onChange={setPassword}
                                isRequired
                                isDisabled={isSubmitting}
                            />
                            {isSignup && (
                                <Input
                                    label="Confirm password"
                                    name="confirmPassword"
                                    type="password"
                                    autoComplete="new-password"
                                    placeholder="Enter your password again"
                                    value={confirmPassword}
                                    onChange={setConfirmPassword}
                                    isRequired
                                    isDisabled={isSubmitting}
                                />
                            )}

                            {error && (
                                <InlineFeedback>
                                    {error}
                                </InlineFeedback>
                            )}
                            {success && (
                                <InlineFeedback tone="success">
                                    {success}
                                </InlineFeedback>
                            )}

                            <Button
                                type="submit"
                                size="lg"
                                className="w-full"
                                iconTrailing={ArrowRight}
                                isDisabled={loading || isSubmitting || (isSignup && usernameError)}
                                isLoading={isSubmitting}
                                showTextWhileLoading
                            >
                                {isSubmitting
                                    ? isSignup ? "Creating account…" : "Logging in…"
                                    : isSignup ? "Create account" : "Log in"}
                            </Button>
                        </form>

                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-secondary pt-5 text-sm text-tertiary">
                            <span>{isSignup ? "Already have an account?" : "New to ObjectDetection?"}</span>
                            <Button
                                color="link-color"
                                size="sm"
                                isDisabled={isSubmitting}
                                onPress={() => changeMode(isSignup ? "login" : "signup")}
                            >
                                {isSignup ? "Log in" : "Create an account"}
                            </Button>
                        </div>
                    </div>
                </motion.section>
            </main>

            <footer className="px-4 py-6 text-center text-xs text-tertiary">
                ObjectDetection © {new Date().getFullYear()} · Developed by Francisco Lampreia
            </footer>
        </div>
    );
}
