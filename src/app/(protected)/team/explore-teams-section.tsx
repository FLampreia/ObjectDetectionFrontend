"use client"


import { useState } from "react";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { TableCard } from "@/components/application/table/table";


import { LoggedTeamsHeader } from "@/components/custom/teams/tables/headers/logged-teams-header";
import { LoggedTeamsTable } from "@/components/custom/teams/tables/rows/logged-teams-table";

import { useTeams } from "@/hooks/use-team";
import { NotFoundTable } from "../../../components/custom/not-found-table";
import { ExploreTeamsHeader } from "@/components/custom/teams/tables/headers/explore-teams-header";
import { ExploreTeamsTable } from "@/components/custom/teams/tables/rows/explore-teams-table";
import { useQueryClient } from "@tanstack/react-query";
import { Member } from "@/types/team";



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
    } = useTeams();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <TableCard.Root>
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
            {allTeams.length != 0 ? (
                <ExploreTeamsTable
                    teams={teams}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
            ) : (
                <NotFoundTable type="team" />
            )}


            <PaginationPageMinimalCenter
                page={currentPageAll}
                total={totalPagesAll}
                onPageChange={setCurrentPageAll}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>
    );
}