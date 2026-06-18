"use client";

import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { useTeams } from "@/hooks/use-team";
import { useRouter } from "next/navigation";
import { Heading } from "react-aria-components";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string | null;
    userId: string
    getBack: boolean
};

export function RemoveUserTeamModal({ isOpen, onOpenChange, teamId, userId, getBack }: Props) {
    const { removeUserTeam } = useTeams();
    const router = useRouter();

    const handleRemoveUser = async () => {
        if (!teamId) return;

        await removeUserTeam(teamId, userId);
        onOpenChange(false);
        
        if (getBack) router.push("/team")
    };

    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal>
                <Dialog className="p-6 w-105 space-y-4">
                    
                    <Heading slot="title" className="text-xl font-semibold"> Leave Team</Heading>

                    <p>Are you sure you want to leave this team?</p>

                    <div className="flex justify-end gap-2">
                        <Button
                            color="secondary"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            color="primary-destructive"
                            onClick={handleRemoveUser}
                        >
                            Leave
                        </Button>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}