"use client";

import { useStats } from "@/hooks/use-stats";

import TopObjectsChart from "./top-objects-chart";
import TopModelsChart from "./top-models-chart";
import InfoCards from "./info-cards";
import { Button } from "@/components/base/buttons/button";
import { useRouter } from "next/navigation";
import { BarChartSquare02, Camera01 } from "@untitledui/icons";
import { PageHeader } from "@/components/custom/layout/page-header";
import { DetectionsTable } from "@/components/custom/detection/tables/detections-table";
import { TableCard } from "@/components/application/table/table";
import { NotFoundTable } from "@/components/custom/not-found-table";
import { Loading } from "@/components/custom/layout/loading";
import { InlineFeedback } from "@/components/custom/layout/inline-feedback";

export default function DetectionScreen() {
    const router = useRouter();
    const {
        stats,
        isLoading,
        error,
    } = useStats();

    if (isLoading) {
        return (
            <main className="flex-1 max-w-7xl mx-auto w-full">
                <PageHeader
                    title="Dashboard"
                    description="An overview of your detections, objects and model activity."
                    icon={<BarChartSquare02 />}
                />

                <Loading
                    details="load the dashboard"
                />

            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1 max-w-7xl mx-auto w-full">
                <PageHeader
                    title="Dashboard"
                    description="An overview of your detections, objects and model activity."
                    icon={<BarChartSquare02 />}
                />
                <InlineFeedback>An error occurred while loading data. Please try again.</InlineFeedback>
            </main>
        );
    }

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full">

            <PageHeader
                title="Dashboard"
                description="An overview of your detections, objects and model activity."
                icon={<BarChartSquare02 />}
                actions={
                    <Button
                        iconLeading={Camera01}
                        onClick={() => router.push("/detection")}
                        className="w-full sm:w-auto"
                    >
                        New Detection
                    </Button>
                }
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Left column */}
                <div className="flex min-h-72 min-w-0 flex-col">
                    <InfoCards
                        total_detections={stats?.total_detections}
                        total_objects={stats?.total_objects}
                        detection_types={stats?.detection_types}
                    />
                </div>

                {/* Middle column */}
                <div className="min-w-0">
                    <TopObjectsChart top_objetcs={stats?.top_objects} />
                </div>

                {/* Right column */}
                <div className="min-w-0">
                    <TopModelsChart top_models={stats?.top_models} />
                </div>

                {/* Latest detections table */}
                <div className="lg:col-span-3 mb-8">

                    <TableCard.Root size="sm">
                        <TableCard.Header
                            title={"Recent Detections"}
                            badge={stats?.last_detections.length}
                            description={
                                `Last detections done`
                            }
                        />

                        {stats?.last_detections.length !== 0
                            ?
                            <DetectionsTable
                                detections={stats?.last_detections ?? []}
                            />
                            :
                            <NotFoundTable type="detection" />
                        }

                    </TableCard.Root>

                </div>
            </div>
        </main>
    );
}
