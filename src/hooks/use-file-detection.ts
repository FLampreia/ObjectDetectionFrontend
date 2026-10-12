import { processImage } from "@/services/detect"
import { askSocketSessionId, connectWebSocket, processFrame, finishProcessing } from "@/services/socket"
import { Detection, Area, Line, DrawingColors } from "@/types"
import { DEFAULT_AREA_LINE_COLORS } from "@/config/drawing"
import { cocoClassesItems } from "@/utils/coco-classes"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Selection } from "react-aria-components"

const frames_processed_per_second = 10

async function captureFrame(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
): Promise<Blob> {

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

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

async function seekVideo(video: HTMLVideoElement, time: number): Promise<void> {
    if (video.currentTime === time && !video.seeking) return;
    await new Promise<void>((resolve, reject) => {
        const cleanup = () => {
            clearTimeout(timer);
            video.removeEventListener("seeked", onSeeked);
            video.removeEventListener("error", onError);
        };
        const onSeeked = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error("Unable to seek video")); };
        const timer = setTimeout(onError, 15000);
        video.addEventListener("seeked", onSeeked);
        video.addEventListener("error", onError);
        video.currentTime = time;
    });
}

async function advanceToNextFrame(video: HTMLVideoElement) {
    await seekVideo(video, Math.min(video.duration, video.currentTime + 1 / frames_processed_per_second));
}

async function waitForVideoData(video: HTMLVideoElement): Promise<void> {
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return;
    await new Promise<void>((resolve, reject) => {
        const cleanup = () => {
            clearTimeout(timer);
            video.removeEventListener("loadeddata", onReady);
            video.removeEventListener("error", onError);
        };
        const onReady = () => { cleanup(); resolve(); };
        const onError = () => { cleanup(); reject(new Error("Video data is unavailable")); };
        const timer = setTimeout(onError, 15000);
        video.addEventListener("loadeddata", onReady);
        video.addEventListener("error", onError);
    });
}

