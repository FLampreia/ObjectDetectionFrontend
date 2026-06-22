import { useState } from "react";
import type { Selection } from "react-aria-components";
import { MultiSelect } from "@/components/base/select/multi-select";
import { cocoClassesItems } from "@/utils/coco-classes";
import { Select } from "../base/select/select";
import { useTeams } from "@/hooks/use-team";

const getSelectedClasses = (selectedKeys?: Selection) => {
    if (!selectedKeys || selectedKeys === "all") {
        return cocoClassesItems.length;
    }

    return (selectedKeys as Set<string | number>).size;
};

export const SelectTeamBox = () => {

    const {
        allLoggedTeams,
    } = useTeams()

    const teamItems = [
        {
            id: "none",
            label: "None",
        },
        ...(allLoggedTeams?.map((team) => ({
            id: team.id,
            label: team.name,
        })) ?? []),
    ];

    return (
        <Select
            size="md"
            label="3. Associate a team"
            tooltip="Select a team to associate your detection results"
            hint="Choose a team to associate"
            placeholder="Select a team"
            items={teamItems}

        >
            {(team) => (
                <Select.Item id={team.id} >
                    {team.label}
                </Select.Item>
            )}
        </Select>
    );
};