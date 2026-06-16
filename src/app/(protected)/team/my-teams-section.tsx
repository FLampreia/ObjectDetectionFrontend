"use client"

import { useState} from "react";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { TableCard } from "@/components/application/table/table";


import { TeamsHeader } from "@/components/custom/teams/teams-header";
import { TeamsTable } from "@/components/custom/teams/teams-table";

import { useTeams } from "@/hooks/use-team";


export function MyTeamsSection() {


    const {
        teams,
        paginatedTeams,
        totalPages,
        search,
        setSearch,
        currentPage,
        setCurrentPage,
        sortDescriptor,
        setSortDescriptor,
        
        error,
    } = useTeams();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <TableCard.Root>
            <TableCard.Header
                title="My Teams"
                badge={teams.length}
                description="Manage all your teams"
                contentTrailing={
                    <TeamsHeader
                        search={search}
                        setSearch={setSearch}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        error={error}
                    />
                }
            />

            <TeamsTable
                teams={paginatedTeams}
                sortDescriptor={sortDescriptor}
                onSortChange={setSortDescriptor}
            />

            <PaginationPageMinimalCenter
                page={currentPage}
                total={totalPages}
                onPageChange={setCurrentPage}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>
    );
}
