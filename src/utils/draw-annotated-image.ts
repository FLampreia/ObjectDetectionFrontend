import type { Area, Detection, ReportConfig } from "@/types"
import { drawArea } from "./draw-area"
import { drawNotations } from "./draw-notations"

export function drawAnnotatedImage({ canvas, source, detections, area, includeSource = false, boxColor, labelColor, drawingConfig }: {
    canvas: HTMLCanvasElement
    source: HTMLImageElement
    detections: Detection[]
    area: Area | null
    includeSource?: boolean
    boxColor?: string
    labelColor?: string
    drawingConfig?: ReportConfig
}) {
    if (!source.naturalWidth || !source.naturalHeight) return

    canvas.width = source.naturalWidth
    canvas.height = source.naturalHeight
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Unable to draw the image.")

    if (includeSource) context.drawImage(source, 0, 0)
    drawArea({ canvas, source, area, areaColor: drawingConfig?.area_color })
    drawNotations({ canvas, source, detections, area, boxColor, labelColor, drawingConfig })
}
