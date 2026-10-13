export type DetectionPerformance = {
    fps: number | null
    captureMs: number
    roundTripMs: number
    inferenceMs: number | null
    drawingMs: number | null
    detectionDelayMs: number
    frameBytes: number
    seekMs: number | null
    setupMs: number
    finalizationMs: number | null
    sampleCount: number
}
