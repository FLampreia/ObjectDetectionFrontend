import API_URL from "@/config/api";
import { getAccessToken } from "./auth";
import { ListDetection } from "@/types";

export async function detectImage(formData: FormData) {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/detect/image`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to detect image");
    }

    return data;
}



export async function getDetectionsTeam(teamId: string): Promise<ListDetection[]> {
    const token = getAccessToken();

    const response = await fetch(`${API_URL}/team/${teamId}/detections`, {
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