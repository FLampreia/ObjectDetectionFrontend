import { Area } from "@/types"

interface DrawAreaOptions {
    canvas: HTMLCanvasElement
    source: HTMLImageElement | HTMLVideoElement
    area: Area | null
}

export function drawArea({
    canvas,
    source,
    area,
}: DrawAreaOptions) {

    if (!area) return

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

    const x1 = area.x1 * width
    const y1 = area.y1 * height
    const x2 = area.x2 * width
    const y2 = area.y2 * height

    const x = Math.min(x1, x2)
    const y = Math.min(y1, y2)
    const w = Math.abs(x2 - x1)
    const h = Math.abs(y2 - y1)

    ctx.strokeStyle = "blue"
    ctx.lineWidth = 8

    ctx.strokeRect(x, y, w, h)
}
