"use client";

import { Pencil } from "lucide-react";
import { useTeams } from "@/hooks/use-team";
import type { Team } from "@/types/team";
import { TeamFormModal } from "./team-form-modal";
import { useNotification } from "@/providers/notification-provider";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    team: Team;
};

export function EditTeamModal({ isOpen, onOpenChange, team }: Props) {
    const { editTeam } = useTeams();
    const notify = useNotification();

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
            onSubmit={async (name) => {
                if (name === team.name) return;
                await editTeam(team.id, name);
                notify("Team updated");
            }}
        />
    );
}
