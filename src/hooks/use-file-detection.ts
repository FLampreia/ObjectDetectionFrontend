import { processImage } from "@/services/detect"
import { askSocketSessionId, connectWebSocket, processFrameWithTiming, finishProcessing } from "@/services/socket"
import type { StreamFrameRenderer } from "@/types/stream-performance"
import type { DetectionPerformance } from "@/types/detection-performance"
import { summarizePerformance, type PerformanceSample } from "@/utils/detection-performance"
import { processVideoFrames } from "@/utils/video-frame-pipeline"
import { Detection, Area, Line, DrawingColors, type CrossingEvent, type CrossingCounts } from "@/types"
import { DEFAULT_AREA_LINE_COLORS } from "@/config/drawing"
import { cocoClassesItems } from "@/utils/coco-classes"
import { useQueryClient } from "@tanstack/react-query"
import { useEffect, useMemo, useRef, useState } from "react"
import type { Selection } from "react-aria-components"

const frames_processed_per_second = 10

function createPerformanceTracker(publish: (value: DetectionPerformance | null) => void, setupMs: number) {
    const samples: PerformanceSample[] = []
    let lastUpdate = 0
    return {
        record(sample: PerformanceSample) {
            samples.push(sample)
            if (samples.length > 20) samples.shift()
            if (sample.completedAt - lastUpdate >= 1000) {
                publish(summarizePerformance(samples, setupMs))
                lastUpdate = sample.completedAt
            }
        },
        publish(finalizationMs: number | null = null) {
            publish(summarizePerformance(samples, setupMs, finalizationMs))
        },
    }
}

