"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CheckCircle2, X } from "lucide-react";
import { Button } from "@/components/base/buttons/button";

const NotificationContext = createContext<((message: string) => void) | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [notification, setNotification] = useState<{ message: string } | null>(null);
    const notify = useCallback((message: string) => setNotification({ message }), []);

    useEffect(() => {
        if (!notification) return;
        const timeout = window.setTimeout(() => setNotification(null), 5000);
        return () => window.clearTimeout(timeout);
    }, [notification]);

    return (
        <NotificationContext.Provider value={notify}>
            {children}
            <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[100] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
                <div role="status" aria-live="polite" aria-atomic="true">
                    {notification && (
                        <div className="pointer-events-auto flex max-w-sm items-center gap-3 rounded-xl border border-secondary bg-primary px-4 py-3 text-sm text-primary shadow-lg">
                            
                            <CheckCircle2 aria-hidden="true" className="size-5 shrink-0 text-success-primary" />
                            
                            <span>{notification.message}</span>
                            
                            <Button
                                color="tertiary"
                                aria-label="Dismiss notification"
                                onClick={() => setNotification(null)}
                                className="ml-2 rounded-md p-1 text-tertiary hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                            >
                                <X aria-hidden="true" className="size-4" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const notify = useContext(NotificationContext);
    if (!notify) throw new Error("useNotification requires NotificationProvider");
    return notify;
}
