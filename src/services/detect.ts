import API_URL from "@/config/api";
import { getAccessToken } from "./auth";

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

