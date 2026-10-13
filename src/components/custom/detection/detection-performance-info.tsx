"use client"

import type { DetectionPerformance } from "@/types/detection-performance"

const milliseconds = (value: number | null) => value === null ? "—" : `${value.toFixed(1)} ms`

export function DetectionPerformanceInfo({ performance, type }: {
    performance: DetectionPerformance | null
    type: "photo" | "video" | "stream"
}) {
    if (!performance) return null
    const photo = type === "photo"
    const metrics = [
        { label: photo ? "Request preparation" : "Capture and encoding", value: milliseconds(performance.captureMs) },
        { label: "Round trip", value: milliseconds(performance.roundTripMs) },
        { label: "YOLO time", value: milliseconds(performance.inferenceMs) },
        ...(performance.inferenceMs === null ? [] : [{
            label: "Round trip outside YOLO",
            value: milliseconds(Math.max(0, performance.roundTripMs - performance.inferenceMs)),
        }]),
        ...(performance.drawingMs === null ? [] : [{ label: "Drawing", value: milliseconds(performance.drawingMs) }]),
        ...(type === "video" ? [{ label: "Advance to next frame", value: milliseconds(performance.seekMs) }] : []),
        { label: photo ? "Image size" : "Frame size", value: `${(performance.frameBytes / 1024).toFixed(1)} KB` },
        ...(!photo ? [{ label: "Session setup", value: milliseconds(performance.setupMs) }] : []),
        ...(!photo ? [{ label: "Final saving confirmation", value: milliseconds(performance.finalizationMs) }] : []),
    ]
    return (
        <details className="mt-3 rounded-lg border border-secondary bg-primary px-4 py-3 text-sm">
            <summary className="cursor-pointer font-medium text-secondary">
                {photo ? "Detection performance" : performance.fps === null ? "Measuring FPS" : `${performance.fps.toFixed(1)} processing FPS`}
                {" · "}{Math.round(performance.detectionDelayMs)} ms {photo ? "request delay" : "frame response delay"}
            </summary>
            <p className="mt-2 text-xs text-tertiary">
                {photo ? "Measured for this photo request, including upload and saving results." : `Averages for the latest ${performance.sampleCount} processed frames. FPS measures processing throughput, not video playback.`}
                {" "}Round trip includes the backend, worker and communication. YOLO time covers only the stages reported by the model.
                {" "}The difference also includes other server work; it is not a network-only measurement.
                {!photo && " Frame response delay excludes camera buffering, screen refresh, session setup and final saving."}
                {type === "video" && " Next-frame preparation overlaps the current request, so these stage times should not be added to estimate total processing time."}
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {metrics.map((metric) => (
                    <div key={metric.label}>
                        <dt className="text-xs text-tertiary">{metric.label}</dt>
                        <dd className="mt-1 font-medium tabular-nums text-secondary">{metric.value}</dd>
                    </div>
                ))}
            </dl>
        </details>
    )
}
