import { Area } from "@/types"

interface DrawAreaOptions {
    canvas: HTMLCanvasElement
    source: HTMLImageElement | HTMLVideoElement
    area: Area | null
    areaColor?: string
}

export function drawArea({
    canvas,
    source,
    area,
    areaColor = "blue",
}: DrawAreaOptions) {

    if (!area) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width =
        source instanceof HTMLImageElement
            ? source.naturalWidth
            : source.videoWidth

    const { x1, y1, x2, y2 } = area

    const x = Math.min(x1, x2)
    const y = Math.min(y1, y2)
    const w = Math.abs(x2 - x1)
    const h = Math.abs(y2 - y1)

    const lineWidth = Math.max(2, Math.min(8, width * 0.005))

    ctx.strokeStyle = areaColor
    ctx.lineWidth = lineWidth

    ctx.strokeRect(x, y, w, h)
}
