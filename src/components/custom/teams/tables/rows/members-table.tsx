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
    return (
        <>
            <Table
                aria-label="Members"
                sortDescriptor={sortDescriptor}
                onSortChange={onSortChange}
            >
                <Table.Header>
                    <Table.Head id="role" label="Role" isRowHeader allowsSorting />
                    <Table.Head id="username" label="Username" allowsSorting />
                    <Table.Head id="email" label="Email" allowsSorting />
                    <Table.Head id="actions" />
                </Table.Header>

                <Table.Body items={members}>
                    {(members) => (
                        <Table.Row
                            id={members.user_id}
                        >
                            <Table.Cell>
                                {members.role === "owner" ? (
                                    <BadgeWithIcon size="sm" color="blue" iconLeading={Crown} className="capitalize">
                                        {members.role}
                                    </BadgeWithIcon>
                                ) : members.role === "member" ? (
                                    <BadgeWithIcon size="sm" color="gray" iconLeading={User01} className="capitalize">
                                        {members.role}
                                    </BadgeWithIcon>
                                ) : (
                                    <BadgeWithIcon size="sm" color="error" iconLeading={X} className="capitalize">
                                        {members.role}
                                    </BadgeWithIcon>
                                )}
                            </Table.Cell>

                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        size="md"
                                        initials={members.username[0].toUpperCase()}
                                    />
                                    <p className="text-sm font-medium text-primary">
                                        {members.username}
                                    </p>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center gap-3">

                                    <p className="text-sm font-medium text-tertiary">
                                        {members.email}
                                    </p>
                                </div>
                            </Table.Cell>
                            <Table.Cell>
                                {members.role === "member" && (user?.id == members.user_id) && (
                                    <>
                                        <ButtonUtility
                                            size="xs"
                                            color="tertiary"
                                            tooltip="Leave"
                                            icon={LogOut}
                                            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                if (!user) return;

                                                e.stopPropagation();
                                                setSelectedTeamId(teamId);
                                                setSelectedUserId(user?.id)
                                                setIsRemoveOpen(true);
                                            }}
                                        // FIXME nao está a haver refresh na pagina quando retiro um user
                                        />

                                    </>
                                )}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            {isRemoveOpen && selectedTeamId && selectedUserId && (
                <RemoveUserTeamModal
                    isOpen={isRemoveOpen}
                    onOpenChange={setIsRemoveOpen}
                    teamId={selectedTeamId}
                    userId={selectedUserId}
                    getBack={true}
                />
            )}

        </>
    )
}