export function useFileDetection() {
    const [file, setFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [area, setArea] = useState<Area | null>(null)
    const [line, setLine] = useState<Line | null>(null)
    const [drawingColors, setDrawingColors] = useState<DrawingColors>({ ...DEFAULT_AREA_LINE_COLORS })
    const [detections, setDetections] = useState<Detection[]>([])
    const [summaryDetections, setSummaryDetections] = useState<Detection[]>([])
    const [trackedDetections, setTrackedDetections] = useState<Map<number, Detection>>(
        new Map()
    )
    const trackedDetectionList = useMemo(() => Array.from(trackedDetections.values()), [trackedDetections])
    const [loading, setLoading] = useState(false)
    const [processingSeconds, setProcessingSeconds] = useState<number | null>(null)
    const processingStartedRef = useRef<number | null>(null)

    const startProcessing = () => {
        processingStartedRef.current = performance.now()
        setProcessingSeconds(0)
        setLoading(true)
    }

    const completeProcessing = (processingTimeMs?: number) => {
        if (processingStartedRef.current === null) return
        setProcessingSeconds(processingTimeMs === undefined
            ? (performance.now() - processingStartedRef.current) / 1000
            : processingTimeMs / 1000)
        processingStartedRef.current = null
    }

    useEffect(() => {
        if (!loading) return
        const timer = setInterval(() => {
            if (processingStartedRef.current !== null) {
                setProcessingSeconds((performance.now() - processingStartedRef.current) / 1000)
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [loading])
    const [detectionError, setDetectionError] = useState<string | null>(null)

    const [minConfidence, setMinConfidence] = useState<number>(80)
    const [selectedClasses, setSelectedClasses] = useState<Selection>("all")
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null)
    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

    const detectionsRef = useRef<Detection[]>([]);
    const trackedDetectionsRef = useRef(new Map<number, Detection>());

    const recordFrame = (frameDetections: Detection[]) => {
        detectionsRef.current = frameDetections
        setDetections(frameDetections)
        for (const detection of frameDetections) {
            if (detection.track_id != null && !trackedDetectionsRef.current.has(detection.track_id)) {
                trackedDetectionsRef.current.set(detection.track_id, detection)
            }
        }
    }

    const publishResults = () => {
        setDetections(detectionsRef.current)
        setSummaryDetections(detectionsRef.current)
        setTrackedDetections(new Map(trackedDetectionsRef.current))
    }

    const captureCanvas = useRef<HTMLCanvasElement | null>(null);
    const capture = (video: HTMLVideoElement) => {
        const canvas = captureCanvas.current ?? document.createElement("canvas");
        captureCanvas.current = canvas;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Unable to create capture canvas");
        return captureFrame(video, canvas, context);
    };

    const stopStreamRef = useRef(false)
    const activeSocketRef = useRef<WebSocket | null>(null)

    useEffect(() => () => {
        stopStreamRef.current = true
        activeSocketRef.current?.close()
    }, [])

    const queryClient = useQueryClient();

    useEffect(() => {
        setProcessingSeconds(null)
        if (!file) return

        setDetections([])
        setSummaryDetections([])
        setTrackedDetections(new Map())

        const url = URL.createObjectURL(file)
        setImageUrl(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [file])


    const detectImage = async () => {
        if (!file) return

        startProcessing()
        setDetectionError(null)

        try {
            const formData = new FormData()

            formData.append("image", file)
            
            if (area) {
                formData.append("area", JSON.stringify(area))
            }

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
            completeProcessing()

            await queryClient.invalidateQueries({
                queryKey: ["dashboard-stats"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["detections"]
            });
        } catch (error) {
            setDetectionError(error instanceof Error ? error.message : "Failed to detect image")
        } finally {
            completeProcessing()
            setLoading(false)
        }
    }

    const detectVideo = async (video: HTMLVideoElement) => {
        if (!file || !selectedAlgorithm) return

        startProcessing()
        setDetectionError(null)

        setDetections([]);
        setSummaryDetections([])
        setTrackedDetections(new Map());

        detectionsRef.current = []
        trackedDetectionsRef.current = new Map()

        let ws: WebSocket | null = null

        try {

            // Ask for session id 
            const sessionId = await askSocketSessionId()

            // Connect to ws
            ws = await connectWebSocket(sessionId)
            activeSocketRef.current = ws
            console.log("Connections Established")

            // Processing
            // Sending Parameters
            const parameters = {
                algorithm: selectedAlgorithm,
                detection_type: "video",
                area,
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
            await waitForVideoData(video);
            await seekVideo(video, 0);

            let lastUiUpdate = 0
            let frameNumber = 0

            // Loop until the end of the video
            while (video.currentTime < video.duration) {

                const frame = await capture(video);

                const detections = await processFrame(ws, frame, {
                    frame_number: ++frameNumber, timestamp_ms: video.currentTime * 1000,
                });

                // Accumulate new tracks before publishing the current frame.
                recordFrame(detections)

                const now = performance.now();

                if (now - lastUiUpdate > 200) {
                    publishResults();
                    lastUiUpdate = now;
                }

                // Move to next frame
                await advanceToNextFrame(video);
            }

            publishResults()
            const result = await finishProcessing(ws);
            completeProcessing(result.processing_time_ms)

            await queryClient.invalidateQueries({
                queryKey: ["dashboard-stats"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["detections"]
            });

        } catch (error) {
            setDetectionError(error instanceof Error ? error.message : "Video detection failed")
        } finally {
            completeProcessing()
            ws?.close()
            activeSocketRef.current = null

            publishResults()
            setLoading(false)
        }
    }

    const detectStream = async (video: HTMLVideoElement) => {
        if (!selectedAlgorithm) return

        stopStreamRef.current = false

        startProcessing()
        setDetectionError(null)
        setDetections([])
        setSummaryDetections([])
        setTrackedDetections(new Map())

        detectionsRef.current = []
        trackedDetectionsRef.current = new Map()

        let ws: WebSocket | null = null

        try {
            // Ask for session id
            const sessionId = await askSocketSessionId()

            // Connect to websocket
            ws = await connectWebSocket(sessionId)
            activeSocketRef.current = ws

            console.log("Stream connection established")

            // Detection parameters
            const parameters = {
                algorithm: selectedAlgorithm,
                detection_type: "stream",
                area,
                chosen_team_id: selectedTeamId,
                conf_threshold:
                    minConfidence !== null
                        ? minConfidence / 100
                        : 0,
                chosen_class_id:
                    selectedClasses === "all"
                        ? cocoClassesItems.map(item => item.id)
                        : Array.from(selectedClasses),
            }

            // Send parameters
            ws.send(JSON.stringify(parameters))

            // Wait until the video has enough data
            await waitForVideoData(video)

            const frameInterval =
                1000 / frames_processed_per_second

            let lastUiUpdate = 0
            let frameNumber = 0
            const streamStart = performance.now()


            // Stream loop
            while (
                !stopStreamRef.current &&
                !video.paused &&
                !video.ended &&
                video.readyState >=
                HTMLMediaElement.HAVE_CURRENT_DATA
            ) {
                const frameStart = performance.now()

                // Capture current frame
                const frame = await capture(video)

                // Check if detection was stopped while capturing
                if (stopStreamRef.current) {
                    break
                }

                const frameDetections = await processFrame(ws, frame, {
                    frame_number: ++frameNumber, timestamp_ms: frameStart - streamStart,
                })

                // Accumulate new tracks before publishing the current frame.
                recordFrame(frameDetections)

                // Update UI at most 5 times per second
                const now = performance.now()

                if (now - lastUiUpdate >= 200) {
                    publishResults()
                    lastUiUpdate = now
                }

                // Keep configured FPS
                const elapsed =
                    performance.now() - frameStart

                const remainingTime =
                    frameInterval - elapsed

                if (remainingTime > 0) {
                    await new Promise<void>((resolve) =>
                        setTimeout(resolve, remainingTime)
                    )
                }
            }

            publishResults()
            const result = await finishProcessing(ws)
            completeProcessing(result.processing_time_ms)

            await queryClient.invalidateQueries({
                queryKey: ["dashboard-stats"],
            });

            await queryClient.invalidateQueries({
                queryKey: ["detections"]
            });

        } catch (error) {
            setDetectionError(error instanceof Error ? error.message : "Stream detection failed")
            console.error(
                "Stream detection error:",
                error
            )
        } finally {
            completeProcessing()
            publishResults()

            if (ws) {
                ws.close()
            }
            activeSocketRef.current = null

            setLoading(false)

            console.log("Stream connection closed")
        }
    }

    const stopStreamDetection = () => {
        stopStreamRef.current = true
    }


    return {
        file,
        setFile,
        imageUrl,
        setImageUrl,
        detections,
        summaryDetections,
        setSummaryDetections,
        setDetections,
        setTrackedDetections,
        trackedDetections: trackedDetectionList,
        detectImage,
        detectVideo,
        detectStream,
        stopStreamDetection,
        loading,
        processingSeconds,
        detectionError,

        selectedClasses,
        setSelectedClasses,

        area,
        setArea,
        line,
        setLine,
        drawingColors,
        setDrawingColors,

        selectedAlgorithm,
        setSelectedAlgorithm,

        selectedTeamId,
        setSelectedTeamId,

        minConfidence,
        setMinConfidence,
    }
}
