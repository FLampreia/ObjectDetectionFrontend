"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
    const [client] = useState(() => queryClient);

    return (
        <QueryClientProvider client={client}>
            {children}
        </QueryClientProvider>
    );
}