import type { ListDetection } from "@/types";

export type HistoryFilters = {
    model: string | null;
    detectionType: ListDetection["type"] | null;
    teamId: string | null;
    start?: Date;
    end?: Date;
};

export function filterDetections(detections: ListDetection[], filters: HistoryFilters) {
    return detections.filter((detection) => {
        if (filters.model && detection.model !== filters.model) return false;
        if (filters.detectionType && detection.type !== filters.detectionType) return false;
        if (filters.teamId === "unassigned" && detection.team_id) return false;
        if (filters.teamId && filters.teamId !== "unassigned" && detection.team_id !== filters.teamId) return false;
        const createdAt = new Date(detection.created_at);
        if (filters.start && createdAt < filters.start) return false;
        if (filters.end && createdAt > filters.end) return false;
        return true;
    });
}
