"use client";

import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/custom/layout/confirmation-modal";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string | null;
    onDelete: (teamId: string) => Promise<void>;
    getBack: boolean;
};

export function DeleteTeamModal({ isOpen, onOpenChange, teamId, onDelete, getBack }: Props) {
    const router = useRouter();

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Delete team"
            description="Are you sure you want to delete this team?"
            icon={<Trash2 />}
            warning="The team will be permanently deleted."
            actionLabel="Delete team"
            isDisabled={!teamId}
            onConfirm={async () => {
                if (teamId) await onDelete(teamId);
            }}
            onConfirmed={() => {
                if (getBack) router.push("/team");
            }}
        />
    );
}
