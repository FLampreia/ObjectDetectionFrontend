"use client"

import { TableCard } from "@/components/application/table/table";
import { MembersHeader } from "@/components/custom/teams/tables/headers/members-header";
import { MembersTable } from "@/components/custom/teams/tables/rows/members-table";
import { useMembers } from "@/hooks/use-members";
import { useState } from "react";
import { TableState } from "@/components/custom/layout/table-state";
import { useQueryClient } from "@tanstack/react-query";
import type { Team } from "@/types/team";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";

interface Props {
    teamId: string;
}

export function TeamMembersSection({ teamId }: Props) {

    const {
        members,
        allMembers,
        search,
        setSearch,
        sortDescriptor,
        setSortDescriptor,
        currentPage,
        setCurrentPage,
        totalMembers,
        error,
        isLoading,
    } = useMembers(teamId);

    const queryClient = useQueryClient();
    const teams = queryClient.getQueryData<Team[]>(["logged-teams"]) ?? [];
    const team = teams.find(t => t.id === teamId);

    const [isOpen, setIsOpen] = useState(false);


    return (
        <TableCard.Root size="sm">
            <TableCard.Header
                title={team?.name ?? "Team"}
                badge={allMembers.length}
                description={`All members of ${team?.name ?? "team"}`}
                contentTrailing={
                    <MembersHeader
                        search={search}
                        setSearch={setSearch}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        error={error}
                        team={team}
                    />
                }
            />
            <TableState isLoading={isLoading} error={error} isEmpty={allMembers.length === 0} type="member">
                    <MembersTable
                        members={members}
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                        teamId={teamId}
                    />
            </TableState>
            <PaginationPageMinimalCenter
                page={currentPage}
                total={Math.max(1, totalMembers)}
                onPageChange={setCurrentPage}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>);

}
