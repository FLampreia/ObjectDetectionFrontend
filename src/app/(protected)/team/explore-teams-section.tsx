"use client"


import { useState } from "react";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { TableCard } from "@/components/application/table/table";



import { useTeams } from "@/hooks/use-team";
import { TableState } from "@/components/custom/layout/table-state";
import { ExploreTeamsHeader } from "@/components/custom/teams/tables/headers/explore-teams-header";
import { ExploreTeamsTable } from "@/components/custom/teams/tables/rows/explore-teams-table";



export function ExploreTeamsSection() {


    const {
        teams,
        allTeams,
        totalPagesAll,
        search,
        setSearchLogged: setSearch,
        currentPageAll,
        setCurrentPageAll,
        sortDescriptor,
        setSortDescriptor,

        error,
        loading,
    } = useTeams();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <TableCard.Root size="sm">
            <TableCard.Header
                title="Explore Teams"
                badge={allTeams.length}
                description="Explore all available teams"
                contentTrailing={
                    <ExploreTeamsHeader
                        search={search}
                        setSearch={setSearch}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        error={error}
                    />
                }
            />
            <TableState isLoading={loading} error={error} isEmpty={allTeams.length === 0} type="team">
                <ExploreTeamsTable
                    teams={teams}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
            </TableState>


            <PaginationPageMinimalCenter
                page={currentPageAll}
                total={Math.max(1, totalPagesAll)}
                onPageChange={setCurrentPageAll}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>
    );
}
