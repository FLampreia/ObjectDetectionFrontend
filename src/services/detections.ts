import config from "@/config/api";
import { getAccessToken } from "./auth";


export async function getObjects(detectionId: string) {
    const token = getAccessToken();

    const response = await fetch(`${config.API_URL}/detections/${detectionId}/objects`, {
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