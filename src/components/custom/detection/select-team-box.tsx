
import { Select } from "@/components/base/select/select";
import { useTeams } from "@/hooks/use-team";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { X } from "lucide-react";

export function SelectTeamBox({
    selectedTeamId,
    onTeamChange,
}: {
    selectedTeamId: string | null
    onTeamChange: (value: string | null) => void
}) {

    const {
        allLoggedTeams,
    } = useTeams()

    const teamItems = allLoggedTeams?.map((team) => ({
        id: team.id,
        label: team.name,
    })) ?? [];

    return (
        <div className="flex items-end gap-2">
            <Select
                size="md"
                label="4. Associate a team"
                tooltip="Optionally associate your detection results with a team. Use the clear button to remove it."
                placeholder="Select a team (optional)"
                className="min-w-0 flex-1"
                items={teamItems}
                value={selectedTeamId}
                onChange={(value) => {
                    onTeamChange(value === null ? null : String(value));
                }}
            >
                {(team) => (
                    <Select.Item id={team.id}>
                        {team.label}
                    </Select.Item>
                )}
            </Select>
            {selectedTeamId && (
                <ButtonUtility
                    type="button"
                    icon={X}
                    tooltip="Clear team"
                    aria-label="Clear selected team"
                    className="size-10 shrink-0"
                    onClick={() => onTeamChange(null)}
                />
            )}
        </div>
    );
};
