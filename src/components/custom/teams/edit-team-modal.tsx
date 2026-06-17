"use client";

import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { useTeams } from "@/hooks/use-team";
import { Team } from "@/types/team";
import { useState } from "react";
import { Heading } from "react-aria-components";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    team: Team;

};

export function EditTeamModal({ isOpen, onOpenChange, team }: Props) {
    const { editTeam } = useTeams();
    const [error, setError] = useState<string | null>(null);
    const [teamName, setTeamName] = useState(() => team.name)
    

    // const handleDelete = async () => {
    //     if (!teamId) return;

    //     await removeTeam(teamId);
    //     onOpenChange(false);
    // };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal>
                <Dialog className="p-6 w-105 space-y-4">

                    <Heading slot="title" className="text-xl font-semibold"> Edit Team</Heading>

                    <form
                        className="space-y-4"
                        onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                            e.preventDefault();
                            setError(null);

                            const form = e.currentTarget;

                            try {
                                if (!team?.id || teamName === null) return;

                                

                                await editTeam(team.id, teamName);

                                form.reset();
                                onOpenChange(false);
                            } catch (err: unknown) {
                                setError(err instanceof Error ? err.message : "Unexpected Error");
                            }
                        }}
                    >
                        <Input
                            type="text"
                            label="Team Name"
                            value={teamName}
                            onChange={(value) => {
                                setTeamName(value);
                                setError(null)
                            }}
                            hint={error ?? undefined}
                        />

                        <div className="flex justify-end gap-2">
                            <Button color="secondary" size="md" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>

                            <Button type="submit" size="md">
                                Save changes
                            </Button>
                        </div>
                    </form>


                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}