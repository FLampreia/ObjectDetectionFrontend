import config from "@/config/api";
import { authFetch, getAccessToken } from "./auth";
import type { DetectionImage } from "@/types";

export async function getDetectionImages(detectionId: string): Promise<DetectionImage[]> {
    const response = await authFetch(`${config.API_URL}/detections/${encodeURIComponent(detectionId)}/images`, {
        headers: { Authorization: `Bearer ${getAccessToken()}` },
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error(typeof data?.detail === "string" ? data.detail : "Failed to load detection images");
    }
    return data;
}


export async function getObjects(detectionId: string) {
    const token = getAccessToken();

    const response = await authFetch(`${config.API_URL}/detections/${detectionId}/objects`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to get objects from selected detection");
    }

    return data;
}

export async function deleteDetections(detections: string[]) {
    const token = getAccessToken();

    const response = await authFetch(`${config.API_URL}/detections`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(detections)
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.detail || data?.error;
        throw new Error(typeof message === "string" ? message : "Failed to delete detections. Please try again.");
    }

    return data;
}
