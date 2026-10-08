"use client"

import { History } from "lucide-react";
import { PageHeader } from "@/components/custom/layout/page-header";
import { AllDetectionsSection } from "./all-detections-section";


export default function HistoryScreen() {

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full flex-col justify-between">

            <PageHeader
                title="History"
                description="Review past detections and manage your results."
                icon={<History />}
            />

            <section>
                <AllDetectionsSection/>
            </section>

        </main>
    )
}
