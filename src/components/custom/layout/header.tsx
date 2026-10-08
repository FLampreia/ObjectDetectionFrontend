"use client";

import { ArrowUpRight } from "lucide-react";
import { Link } from "react-aria-components";
import { NavAccountCard } from "@/components/application/app-navigation/base-components/nav-account-card";
import { Button } from "@/components/base/buttons/button";
import { NavigationBrand } from "@/components/custom/layout/navigation-brand";
import { useAuth } from "@/hooks/use-auth";

export default function Header() {
    const { user } = useAuth();

    return (
        <header className="sticky top-0 z-40 w-full border-b border-primary bg-primary/95 backdrop-blur-md">
            <div className="mx-auto flex min-h-20 max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
                <NavigationBrand href="/" />

                <nav aria-label="Welcome page navigation" className="hidden items-center gap-6 lg:flex">
                    {[
                        { href: "#features", label: "Features" },
                        { href: "#workflow", label: "How it works" },
                        { href: "#demo", label: "Preview" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="rounded-md text-sm font-medium text-tertiary outline-focus-ring transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4"
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                {user ? (
                    <>
                        <div className="hidden w-64 md:block">
                            <NavAccountCard user={user} />
                        </div>
                        <Button href="/dashboard" color="secondary" size="sm" className="md:hidden">
                            Dashboard
                        </Button>
                    </>
                ) : (
                    <Button href="/auth" size="md" iconTrailing={ArrowUpRight}>
                        Get started
                    </Button>
                )}
            </div>
        </header>
    );
}
