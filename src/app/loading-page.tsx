"use client";

import { Loader2 } from "lucide-react";

export default function LoadingPage() {
    return (
        <section className="flex min-h-screen items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Loader2 
                    size={40} 
                    className="animate-spin text-brand-secondary" 
                />

                <h1 className="text-xl font-semibold text-primary">
                    Loading...
                </h1>

                <p className="text-tertiary">
                    Please wait while we load your account.
                </p>
            </div>
        </section>
    );
}