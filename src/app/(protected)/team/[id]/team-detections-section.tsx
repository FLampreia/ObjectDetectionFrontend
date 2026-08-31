"use client"

import { TableCard } from "@/components/application/table/table";
import { NotFoundTable } from "../../../../components/custom/not-found-table";
import { useQueryClient } from "@tanstack/react-query";
import { Team } from "@/types";
import { useTeamDetections } from "@/hooks/use-team-detections";
import { DetectionsTable } from "@/components/custom/detection/tables/detections-table";
import { Calendar, SearchLg } from "@untitledui/icons";
import { InputDate } from "@/components/base/input/input-date";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { Button } from "@/components/base/buttons/button";
import { Eraser } from "lucide-react";

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
        searchDate,
        setSearchDate,
        sortDescriptor,
        setSortDescriptor,
        currentPage,
        setCurrentPage,
        totalDetections,

        error,
    } = useTeamDetections(teamId);

    return (
        <TableCard.Root>
            <TableCard.Header
                title={team?.name ?? "Team"}
                badge={allDetections.length}
                description={
                    `All detections associated to ${team?.name ?? "team"}`
                }
                contentTrailing={
                    <div className="flex items-center gap-2">
                        {searchDate && (
                            <Button
                                size="md"
                                color="secondary"
                                onClick={() => setSearchDate(null)}
                                aria-label="Clear date"
                            >
                                <Eraser size={16} />
                            </Button>
                        )}
                        <DatePicker size="md" aria-label="Date picker" value={searchDate} onChange={setSearchDate} />
                    </div>
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

