"use client"

import { TableCard } from "@/components/application/table/table";
import { NotFoundTable } from "../../../../components/custom/not-found-table";
import { useQueryClient } from "@tanstack/react-query";
import { Team } from "@/types";
import { useDetections } from "@/hooks/use-detections";
import { DetectionsTable } from "@/components/custom/detection/tables/detections-table";
import { Calendar, SearchLg } from "@untitledui/icons";
import { InputDate } from "@/components/base/input/input-date";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";

interface Props {
    teamId: string;
}

export function TeamDetectionsSection({ teamId }: Props) {

    const queryClient = useQueryClient();
    const teams = queryClient.getQueryData<Team[]>(["all-teams"]) ?? [];
    const team = teams.find(t => t.id === teamId);

    const {
        detections,
        allDetections,
        setSearchDate,
        sortDescriptor,
        setSortDescriptor,
        currentPage,
        setCurrentPage,
        totalDetections,

        error,
    } = useDetections(teamId);

    return (
        <TableCard.Root>
            <TableCard.Header
                title={team?.name ?? "Team"}
                badge={allDetections.length}
                description={
                    `All detections associated to ${team?.name ?? "team"}`
                }
                contentTrailing={
                    <InputDate
                        className="min-w-0 max-md:flex-1 md:w-70"
                        aria-label="date"
                        size="md"
                        icon={Calendar}
                        onChange={setSearchDate}
                    />
                }
            />

            {
                allDetections.length !== 0
                    ?
                    <DetectionsTable
                        detections={detections}
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                    />
                    :
                    <NotFoundTable type="detection" />
            }
            <PaginationPageMinimalCenter
                page={currentPage}
                total={totalDetections}
                onPageChange={setCurrentPage}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>

    )
}

