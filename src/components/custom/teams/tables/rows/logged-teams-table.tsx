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
                    <Table.Head id="favorite"><span className="sr-only">Favorite</span></Table.Head>
                    <Table.Head id="name" label="Name" isRowHeader allowsSorting />
                    <Table.Head id="created_at" label="Created at" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="role" label="Role" allowsSorting className="hidden md:table-cell" />
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
                                        size="md" className="max-md:hidden"
                                        initials={team.name[0].toUpperCase()}
                                    />
                                    <p className="max-w-40 break-words text-sm font-medium text-primary md:max-w-none">
                                        {team.name}
                                    </p>
                                </div>
                                <MobileRowDetails items={[
                                    { label: "Role", value: team.current_user_role },
                                    { label: "Created at", value: new Date(team.created_at).toLocaleDateString() },
                                ]} />
                            </Table.Cell>

                            <Table.Cell className="hidden md:table-cell">
                                {new Date(team.created_at).toLocaleDateString()}
                            </Table.Cell>

                            <Table.Cell className="hidden md:table-cell">
                                <RoleBadge role={team.current_user_role} />
                            </Table.Cell>

                            <Table.Cell>
                                <div className="flex w-20 flex-wrap justify-end md:w-auto md:flex-nowrap">

                                    <ButtonUtility size="xs" color="tertiary" tooltip="List" icon={List} onClick={() => router.push(`/team/${team.id}`)} />

                                    {!team.is_favorite && team.current_user_role !== "member" && (
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
                                    {team.current_user_role === "owner" && (
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
                                    {team.current_user_role === "member" && (
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
