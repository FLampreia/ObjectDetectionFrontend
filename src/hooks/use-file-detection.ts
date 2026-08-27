import { processImage, storeDetections } from "@/services/detect"
import { askSocketSessionId, connectWebSocket } from "@/services/socket"
import { Detection, Area, AlgorithmObj, VideoProcessingResponse } from "@/types"
import { cocoClassesItems } from "@/utils/coco-classes"
import { useEffect, useRef, useState } from "react"
import type { Selection } from "react-aria-components"

const frames_processed_per_second = 10

function cropImage(file: File, area: Area): Promise<File> {
    return new Promise((resolve, reject) => {

        const img = new Image()

        img.onload = () => {

            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) return reject("No context")

            const { naturalWidth, naturalHeight } = img

            const x = Math.min(area.x1, area.x2) * naturalWidth
            const y = Math.min(area.y1, area.y2) * naturalHeight
            const w = Math.abs(area.x2 - area.x1) * naturalWidth
            const h = Math.abs(area.y2 - area.y1) * naturalHeight

            canvas.width = w
            canvas.height = h

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            ctx.drawImage(
                img,
                x, y, w, h,
                0, 0, w, h
            )

            canvas.toBlob((blob) => {
                if (!blob) return reject("No blob")

                const croppedFile = new File([blob], file.name, {
                    type: "image/jpeg",
                })

                resolve(croppedFile)
            }, "image/jpeg")
        }

        img.onerror = reject
        img.src = URL.createObjectURL(file)
    })
}

async function captureFrame(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    area?: Area | null
): Promise<Blob> {

    if (area) {
        const x = Math.min(area.x1, area.x2) * video.videoWidth
        const y = Math.min(area.y1, area.y2) * video.videoHeight
        const w = Math.abs(area.x2 - area.x1) * video.videoWidth
        const h = Math.abs(area.y2 - area.y1) * video.videoHeight

        canvas.width = w
        canvas.height = h

        ctx.drawImage(
            video,
            x, y, w, h,
            0, 0, w, h
        )
    } else {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        ctx.drawImage(video, 0, 0)
    }

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Unable to create frame"))
                return
            }

            resolve(blob)
        }, "image/jpeg")
    })
}

async function waitDetections(ws: WebSocket): Promise<Detection[]> {
    return new Promise((resolve, reject) => {

        const handleMessage = (event: MessageEvent) => {

            ws.removeEventListener("message", handleMessage);

            const data = JSON.parse(event.data);

            resolve(data.detections_per_frame);
        };

        const handleError = () => {
            ws.removeEventListener("message", handleMessage);
            reject(new Error("WebSocket error"));
        };

        ws.addEventListener("message", handleMessage, { once: true });
        ws.addEventListener("error", handleError, { once: true });

    });
}

async function advanceToNextFrame(video: HTMLVideoElement) {

    return new Promise<void>((resolve) => {

        video.currentTime += 1 / frames_processed_per_second;

        video.onseeked = () => resolve();

    });

}

function waitFinished(ws: WebSocket): Promise<void> {
    return new Promise((resolve) => {
        const handler = (event: MessageEvent) => {
            const message = JSON.parse(event.data);

            if (message.status === "finished") {
                ws.removeEventListener("message", handler);
                resolve();
            }
        };

        ws.addEventListener("message", handler);
    });
}


