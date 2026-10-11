import type { Area, Detection, Line, ReportConfig } from "@/types"

interface DrawNotationsOptions {
    canvas: HTMLCanvasElement
    source: HTMLImageElement | HTMLVideoElement
    detections: Detection[]
    area: Area | null
    boxColor?: string
    labelColor?: string
    lineWidth?: number
    font?: string
    drawingConfig?: ReportConfig
}

export function drawNotations({
    canvas,
    source,
    detections,
    area,
    boxColor = "red",
    labelColor = boxColor,
    lineWidth,
    font,
    drawingConfig,
}: DrawNotationsOptions) {

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width =
        source instanceof HTMLImageElement
            ? source.naturalWidth
            : source.videoWidth

    const height =
        source instanceof HTMLImageElement
            ? source.naturalHeight
            : source.videoHeight

    if (!width || !height) return

    const fontSize = Math.max(12, Math.round(Math.min(width, height) * 0.025))
    const labelGap = Math.max(2, Math.round(fontSize * 0.2))
    const pointRadius = Math.max(3, Math.round(Math.min(width, height) * 0.005))
    const boxesEnabled = drawingConfig?.bbox_enable ?? true
    const pointsEnabled = drawingConfig?.dot_enable ?? false
    const boxLabelsEnabled = drawingConfig?.bbox_label_enable ?? true
    const pointLabelsEnabled = drawingConfig?.dot_label_enable ?? false

    ctx.font = font ?? `${fontSize}px sans-serif`
    ctx.textAlign = "left"
    ctx.textBaseline = "bottom"

    detections.forEach((d, index) => {

        const [bx1, by1, bx2, by2] = d.bbox

        let x1 = bx1
        let y1 = by1
        let x2 = bx2
        let y2 = by2

        // Adjusts bbox coordinates to match the defined area
        if (area) {
            const ax = area.x1
            const ay = area.y1

            x1 += ax
            y1 += ay
            x2 += ax
            y2 += ay
        }

        const w = x2 - x1
        const h = y2 - y1

        ctx.strokeStyle = drawingConfig?.bbox_color ?? boxColor
        ctx.lineWidth = lineWidth ?? Math.max(2, Math.min(width, height) * 0.003)

        // Draw bbox
        if (boxesEnabled) ctx.strokeRect(x1, y1, w, h)

        // Draw dot in the center
        const centerX = (x1 + x2) / 2
        const centerY = (y1 + y2) / 2
        if (pointsEnabled) {
            ctx.fillStyle = drawingConfig?.dot_color ?? "yellow"
            ctx.beginPath()
            ctx.arc(centerX, centerY, pointRadius, 0, Math.PI * 2)
            ctx.fill()
        }

        // Draw labels
        const label = `${index + 1} - ${(d.confidence * 100).toFixed(0)}%`
        const drawLabel = (x: number, y: number, centered: boolean) => {
            const textWidth = ctx.measureText(label).width
            const padding = Math.max(2, Math.round(fontSize * 0.15))
            const left = Math.max(padding, Math.min(centered ? x - textWidth / 2 : x, width - textWidth - padding))
            const bottom = Math.max(fontSize + padding, Math.min(y, height - padding))
            ctx.textAlign = "left"
            if (drawingConfig) {
                ctx.fillStyle = drawingConfig.text_background_color
                ctx.fillRect(left - padding, bottom - fontSize - padding, textWidth + padding * 2, fontSize + padding * 2)
            }
            ctx.fillStyle = drawingConfig?.text_color ?? labelColor
            ctx.fillText(label, left, bottom)
        }

        // Draw lables
        if (boxesEnabled && boxLabelsEnabled) drawLabel(x1, y1 - labelGap, false)
        if (pointsEnabled && pointLabelsEnabled && !boxesEnabled) drawLabel(centerX, centerY - pointRadius - labelGap, true)
    })
}
