import { Line } from "@/types"

interface DrawAreaOptions {
    canvas: HTMLCanvasElement
    source: HTMLImageElement | HTMLVideoElement
    line: Line | null
    lineColor?: string
}

export function drawLine({
    canvas,
    source,
    line,
    lineColor = "yellow",
}: DrawAreaOptions) {

    if (!line) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width =
        source instanceof HTMLImageElement
            ? source.naturalWidth
            : source.videoWidth

    const { x1, y1, x2, y2 } = line

    const x = Math.min(x1, x2)
    const y = Math.min(y1, y2)
    const w = Math.abs(x2 - x1)
    const h = Math.abs(y2 - y1)

    ctx.save()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = Math.max(2, Math.min(8, width * 0.005))
    ctx.beginPath()
    ctx.moveTo(line.x1, line.y1)
    ctx.lineTo(line.x2, line.y2)
    ctx.stroke()
    ctx.restore()
}
