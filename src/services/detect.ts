import config from "@/config/api";
import { authFetch, getAccessToken } from "./auth";
import { VideoProcessingResponse, ListDetection } from "@/types";

export async function processImage(formData: FormData) {
    const token = getAccessToken();

    const response = await authFetch(`${config.API_URL}/detect/image`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const detail = data?.detail;
        const message = typeof detail === "string"
            ? detail
            : Array.isArray(detail)
                ? detail.map((item) => `${item.loc?.join(".") ?? "request"}: ${item.msg}`).join("; ")
                : data?.error || "Failed to detect image";
        throw new Error(`${message} (HTTP ${response.status})`);
    }

    if (data === null) {
        throw new Error("The detection API returned an invalid response.");
    }

    return data;
}

export async function getDetections(): Promise<ListDetection[]> {
    const token = getAccessToken();

    const response = await authFetch(`${config.API_URL}/detections/all`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to get all detections from logged user");
    }

    return data;

}

export async function getDetectionsTeam(teamId: string): Promise<ListDetection[]> {
    const token = getAccessToken();

    const response = await authFetch(`${config.API_URL}/team/${teamId}/detections`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to get detections from team");
    }

    return data;

}

export async function storeDetections(
    result: VideoProcessingResponse,
    algorithm: string,
    confThreshold: number,
    chosenTeamId?: string | null,
    type: string,
) {
    const token = getAccessToken();

    const params = new URLSearchParams({
        algorithm,
        conf_threshold: confThreshold.toString(),
        detection_type: type
    });

    if (chosenTeamId) {
        params.append("chosen_team_id", chosenTeamId);
    }

    const response = await authFetch(
        `${config.API_URL}/save/detections?${params.toString()}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(result),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to save detections on database"
        );
    }

    return data;
}
