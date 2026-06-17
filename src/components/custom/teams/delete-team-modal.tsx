"use client";

import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { useTeams } from "@/hooks/use-team";
import { Heading } from "react-aria-components";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string | null;
};

export function DeleteTeamModal({ isOpen, onOpenChange, teamId }: Props) {
    const { removeTeam } = useTeams();

    const handleDelete = async () => {
        if (!teamId) return;

        await removeTeam(teamId);
        onOpenChange(false);
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal>
                <Dialog className="p-6 w-105 space-y-4">
                    
                    <Heading slot="title" className="text-xl font-semibold"> Delete Team</Heading>


                    <p>Are you sure you want to delete this team?</p>

                    <div className="flex justify-end gap-2">
                        <Button
                            color="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            color="primary-destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}