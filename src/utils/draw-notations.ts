import { Area, Detection } from "@/types"

interface DrawAreaOptions {
    canvas: HTMLCanvasElement
    source: HTMLImageElement | HTMLVideoElement
    area: Area | null
}

interface DrawNotationsOptions {
    canvas: HTMLCanvasElement
    source: HTMLImageElement | HTMLVideoElement
    detections: Detection[]
    area: Area | null
    boxColor?: string
    lineWidth?: number
    font?: string
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

export function drawNotations({
    canvas,
    source,
    detections,
    area,
    boxColor = "red",
    lineWidth = 8,
    font = "32px sans-serif",
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

    detections.forEach((d) => {

        const [bx1, by1, bx2, by2] = d.bbox

        let x1 = bx1
        let y1 = by1
        let x2 = bx2
        let y2 = by2

        if (area) {
            const ax = area.x1 * width
            const ay = area.y1 * height

            x1 += ax
            y1 += ay
            x2 += ax
            y2 += ay
        }

        const w = x2 - x1
        const h = y2 - y1

        ctx.strokeStyle = boxColor
        ctx.lineWidth = lineWidth

        ctx.strokeRect(x1, y1, w, h)

        ctx.fillStyle = boxColor
        ctx.font = font

        ctx.fillText(
            `${d.class_name} ${(d.confidence * 100).toFixed(1)}%`,
            x1,
            Math.max(10, y1 - 5)
        )
    })
}