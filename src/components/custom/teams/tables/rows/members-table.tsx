"use client";

import { Member } from "@/types/team";
import type { SortDescriptor } from "react-aria-components";
import { Table } from "@/components/application/table/table";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { Crown, LogOut } from "lucide-react";
import { Avatar } from "@/components/base/avatar/avatar";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Trash01, Edit01, X, User01, List } from "@untitledui/icons";
import { useState } from "react";
import { exitTeam } from "@/services/members";
import { useTeams } from "@/hooks/use-team";
import { useAuth } from "@/hooks/use-auth";
import { RemoveUserTeamModal } from "../../modals/remove-user-team-modal";
import { useRouter } from "next/navigation";
import { MobileRowDetails } from "@/components/custom/layout/mobile-row-details";



type Props = {
    teamId: string;
    members: Member[];
    sortDescriptor: SortDescriptor;
    onSortChange: (value: SortDescriptor) => void;
};

export function MembersTable({ teamId, members, sortDescriptor, onSortChange }: Props) {
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { user } = useAuth()

    const currentUserMember = members.find(m => m.user_id === user?.id);
    const isOwner = currentUserMember?.role === "owner";

    return (
        <>
            <Table
                aria-label="Members"
                sortDescriptor={sortDescriptor}
                onSortChange={onSortChange}
            >
                <Table.Header>
                    <Table.Head id="role" label="Role" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="username" label="Username" isRowHeader allowsSorting />
                    <Table.Head id="email" label="Email" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="actions" />
                </Table.Header>

                <Table.Body items={members}>
                    {(member) => {
                        const isCurrentUser = user?.id === member.user_id;
                        const currentUserMember = members.find(m => m.user_id === user?.id);
                        const isOwner = currentUserMember?.role === "owner";

                        const showLeave =
                            (isOwner && !isCurrentUser) ||
                            (!isOwner && isCurrentUser);

                        return (
                            <Table.Row
                                id={member.user_id}
                            >
                                <Table.Cell className="hidden md:table-cell">
                                    {member.role === "owner" ? (
                                        <BadgeWithIcon size="sm" color="blue" iconLeading={Crown} className="capitalize">
                                            {member.role}
                                        </BadgeWithIcon>
                                    ) : member.role === "member" ? (
                                        <BadgeWithIcon size="sm" color="gray" iconLeading={User01} className="capitalize">
                                            {member.role}
                                        </BadgeWithIcon>
                                    ) : (
                                        <BadgeWithIcon size="sm" color="error" iconLeading={X} className="capitalize">
                                            {member.role}
                                        </BadgeWithIcon>
                                    )}
                                </Table.Cell>

                                <Table.Cell>
                                    <div className="flex items-center gap-3">
                                        <Avatar
                                            size="md" className="max-md:hidden"
                                            initials={member.username[0].toUpperCase()}
                                        />
                                        <p className="max-w-48 break-words text-sm font-medium text-primary md:max-w-none">
                                            {member.username}
                                        </p>
                                    </div>
                                    <MobileRowDetails items={[
                                        { label: "Role", value: member.role },
                                        { label: "Email", value: member.email },
                                    ]} />
                                </Table.Cell>
                                <Table.Cell className="hidden md:table-cell">
                                    <div className="flex items-center gap-3">

                                        <p className="text-sm font-medium text-tertiary">
                                            {member.email}
                                        </p>
                                    </div>
                                </Table.Cell>
                                <Table.Cell>
                                    {showLeave && (
                                        <ButtonUtility
                                            size="xs"
                                            color="tertiary"
                                            tooltip="Leave"
                                            icon={LogOut}
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                if (!user) return;

                                                e.stopPropagation();
                                                setSelectedTeamId(teamId);
                                                setSelectedUserId(member.user_id);
                                                setIsRemoveOpen(true);
                                            }}
                                        />
                                    )}
                                </Table.Cell>
                            </Table.Row>
                        )
                    }}
                </Table.Body>
            </Table>

            {isRemoveOpen && selectedTeamId && selectedUserId && (
                <RemoveUserTeamModal
                    isOpen={isRemoveOpen}
                    onOpenChange={setIsRemoveOpen}
                    teamId={selectedTeamId}
                    userId={selectedUserId}
                    getBack={true}
                    isCurrentUserOwner={!!isOwner}
                />
            )}

        </>
    )
}
