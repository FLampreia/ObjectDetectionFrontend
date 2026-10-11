"use client";

import { Plus, Users } from "lucide-react";
import { DialogTrigger } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { useTeams } from "@/hooks/use-team";
import { TeamFormModal } from "./team-form-modal";
import { useNotification } from "@/providers/notification-provider";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CreateTeamModal({ isOpen, onOpenChange }: Props) {
    const { createTeam } = useTeams();
    const notify = useNotification();

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
            <Button size="md" iconLeading={Plus} aria-label="Create team">
                <span className="max-md:hidden">Create team</span>
            </Button>
            <TeamFormModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title="Create team"
                description="Create a space to collaborate and share detection results."
                icon={<Users />}
                label="Team name"
                placeholder="Enter a team name"
                actionLabel="Create team"
                onSubmit={async (name) => {
                    await createTeam(name);
                    notify("Team created");
                }}
            />
        </DialogTrigger>
    );
}
