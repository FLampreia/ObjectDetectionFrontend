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

type Props = {
    teams: Team[];
    sortDescriptor: SortDescriptor;
    onSortChange: (value: SortDescriptor) => void;

};

export function LoggedTeamsTable({ teams, sortDescriptor, onSortChange }: Props) {
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
                    <Table.Head id="favorite" label="Favorite" />
                    <Table.Head id="name" label="Name" isRowHeader allowsSorting />
                    <Table.Head id="created_at" label="Created at" allowsSorting />
                    <Table.Head id="role" label="Role" allowsSorting />
                    <Table.Head id="actions" />
                </Table.Header>

                <Table.Body items={teams}>
                    {(team) => (
                        <Table.Row
                            id={team.id}
                        >
                            <Table.Cell>

                                <ButtonUtility
                                    size="xs"
                                    color="tertiary"
                                    tooltip="Favorite"
                                    icon={(props) => (
                                        <Star
                                            {...props}
                                            className="w-4 h-4 transition-colors"
                                            stroke={team.is_favorite ? "#facc15" : "#9ca3af"}
                                            fill={team.is_favorite ? "#facc15" : "none"}
                                        />
                                    )}
                                    onClick={() => toggleFavorite(team.id)}
                                />
                            </Table.Cell>
                            <Table.Cell>
                                <div className="flex items-center gap-3">
                                    <Avatar
                                        size="md"
                                        initials={team.name[0].toUpperCase()}
                                    />
                                    <p className="text-sm font-medium text-primary">
                                        {team.name}
                                    </p>
                                </div>
                            </Table.Cell>

                            <Table.Cell>
                                {new Date(team.created_at).toLocaleDateString()}
                            </Table.Cell>

                            <Table.Cell>
                                <RoleBadge role={team.owner.role} />
                            </Table.Cell>

                            <Table.Cell>
                                <div className="flex justify-end">

                                    <ButtonUtility size="xs" color="tertiary" tooltip="List" icon={List} onClick={() => router.push(`/team/${team.id}`)} />

                                    {!team.is_favorite && team.owner.role !== "member" && (
                                        <>
                                            <ButtonUtility
                                                size="xs"
                                                color="tertiary"
                                                tooltip="Delete"
                                                icon={Trash01}
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    e.stopPropagation();
                                                    setSelectedTeamId(team.id);
                                                    setIsDeleteOpen(true);
                                                }}
                                            />
                                        </>
                                    )}
                                    {team.owner.role === "owner" && (
                                        <>
                                            <ButtonUtility
                                                size="xs"
                                                color="tertiary"
                                                tooltip="Edit"
                                                icon={Edit01}
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    e.stopPropagation();
                                                    setSelectedTeam(team);
                                                    setIsEditOpen(true);
                                                }}
                                            />
                                        </>
                                    )}
                                    {team.owner.role === "member" && (
                                        <>
                                            <ButtonUtility
                                                size="xs"
                                                color="tertiary"
                                                tooltip="Leave"
                                                icon={LogOut}
                                                onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                                                    if (!user) return;

                                                    e.stopPropagation();
                                                    setSelectedTeamId(team.id);
                                                    setSelectedUserId(user?.id)
                                                    setIsRemoveOpen(true);
                                                }}
                                            />
                                        </>
                                    )}
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
                    isOwner={false}
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