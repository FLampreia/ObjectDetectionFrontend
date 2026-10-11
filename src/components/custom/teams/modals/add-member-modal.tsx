"use client";

import { Plus, UserPlus } from "lucide-react";
import { DialogTrigger } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { useMembers } from "@/hooks/use-members";
import { TeamFormModal } from "./team-form-modal";
import { useNotification } from "@/providers/notification-provider";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    teamId: string;
};

export function AddMemberModal({ isOpen, onOpenChange, teamId }: Props) {
    const { addMember } = useMembers(teamId);
    const notify = useNotification();

    return (
        <DialogTrigger isOpen={isOpen} onOpenChange={onOpenChange}>
            <Button size="md" iconLeading={Plus} aria-label="Add member">
                <span className="max-md:hidden">Add member</span>
            </Button>
            <TeamFormModal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                title="Add member"
                description="Add a registered user to this team using their email address."
                icon={<UserPlus />}
                label="Member email"
                type="email"
                placeholder="member@example.com"
                actionLabel="Add member"
                onSubmit={async (email) => {
                    await addMember(email);
                    notify("Member added");
                }}
            />
        </DialogTrigger>
    );
}
