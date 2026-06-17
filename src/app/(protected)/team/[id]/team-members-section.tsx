"use client"

import { TableCard } from "@/components/application/table/table";
import { Button } from "@/components/base/buttons/button";

interface Props {
    teamId: string;
}

export function TeamMembersSection({ teamId }: Props) {

    return (
        <TableCard.Root>
            <TableCard.Header
                title={`Team ${teamId}`}
            description={`All member of team ${teamId}`}
            contentTrailing={
                <>
                    <div className="flex gap-3 md:pr-9">
                        <Button color="secondary" size="sm" > Import </Button>
                        <Button size="sm" > Add vendor </Button>
                    </div>
                </>
            } 
            />
        </TableCard.Root>);

}