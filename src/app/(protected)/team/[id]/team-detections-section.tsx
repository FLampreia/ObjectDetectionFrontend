"use client"

import { TableCard } from "@/components/application/table/table";
import { NotFoundTable } from "../not-found-table";
import { useQueryClient } from "@tanstack/react-query";
import { Team } from "@/types";
import { useDetections } from "@/hooks/use-detections";
import { DetectionsTable } from "@/components/custom/detection/table/detections-table";

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
        error
    } = useDetections(teamId);


    return (
        <TableCard.Root>
            <TableCard.Header
                title={team?.name ?? "Team"}
                badge={allDetections.length}
                description={
                    `All detections associated to ${team?.name ?? "team"}`
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

        </TableCard.Root>

    )
}