export function useFileDetection() {
    const [file, setFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [area, setArea] = useState<Area | null>(null)
    const [detections, setDetections] = useState<Detection[]>([])
    const [trackedDetections, setTrackedDetections] = useState<Map<number, Detection>>(
        new Map()
    )
    const [loading, setLoading] = useState(false)

    const [minConfidence, setMinConfidence] = useState<number>(80)
    const [selectedClasses, setSelectedClasses] = useState<Selection>("all")
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null)
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

    const detectionsRef = useRef<Detection[]>([]);
    const trackedDetectionsRef = useRef(new Map<number, Detection>());

    const captureCanvas = useRef(document.createElement("canvas"));

    const captureCtx = useRef(
        captureCanvas.current.getContext("2d")!
    );

    useEffect(() => {
        if (!file) return

        setDetections([])
        setTrackedDetections(new Map())

        const url = URL.createObjectURL(file)
        setImageUrl(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [file])


    const detectImage = async () => {
        if (!file) return

        setLoading(true)

        try {
            let fileToSend = file

            if (area) {
                fileToSend = await cropImage(file, area)
            }

            const formData = new FormData()
            formData.append("image", fileToSend)

            if (selectedClasses === "all") {
                cocoClassesItems.forEach((item) => {
                    formData.append("chosen_class_id", String(item.id))
                })
            } else {
                Array.from(selectedClasses).forEach((id) => {
                    formData.append("chosen_class_id", String(id))
                })
            }

            if (selectedAlgorithm) {
                formData.append("algorithm", selectedAlgorithm)
            }

            if (selectedTeamId) {
                formData.append("chosen_team_id", selectedTeamId)
            }

            if (minConfidence !== null) {
                formData.append("conf_threshold", String(minConfidence / 100))
            }

            const data = await processImage(formData)

            setDetections(data?.detections_per_frame ?? [])
        } finally {
            setLoading(false)
        }
    }

    const detectVideo = async (video: HTMLVideoElement) => {
        if (!file || !selectedAlgorithm) return

        setLoading(true)

        setDetections([]);
        setTrackedDetections(new Map());

        detectionsRef.current = []
        trackedDetectionsRef.current = new Map()

        try {

            // Ask for session id 
            const sessionId = await askSocketSessionId()

            // Connect to ws
            const ws = await connectWebSocket(sessionId)
            console.log("Connections Established")

            // Processing
            // Sending Parameters
            const parameters = {
                algorithm: selectedAlgorithm,
                chosen_team_id: selectedTeamId,
                conf_threshold:
                    minConfidence !== null
                        ? minConfidence / 100
                        : 0,
                chosen_class_id:
                    selectedClasses === "all"
                        ? cocoClassesItems.map(item => item.id)
                        : Array.from(selectedClasses)
            }

            ws.send(JSON.stringify(parameters))

            video.pause();
            video.currentTime = 0;

            await new Promise<void>((resolve) => {
                video.onseeked = () => resolve();
            });

            const start = performance.now();
            let lastUiUpdate = 0

            // Loop until the end of the video
            while (video.currentTime < video.duration) {

                const frame = await captureFrame(video, captureCanvas.current, captureCtx.current, area);

                // Warns that is about to send a frame
                ws.send(JSON.stringify({
                    type: "frame"
                }));

                // Sends the frame
                ws.send(frame);

                // Receive notations
                const detections = await waitDetections(ws);

                // Frame detections
                detectionsRef.current = detections;

                const now = performance.now();

                if (now - lastUiUpdate > 200) {
                    setDetections(detectionsRef.current);
                    lastUiUpdate = now;
                }

                // all video detections
                detections.forEach(detection => {
                    if (
                        detection.track_id !== undefined &&
                        !trackedDetectionsRef.current.has(detection.track_id)
                    ) {
                        trackedDetectionsRef.current.set(detection.track_id, detection);
                    }
                });

                // Move to next frame
                await advanceToNextFrame(video);
            }

            // Warns that has ended
            ws.send(JSON.stringify({
                type: "finish"
            }));

            const end = performance.now();
            console.log(`Tempo total: ${((end - start) / 1000).toFixed(2)} s`); //TODO retirar  

            // Waits for the worker to end eveerything
            await waitFinished(ws);

            const result: VideoProcessingResponse = {
                processing_time: (end - start),
                detections_per_frame: Array.from(trackedDetectionsRef.current.values()),
            }

            const conf_threshold = minConfidence !== null ? minConfidence / 100 : 0

            await storeDetections(result, selectedAlgorithm, conf_threshold, selectedTeamId)

            ws.close()
            console.log("Connections Finished")

        } finally {
            setTrackedDetections(new Map(trackedDetectionsRef.current));
            setLoading(false)
        }
    }


    return {
        file,
        setFile,
        imageUrl,
        setImageUrl,
        detections,
        setDetections,
        setTrackedDetections,
        trackedDetections: Array.from(trackedDetections.values()),
        detectImage,
        detectVideo,
        loading,

        selectedClasses,
        setSelectedClasses,

        area,
        setArea,

        selectedAlgorithm,
        setSelectedAlgorithm,

        selectedTeamId,
        setSelectedTeamId,

        minConfidence,
        setMinConfidence,
    }
}