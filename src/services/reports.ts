import config from "@/config/api";
import { authFetch, getAccessToken } from "./auth";
import type { ReportConfig } from "@/types";

export async function getDetectionReportInterval(
    startDate: string,
    endDate: string,
) {
    const token = getAccessToken();

    const response = await authFetch(
        `${config.API_URL}/report/detection/interval?start_date=${startDate}&end_date=${endDate}`,
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
