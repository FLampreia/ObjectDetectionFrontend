import { Stats } from "@/types";
import { getAccessToken } from "./auth";
import config from "@/config/api";


export async function getStats(): Promise<Stats> {
    const token = getAccessToken();

    const response = await fetch(`${config.API_URL}/detections/stats`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to get detections stats from logged user");
    }

    return data;

}
