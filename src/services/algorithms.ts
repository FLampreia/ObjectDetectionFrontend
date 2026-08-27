import config from "@/config/api";
import { getAccessToken } from "./auth";

export async function getAlgorithms() {
    const token = getAccessToken();

    const response = await fetch(`${config.API_URL}/models`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to get models list");
    }

    return data;
}

export async function downloadAlgorithm(algorithmName: string) {
    const token = getAccessToken();

    // console.log(algorithmName)

    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // return {
    //     success: true,
    //     message: `Algorithm ${algorithmName} downloaded successfully`,
    // };

    const response = await fetch(`${config.API_URL}/models/download`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            name: algorithmName,
        }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to download algorithm");
    }

    return data;

}