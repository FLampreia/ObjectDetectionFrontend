
import { Select } from "../base/select/select";
import { useTeams } from "@/hooks/use-team";

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