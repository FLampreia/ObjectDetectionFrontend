"use client";

import { Input } from "@/components/base/input/input";
import { SearchLg, Trash01 } from "@untitledui/icons";
import { AddMemberModal } from "../../modals/add-member-modal";
import { Button } from "@/components/base/buttons/button";
import { Team } from "@/types/team";
import { useState } from "react";
import { DeleteTeamModal } from "../../modals/delete-team-modal";
import { useTeams } from "@/hooks/use-team";

type Props = {
    search: string;
    setSearch: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    error: string | null;
    team?: Team;
};

export function MembersHeader({
    search,
    setSearch,
    isOpen,
    setIsOpen,
    team,
}: Props) {
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const { removeTeam } = useTeams();


    return (
        <div className="flex shrink-0 items-center gap-3 max-md:w-full">
            <Input
                className="min-w-0 max-md:flex-1 md:w-70"
                size="md"
                aria-label="Search"
                placeholder="Search"
                icon={SearchLg}
                value={search}
                onChange={setSearch}
            />
            {team?.role === "owner" && (
                <>
                    <AddMemberModal
                        isOpen={isOpen}
                        onOpenChange={setIsOpen}
                    />
                    <Button
                        color="primary-destructive"
                        size="md"
                        iconLeading={Trash01}
                        onClick={() => {
                            setIsDeleteOpen(true)
                        }}
                        isDisabled={team?.is_favorite}
                    >
                        Delete Team
                    </Button>
                </>
            )}

            {!team?.is_favorite && team?.role === "owner" &&(
                <DeleteTeamModal
                    isOpen={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    teamId={team?.id ?? null}
                    onDelete={removeTeam}
                    getBack={true}
                />

            )}

        </div>
    );
}