"use client";

import { Pencil } from "lucide-react";
import { useTeams } from "@/hooks/use-team";
import type { Team } from "@/types/team";
import { TeamFormModal } from "./team-form-modal";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    team: Team;
};

export function EditTeamModal({ isOpen, onOpenChange, team }: Props) {
    const { editTeam } = useTeams();

    return (
        <TeamFormModal
            key={team.id}
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Edit team"
            description="Update the name displayed to your team members."
            icon={<Pencil />}
            label="Team name"
            placeholder="Enter a team name"
            initialValue={team.name}
            actionLabel="Save changes"
            onSubmit={(name) => editTeam(team.id, name)}
        />
    );
}
