"use client"

import { useState } from "react";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { TableCard } from "@/components/application/table/table";


import { LoggedTeamsHeader } from "@/components/custom/teams/tables/headers/logged-teams-header";
import { LoggedTeamsTable } from "@/components/custom/teams/tables/rows/logged-teams-table";

import { useTeams } from "@/hooks/use-team";
import { NotFoundTable } from "../../../components/custom/not-found-table";


export function MyTeamsSection() {


    const {
        loggedTeams: teams,
        allLoggedTeams: allTeams,
        totalPagesLogged,
        search,
        setSearchLogged: setSearch,
        currentPageLogged,
        setCurrentPageLogged,
        sortDescriptor,
        setSortDescriptor,

        error,
    } = useTeams();

    const [isOpen, setIsOpen] = useState(false);

    return (
        <TableCard.Root>
            <TableCard.Header
                title="My Teams"
                badge={allTeams.length}
                description="Manage all your teams"
                contentTrailing={
                    <LoggedTeamsHeader
                        search={search}
                        setSearch={setSearch}
                        isOpen={isOpen}
                        setIsOpen={setIsOpen}
                        error={error}
                    />
                }
            />
            {allTeams.length != 0 ? (
                <LoggedTeamsTable
                    teams={teams}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
            ) : (
                <NotFoundTable type="team"/>
            )}


            <PaginationPageMinimalCenter
                page={currentPageLogged}
                total={totalPagesLogged}
                onPageChange={setCurrentPageLogged}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>
    );
}
