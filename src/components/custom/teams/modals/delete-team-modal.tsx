"use client";

import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Heading } from "react-aria-components";
import { useRouter } from "next/navigation";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string | null;
    onDelete: (teamId: string) => Promise<void>;
    getBack: boolean
};

export function DeleteTeamModal({ isOpen, onOpenChange, teamId, onDelete, getBack }: Props) {

    const router = useRouter();

    const handleDelete = async () => {
        if (!teamId) return;

        await onDelete(teamId);
        onOpenChange(false);

        if (getBack) router.push("/team");
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