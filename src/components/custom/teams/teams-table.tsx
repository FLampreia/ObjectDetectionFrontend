"use client";

import { Table } from "@/components/application/table/table";
import { Avatar } from "@/components/base/avatar/avatar";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Trash01, Edit01, X, User01, } from "@untitledui/icons";
import { Crown, Star } from "lucide-react";
import type { SortDescriptor } from "react-aria-components";
import type { Team } from "@/types/team";
import { BadgeWithIcon } from "@/components/base/badges/badges";
import { useTeams } from "@/hooks/use-team";

type Props = {
    teams: Team[];
    sortDescriptor: SortDescriptor;
    onSortChange: (value: SortDescriptor) => void;

};

export function TeamsTable({ teams, sortDescriptor, onSortChange }: Props) {

    const {
        toggleFavorite,
    } = useTeams()

    return (
        <Table
            aria-label="Team members"
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
                    <Table.Row id={team.id}>
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
                            {team.role === "owner" ? (
                                <BadgeWithIcon size="sm" color="blue" iconLeading={Crown} className="capitalize">
                                    {team.role}
                                </BadgeWithIcon>
                            ) : team.role === "member" ? (
                                <BadgeWithIcon size="sm" color="gray" iconLeading={User01} className="capitalize">
                                    {team.role}
                                </BadgeWithIcon>
                            ) : (
                                <BadgeWithIcon size="sm" color="error" iconLeading={X} className="capitalize">
                                    {team.role}
                                </BadgeWithIcon>
                            )}
                        </Table.Cell>

                        <Table.Cell>
                            <div className="flex justify-end">
                                <ButtonUtility size="xs" color="tertiary" tooltip="Delete" icon={Trash01} />
                                <ButtonUtility size="xs" color="tertiary" tooltip="Edit" icon={Edit01} />
                            </div>
                        </Table.Cell>
                    </Table.Row>
                )}
            </Table.Body>
        </Table>
    );
}