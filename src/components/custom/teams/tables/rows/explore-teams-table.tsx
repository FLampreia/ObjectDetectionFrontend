"use client";

import { Table } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Trash01, Edit01, X, User01, List } from "@untitledui/icons";
import { Crown, Star, LogOut } from "lucide-react";
import type { SortDescriptor } from "react-aria-components";
import type { Team } from "@/types/team";
import { useTeams } from "@/hooks/use-team";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DeleteTeamModal } from "../../modals/delete-team-modal";
import { EditTeamModal } from "../../modals/edit-team-modal";
import { RemoveUserTeamModal } from "../../modals/remove-user-team-modal";
import { useAuth } from "@/hooks/use-auth";
import { RoleBadge } from "../../role-badge";
import { MobileRowDetails } from "@/components/custom/layout/mobile-row-details";

type Props = {
    teams: Team[];
    sortDescriptor: SortDescriptor;
    onSortChange: (value: SortDescriptor) => void;

};

export function ExploreTeamsTable({ teams, sortDescriptor, onSortChange }: Props) {
    const router = useRouter();
    const { user } = useAuth();

    const {
        toggleFavorite,
        removeTeam,
    } = useTeams()

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isRemoveOpen, setIsRemoveOpen] = useState(false);
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);

    return (
        <>
            <Table
                aria-label="Teams"
                sortDescriptor={sortDescriptor}
                onSortChange={onSortChange}
            >
                <Table.Header>
                    <Table.Head id="name" label="Name" isRowHeader allowsSorting />
                    <Table.Head id="created_at" label="Created at" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="owner" label="Owner Name" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="actions" />
                </Table.Header>

                <Table.Body items={teams}>
                    {(team) => (
                        <Table.Row
                            id={team.id}
                        >

                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        size="md" className="max-md:hidden"
                                        initials={team.name[0].toUpperCase()}
                                    />
                                    <p className="max-w-48 break-words text-sm font-medium text-primary md:max-w-none">
                                        {team.name}
                                    </p>
                                </div>
                                <MobileRowDetails items={[
                                    { label: "Created at", value: new Date(team.created_at).toLocaleDateString() },
                                    { label: "Owner", value: team.owner.email },
                                ]} />
                            </Table.Cell>

                            <Table.Cell className="hidden md:table-cell">
                                {new Date(team.created_at).toLocaleDateString()}
                            </Table.Cell>

                            <Table.Cell className="hidden md:table-cell">
                                <div className="flex items-center gap-3">
                                    
                                    <p className="text-sm font-medium text-tertiary">
                                        {team.owner.email}
                                    </p>
                                </div>
                            </Table.Cell>

                            <Table.Cell>
                                <div className="flex justify-end">

                                    <ButtonUtility size="xs" color="tertiary" tooltip="List" icon={List} onClick={() => router.push(`/team/${team.id}`)} />

                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table >

            {isDeleteOpen && selectedTeamId && (
                <DeleteTeamModal
                    isOpen={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    teamId={selectedTeamId}
                    onDelete={removeTeam}
                    getBack={false}
                />
            )}


            {isRemoveOpen && selectedTeamId && selectedUserId && (
                <RemoveUserTeamModal
                    isOpen={isRemoveOpen}
                    onOpenChange={setIsRemoveOpen}
                    teamId={selectedTeamId}
                    userId={selectedUserId}
                    getBack={false}
                    isCurrentUserOwner={false}
                />
            )}

            {isEditOpen && selectedTeam && (
                <EditTeamModal
                    isOpen={isEditOpen}
                    onOpenChange={setIsEditOpen}
                    team={selectedTeam}
                />
            )}


        </>
    );
}
