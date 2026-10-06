import config from "@/config/api";
import { authFetch, getAccessToken } from "./auth";


export async function askSocketSessionId() {
    const token = getAccessToken();

    const response = await authFetch(`${config.API_URL}/socket/session`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to get socket session id");
    }

    return data;
}

export const connectWebSocket = (sessionId: string): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
        const protocol = window.location.protocol === "https:" ? "wss" : "ws"

        const ws = new WebSocket(
            `${protocol}://${config.PROCESSOR_HOST}:${config.PROCESSOR_PORT}/detect/video/socket/connect/${sessionId}`
        )

        ws.onopen = () => resolve(ws)
        ws.onerror = () => reject(new Error("Failed to connect to websocket"))
    })
}


