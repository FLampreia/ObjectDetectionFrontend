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

    ctx.save()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = Math.max(2, Math.min(8, width * 0.005))
    ctx.beginPath()
    ctx.moveTo(line.x1, line.y1)
    ctx.lineTo(line.x2, line.y2)
    ctx.stroke()
    const length = Math.hypot(x2 - x1, y2 - y1)
    if (length > 0) {
        const fontSize = Math.max(14, width / 50)
        const offset = fontSize * 1.5
        const nx = -(y2 - y1) / length, ny = (x2 - x1) / length
        ctx.font = `bold ${fontSize}px sans-serif`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillStyle = lineColor
        ctx.strokeStyle = "#111827"
        ctx.lineWidth = 3
        for (const [label, sign] of [["A", -1], ["B", 1]] as const) {
            const x = (x1 + x2) / 2 + nx * offset * sign
            const y = (y1 + y2) / 2 + ny * offset * sign
            ctx.strokeText(label, x, y)
            ctx.fillText(label, x, y)
        }
    }
    ctx.restore()
}