async function captureFrame(
    video: HTMLVideoElement,
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
    quality?: number,
): Promise<Blob> {

    if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth
    if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight
    ctx.drawImage(video, 0, 0)

    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (!blob) {
                reject(new Error("Unable to create frame"))
                return
            }

            resolve(blob)
        }, "image/jpeg", quality)
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
    const crossingCountsRef = useRef<CrossingCounts>({ A_to_B: 0, B_to_A: 0 })
    const [crossingCounts, setCrossingCounts] = useState<CrossingCounts>({ A_to_B: 0, B_to_A: 0 })
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
    const stopVideoRef = useRef(false)
    const [isFinishingVideo, setIsFinishingVideo] = useState(false)

    const stopVideoDetection = () => {
        stopVideoRef.current = true
        setIsFinishingVideo(true)
    }

    const startProcessing = () => {
        crossingCountsRef.current = { A_to_B: 0, B_to_A: 0 }
        setCrossingCounts({ ...crossingCountsRef.current })
        setDetectionPerformance(null)
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
    const confidenceTotalsRef = useRef(new Map<number, { total: number; count: number }>());
    const streamFrameRendererRef = useRef<StreamFrameRenderer | null>(null)
    const videoFrameRendererRef = useRef<((canvas: HTMLCanvasElement, detections: Detection[]) => void) | null>(null)
    const [detectionPerformance, setDetectionPerformance] = useState<DetectionPerformance | null>(null)

    const recordFrame = (frameDetections: Detection[], updatePreview = true) => {
        detectionsRef.current = frameDetections

        if (updatePreview) setDetections(frameDetections)

        const frameTracks = new Set<number>()

        for (const detection of frameDetections) {
            const trackId = detection.track_id
            if (trackId == null || frameTracks.has(trackId)) continue
            frameTracks.add(trackId)
            const previous = confidenceTotalsRef.current.get(trackId) ?? { total: 0, count: 0 }
            const total = previous.total + detection.confidence
            const count = previous.count + 1
            confidenceTotalsRef.current.set(trackId, { total, count })
            const first = trackedDetectionsRef.current.get(trackId) ?? detection
            trackedDetectionsRef.current.set(trackId, {
                ...first,
                confidence: total / count,
                mean_confidence: total / count,
                confidence_samples: count,
            })
        }
    }

    const publishResults = () => {
        setCrossingCounts({ ...crossingCountsRef.current })
        setDetections(detectionsRef.current)
        setSummaryDetections(detectionsRef.current)
        setTrackedDetections(new Map(trackedDetectionsRef.current))
    }

    const recordCrossings = (events: CrossingEvent[]) => {
        for (const event of events) crossingCountsRef.current[event.direction] += 1
    }

    const captureCanvas = useRef<HTMLCanvasElement | null>(null);
    const capture = (video: HTMLVideoElement, quality?: number) => {
        const canvas = captureCanvas.current ?? document.createElement("canvas");
        captureCanvas.current = canvas;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Unable to create capture canvas");
        return captureFrame(video, canvas, context, quality);
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
        setDetectionPerformance(null)
        crossingCountsRef.current = { A_to_B: 0, B_to_A: 0 }
        setCrossingCounts({ ...crossingCountsRef.current })
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

        const preparationStartedAt = performance.now()
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

            const requestStartedAt = performance.now()
            const data = await processImage(formData)
            const responseAt = performance.now()
            setDetectionPerformance(summarizePerformance([{
                completedAt: responseAt,
                captureMs: requestStartedAt - preparationStartedAt,
                roundTripMs: responseAt - requestStartedAt,
                inferenceMs: typeof data.processing_time_per_frame === "number" && Number.isFinite(data.processing_time_per_frame) && data.processing_time_per_frame >= 0
                    ? data.processing_time_per_frame : null,
                drawingMs: null, seekMs: null,
                detectionDelayMs: responseAt - preparationStartedAt, frameBytes: file.size,
            }], 0))

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

        setIsFinishingVideo(false)
        const setupStartedAt = performance.now()
        startProcessing()
        setDetectionError(null)

        setDetections([]);
        setSummaryDetections([])
        setTrackedDetections(new Map());

        detectionsRef.current = []
        trackedDetectionsRef.current = new Map()
        confidenceTotalsRef.current = new Map()
        stopVideoRef.current = false

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
                line,
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
            const performanceTracker = createPerformanceTracker(setDetectionPerformance, performance.now() - setupStartedAt)

            let lastUiUpdate = 0
            if (!Number.isFinite(video.duration) || video.duration <= 0) {
                throw new Error("Video duration is unavailable")
            }
            // Two reusable canvases bound memory and preserve each submitted frame.
            const canvases = [document.createElement("canvas"), document.createElement("canvas")]
            const socket = ws
            await processVideoFrames(Math.ceil(video.duration * frames_processed_per_second), async (index) => {
                // Derive timestamps from the index to avoid accumulated seek rounding.
                const timestamp = index / frames_processed_per_second
                const seekStartedAt = performance.now()
                await seekVideo(video, timestamp)
                const frameStart = performance.now()
                const canvas = canvases[index % 2]
                const context = canvas.getContext("2d")
                if (!context) throw new Error("Unable to create capture canvas")
                // Preserve the original JPEG quality used before video pipelining.
                const frame = await captureFrame(video, canvas, context)
                return { frame, canvas, timestamp, frameStart,
                    captureMs: performance.now() - frameStart,
                    seekMs: frameStart - seekStartedAt }
            }, async (prepared, index) => {
                const requestStartedAt = performance.now()
                const response = await processFrameWithTiming(socket, prepared.frame, {
                    frame_number: index + 1, timestamp_ms: prepared.timestamp * 1000,
                })
                const responseAt = performance.now()
                // Show the submitted pixels, even while the video seeks ahead.
                videoFrameRendererRef.current?.(prepared.canvas, response.detections)
                recordFrame(response.detections)
                recordCrossings(response.crossings)
                if (responseAt - lastUiUpdate > 200) {
                    publishResults()
                    lastUiUpdate = responseAt
                }
                performanceTracker.record({
                    completedAt: responseAt, captureMs: prepared.captureMs,
                    roundTripMs: responseAt - requestStartedAt,
                    inferenceMs: response.inferenceTimeMs, drawingMs: null,
                    detectionDelayMs: responseAt - prepared.frameStart,
                    frameBytes: prepared.frame.size, seekMs: prepared.seekMs,
                })
            }, () => stopVideoRef.current)

            setIsFinishingVideo(true)
            publishResults()
            performanceTracker.publish()
            const finalizationStartedAt = performance.now()
            const result = await finishProcessing(ws);
            performanceTracker.publish(performance.now() - finalizationStartedAt)
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
            setIsFinishingVideo(false)
        }
    }

    const detectStream = async (video: HTMLVideoElement) => {
        if (!selectedAlgorithm) return

        stopStreamRef.current = false
        const setupStartedAt = performance.now()
        streamFrameRendererRef.current?.([])

        startProcessing()
        setDetectionError(null)
        setDetections([])
        setSummaryDetections([])
        setTrackedDetections(new Map())

        detectionsRef.current = []
        trackedDetectionsRef.current = new Map()
        confidenceTotalsRef.current = new Map()

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
                line,
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
            const performanceTracker = createPerformanceTracker(setDetectionPerformance, streamStart - setupStartedAt)


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
                // Keep original dimensions so stored frames and box coordinates still match.
                const frame = await capture(video, 0.85)
                const capturedAt = performance.now()

                // Check if detection was stopped while capturing
                if (stopStreamRef.current) {
                    break
                }

                // One request at a time: capture a fresh frame instead of queuing old images.
                const result = await processFrameWithTiming(ws, frame, {
                    frame_number: ++frameNumber, timestamp_ms: frameStart - streamStart,
                })

                // Accumulate new tracks before publishing the current frame.
                const responseAt = performance.now()
                const drawingMs = streamFrameRendererRef.current?.(result.detections) ?? 0
                recordFrame(result.detections, false)
                recordCrossings(result.crossings)
                performanceTracker.record({
                    completedAt: responseAt, seekMs: null,
                    captureMs: capturedAt - frameStart,
                    roundTripMs: responseAt - capturedAt,
                    inferenceMs: result.inferenceTimeMs, drawingMs,
                    detectionDelayMs: responseAt - frameStart, frameBytes: frame.size,
                })

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
            performanceTracker.publish()
            const finalizationStartedAt = performance.now()
            const result = await finishProcessing(ws)
            performanceTracker.publish(performance.now() - finalizationStartedAt)
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
        stopVideoDetection,
        isFinishingVideo,
        detectStream,
        stopStreamDetection,
        loading,
        processingSeconds,
        crossingCounts,
        streamFrameRendererRef,
        videoFrameRendererRef,
        detectionPerformance,
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
