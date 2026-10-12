"use client";

import { ArrowLeft, ArrowRight, Home, ScanSearch } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { NavigationBrand } from "@/components/custom/layout/navigation-brand";

export default function NotFound() {
    const router = useRouter();

    const goBack = () => {
        if (window.history.length > 1) {
            router.back();
        } else {
            router.replace("/");
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-primary text-primary">
            <header className="border-b border-primary bg-primary/95">
                <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
                    <NavigationBrand href="/" />
                    <Button href="/" color="link-gray" size="sm" iconLeading={Home}>
                        Home
                    </Button>
                </div>
            </header>

            <main className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:gap-20 lg:px-8">
                <section aria-labelledby="not-found-title">
                    <span className="inline-flex items-center gap-2 rounded-full bg-brand-solid px-4 py-2 text-sm font-semibold text-white shadow-xs">
                        <ScanSearch aria-hidden="true" className="size-4" />
                        404 error
                    </span>

                    <h1 id="not-found-title" className="mt-6 text-display-md font-semibold tracking-tight sm:text-display-lg lg:text-display-xl">
                        Page not found
                    </h1>
                    <p className="mt-5 max-w-md text-md leading-7 text-tertiary sm:text-lg">
                        The page you&apos;re looking for may have moved, or the link may be incorrect.
                        Head back home to continue exploring your detections.
                    </p>

                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <Button href="/" size="xl" iconTrailing={ArrowRight}>
                            Back to home
                        </Button>
                        <Button color="secondary" size="xl" iconLeading={ArrowLeft} onClick={goBack}>
                            Go back
                        </Button>
                    </div>
                </section>

                <div aria-hidden="true" className="relative flex min-h-64 flex-col items-center justify-center overflow-hidden rounded-2xl border border-secondary bg-secondary p-8 sm:min-h-88 lg:min-h-104">
                    <div className="absolute inset-6 rounded-xl border border-secondary sm:inset-8" />
                    <div className="absolute left-6 top-6 size-9 rounded-tl-xl border-l-2 border-t-2 border-brand sm:left-8 sm:top-8" />
                    <div className="absolute right-6 top-6 size-9 rounded-tr-xl border-r-2 border-t-2 border-brand sm:right-8 sm:top-8" />
                    <div className="absolute bottom-6 left-6 size-9 rounded-bl-xl border-b-2 border-l-2 border-brand sm:bottom-8 sm:left-8" />
                    <div className="absolute bottom-6 right-6 size-9 rounded-br-xl border-b-2 border-r-2 border-brand sm:bottom-8 sm:right-8" />

                    <span className="text-[100px] leading-none font-semibold tracking-tight text-primary sm:text-[144px]">404</span>
                    <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-secondary bg-primary px-3 py-2 text-sm font-medium text-tertiary shadow-xs">
                        <ScanSearch className="size-4 text-brand-secondary" />
                        No matching page
                    </div>
                </div>
            </main>

            <footer className="border-t border-secondary px-4 py-5 text-center text-xs text-tertiary sm:px-6">
                ObjectDetection · Detect. Track. Count.
            </footer>
        </div>
    );
}
