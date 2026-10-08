"use client";

import { LogOut, UserMinus } from "lucide-react";
import { useRouter } from "next/navigation";
import { ConfirmationModal } from "@/components/custom/layout/confirmation-modal";
import { useAuth } from "@/hooks/use-auth";
import { useMembers } from "@/hooks/use-members";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string | null;
    userId: string;
    getBack: boolean;
    isCurrentUserOwner: boolean;
};

export function RemoveUserTeamModal({ isOpen, onOpenChange, teamId, userId, getBack, isCurrentUserOwner: isOwner }: Props) {
    const { removeMember } = useMembers(teamId!);
    const { user } = useAuth();
    const router = useRouter();
    const isLeaving = userId === user?.id;

    return (
        <ConfirmationModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title={isLeaving ? "Leave team" : "Remove member"}
            description={isLeaving ? "Are you sure you want to leave this team?" : "Are you sure you want to remove this member from the team?"}
            icon={isLeaving ? <LogOut /> : <UserMinus />}
            warningTitle="Team access will be removed."
            warning={isLeaving ? "You will need to be added again to regain access to this team." : "This member will need to be added again to regain access to the team."}
            actionLabel={isLeaving ? "Leave team" : "Remove member"}
            isDisabled={!teamId}
            onConfirm={async () => {
                if (teamId) await removeMember(userId);
            }}
            onConfirmed={() => {
                if (getBack && !isOwner) router.push("/team");
            }}
        />
    );
}
