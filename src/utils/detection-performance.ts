import type { DetectionPerformance } from "@/types/detection-performance"

export type PerformanceSample = {
    completedAt: number
    captureMs: number
    roundTripMs: number
    inferenceMs: number | null
    drawingMs: number | null
    detectionDelayMs: number
    frameBytes: number
    seekMs: number | null
}

export function summarizePerformance(
    samples: PerformanceSample[], setupMs: number, finalizationMs: number | null = null,
): DetectionPerformance | null {
    if (!samples.length) return null
    const average = (key: keyof Omit<PerformanceSample, "completedAt">) => {
        const values = samples.map((sample) => sample[key]).filter((value): value is number => value !== null)
        return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null
    }
    const duration = samples.at(-1)!.completedAt - samples[0].completedAt
    return {
        fps: samples.length > 1 && duration > 0 ? (samples.length - 1) * 1000 / duration : null,
        captureMs: average("captureMs")!, roundTripMs: average("roundTripMs")!,
        inferenceMs: average("inferenceMs"), drawingMs: average("drawingMs"),
        detectionDelayMs: average("detectionDelayMs")!, frameBytes: average("frameBytes")!,
        seekMs: average("seekMs"), setupMs, finalizationMs, sampleCount: samples.length,
    }
}
