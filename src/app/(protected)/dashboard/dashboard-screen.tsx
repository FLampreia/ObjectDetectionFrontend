"use client";

import { useStats } from "@/hooks/use-stats";

import TopObjectsChart from "./top-objects-chart";
import TopModelsChart from "./top-models-chart";
import InfoCards from "./info-cards";
import { Button } from "@/components/base/buttons/button";
import { useRouter } from "next/navigation";
import { Camera01 } from "@untitledui/icons";
import { DetectionsTable } from "@/components/custom/detection/tables/detections-table";
import { TableCard } from "@/components/application/table/table";
import { NotFoundTable } from "@/components/custom/not-found-table";
import { Loading } from "@/components/custom/layout/loading";

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
                <h1 className="text-3xl font-bold mb-8 pt-8">
                    Dashboard
                </h1>

                <Loading
                    details="load the dashboard"
                />
                
            </main>
        );
    }

    if (error) {
        return (
            <main className="flex-1 max-w-7xl mx-auto w-full">
                <h1 className="text-3xl font-bold mb-8 pt-8">
                    Dashboard
                </h1>
                <p>An error occurred while loading data.</p>
            </main>
        );
    }

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full">

            <div className="flex flex-col gap-4 mb-8 pt-8 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-3xl font-bold">
                    Dashboard
                </h1>

                <Button
                    iconLeading={Camera01}
                    onClick={() => router.push("/detection")}
                    className="w-full sm:w-auto"
                >
                    New Detection
                </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Coluna esquerda */}
                <div className="flex min-h-72 min-w-0 flex-col">
                    <InfoCards
                        total_detections={stats?.total_detections}
                        total_objects={stats?.total_objects}
                        detection_types={stats?.detection_types}
                    />
                </div>

                {/* Coluna do meio */}
                <div className="min-w-0">
                    <TopObjectsChart top_objetcs={stats?.top_objects} />
                </div>

                {/* Coluna direita */}
                <div className="min-w-0">
                    <TopModelsChart top_models={stats?.top_models} />
                </div>

                {/* Tabela de Ultimas deteções */}
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
