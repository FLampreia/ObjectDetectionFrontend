"use client";

import { Modal, ModalOverlay, Dialog } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Trash2, X } from "lucide-react";
import { useId } from "react";
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
    const descriptionId = useId();
    const warningId = useId();

    const handleDelete = async () => {
        if (!teamId) return;

        await onDelete(teamId);
        onOpenChange(false);

        if (getBack) router.push("/team");
    };
    return (
        <ModalOverlay isOpen={isOpen} onOpenChange={onOpenChange}>
            <Modal className="w-full max-w-md">
                <Dialog className="p-5 sm:p-6" aria-describedby={`${descriptionId} ${warningId}`}>
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-error-primary ring-1 ring-error_subtle ring-inset">
                            <Trash2 aria-hidden="true" className="size-6 text-error-primary" />
                        </div>
                        <ButtonUtility
                            size="sm"
                            color="tertiary"
                            icon={X}
                            tooltip="Close"
                            onClick={() => onOpenChange(false)}
                        />
                    </div>

                    <Heading slot="title" className="mt-5 text-xl font-semibold text-primary">Delete team</Heading>
                    <p id={descriptionId} className="mt-2 text-sm leading-6 text-tertiary">
                        Are you sure you want to delete this team?
                    </p>

                    <div id={warningId} className="mt-5 rounded-lg border border-error_subtle bg-error-primary px-4 py-3">
                        <p className="text-sm font-semibold text-error-primary">This action cannot be undone.</p>
                        <p className="mt-1 text-sm leading-5 text-secondary">
                            The team will be permanently deleted.
                        </p>
                    </div>

                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-secondary pt-5 sm:flex-row">
                        <Button
                            color="secondary"
                            size="md"
                            className="w-full sm:flex-1"
                            autoFocus
                            onPress={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>

                        <Button
                            color="primary-destructive"
                            size="md"
                            className="w-full sm:flex-1"
                            isDisabled={!teamId}
                            onPress={handleDelete}
                        >
                            Delete team
                        </Button>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
