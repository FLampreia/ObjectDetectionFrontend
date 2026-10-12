import config from "@/config/api";
import { authFetch, getAccessToken } from "./auth";
import type { Detection } from "@/types";


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
        throw new Error(data.detail || data.error || "Failed to get socket session id");
    }

    if (typeof data !== "string") {
        throw new Error("Invalid socket session response");
    }

    return data;
}

export const connectWebSocket = (sessionId: string): Promise<WebSocket> => {
    return new Promise((resolve, reject) => {
        const url = new URL(
            `${config.API_URL.replace(/\/$/, "")}/socket/connect/${encodeURIComponent(sessionId)}`,
            window.location.origin,
        );
        url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
        const ws = new WebSocket(url);
        const cleanup = () => {
            clearTimeout(timer);
            ws.onopen = null;
            ws.onerror = null;
            ws.onclose = null;
        };
        const fail = () => {
            cleanup();
            ws.close();
            reject(new Error("Failed to connect to websocket; request a new session"));
        };
        const timer = setTimeout(fail, 15000);
        ws.onopen = () => { cleanup(); resolve(ws); };
        ws.onerror = fail;
        ws.onclose = fail;
    })
}

function requestMessage<T>(
    ws: WebSocket,
    parse: (message: Record<string, unknown>) => T,
    send: () => void,
): Promise<T> {
    return new Promise((resolve, reject) => {
        const cleanup = () => {
            clearTimeout(timer);
            ws.removeEventListener("message", onMessage);
            ws.removeEventListener("error", onError);
            ws.removeEventListener("close", onClose);
        };
        const fail = (error: Error) => { cleanup(); reject(error); };
        const onError = () => fail(new Error("WebSocket communication failed"));
        const onClose = () => fail(new Error("Connection closed before processing completed"));
        const onMessage = (event: MessageEvent) => {
            try {
                const message = JSON.parse(event.data);
                if (message.status === "error") {
                    throw new Error(message.detail || "Processing failed");
                }
                const result = parse(message);
                cleanup();
                resolve(result);
            } catch (error) {
                fail(error instanceof Error ? error : new Error("Invalid worker response"));
            }
        };
        const timer = setTimeout(() => fail(new Error("Processing response timed out")), 120000);
        ws.addEventListener("message", onMessage);
        ws.addEventListener("error", onError);
        ws.addEventListener("close", onClose);
        try {
            if (ws.readyState !== WebSocket.OPEN) throw new Error("WebSocket is closed");
            send();
        } catch (error) {
            fail(error instanceof Error ? error : new Error("Unable to send frame"));
        }
    });
}

export function processFrame(
    ws: WebSocket, frame: Blob,
    metadata: { frame_number: number; timestamp_ms: number },
): Promise<Detection[]> {
    return requestMessage(ws, (message) => {
        if (!Array.isArray(message.detections_per_frame)) throw new Error("Invalid frame response");
        return message.detections_per_frame as Detection[];
    }, () => {
        ws.send(JSON.stringify({ type: "frame", ...metadata }));
        ws.send(frame);
    });
}

export function finishProcessing(ws: WebSocket): Promise<{ processing_time_ms: number }> {
    return requestMessage(ws, (message) => {
        if (message.status !== "finished" || message.saved !== true) {
            throw new Error("Processing was not saved successfully");
        }
        if (typeof message.processing_time_ms !== "number" || !Number.isFinite(message.processing_time_ms) || message.processing_time_ms < 0) {
            throw new Error("Invalid session processing time");
        }
        return { processing_time_ms: message.processing_time_ms };
    }, () => ws.send(JSON.stringify({ type: "finish" })));
}


