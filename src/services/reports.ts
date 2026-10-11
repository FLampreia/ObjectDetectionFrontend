import config from "@/config/api";
import { authFetch, getAccessToken } from "./auth";
import type { ReportConfig, ListDetection } from "@/types";

export async function getDetectionReportInterval(
    startDate: string,
    endDate: string,
    filters: { model?: string | null; detectionType?: ListDetection["type"] | null; teamId?: string | null } = {},
) {
    const token = getAccessToken();
    const params = new URLSearchParams({ start_date: startDate, end_date: endDate });
    if (filters.model) params.set("model", filters.model);
    if (filters.detectionType) params.set("detection_type", filters.detectionType);
    if (filters.teamId === "unassigned") params.set("unassigned", "true");
    else if (filters.teamId) params.set("team_id", filters.teamId);

    const response = await authFetch(
        `${config.API_URL}/report/detection/interval?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate PDF report");
    }

    return await response.blob();
}



export async function getSingleDetectionReport(
    detectionId: string,
    drawingConfig: ReportConfig,
) {
    const token = getAccessToken();

    const params = new URLSearchParams(
        Object.entries(drawingConfig).map(([key, value]) => [
            key,
            String(value),
        ]),
    );

    const response = await authFetch(
        `${config.API_URL}/report/detection/${detectionId}?${params.toString()}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate PDF report");
    }

    return await response.blob();
}
