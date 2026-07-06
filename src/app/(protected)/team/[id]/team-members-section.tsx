"use client"

import { TableCard } from "@/components/application/table/table";
import { Button } from "@/components/base/buttons/button";
import { MembersHeader } from "@/components/custom/teams/tables/headers/members-header";
import { MembersTable } from "@/components/custom/teams/tables/rows/members-table";
import { useMembers } from "@/hooks/use-members";
import { useState } from "react";
import { NotFoundTable } from "../not-found-table";
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
    } = useMembers(teamId);

    const queryClient = useQueryClient();
    const teams = queryClient.getQueryData<Team[]>(["logged-teams"]) ?? [];
    const team = teams.find(t => t.id === teamId);

    const [isOpen, setIsOpen] = useState(false);

    console.log(team)

    return (
        <TableCard.Root>
            <TableCard.Header
                title={team?.name ?? "Team"}
                badge={members.length}
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
            {allMembers.length != 0 ? (
                <>
                    <MembersTable
                        members={members}
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                        teamId={teamId}
                    />
                </>
            ) : (
                <NotFoundTable type="member" />
            )}
            <PaginationPageMinimalCenter
                page={currentPage}
                total={totalMembers}
                onPageChange={setCurrentPage}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>);

}