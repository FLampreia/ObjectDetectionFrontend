import config from "@/config/api";
import { getAccessToken } from "./auth";

export async function getDetectionReportInterval(
    startDate: string,
    endDate: string,
) {
    const token = getAccessToken();

    const response = await fetch(
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
) {
    const token = getAccessToken();

    const response = await fetch(
        `${config.API_URL}/report/detection/${detectionId}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to generate PDF report");
    }

    return await response.blob();
}