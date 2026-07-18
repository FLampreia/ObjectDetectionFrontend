"use client"

import { use } from "react";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default function DetectionInfoScreen({ params }: PageProps) {
    const { id } = use(params);
    return(
        <>
        </>
    )
}