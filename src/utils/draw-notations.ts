import { Area, Detection } from "@/types"

interface DrawOptions {
    canvas: HTMLCanvasElement
    image: HTMLImageElement
    detections: Detection[]
    area: Area | null
    boxColor?: string
    lineWidth?: number
    font?: string
}

export function drawNotations({
    canvas,
    image,
    detections,
    area,
    boxColor = "red",
    lineWidth = 8,
    font = "32px sans-serif",
}: DrawOptions) {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Adjust canvas to image size
    canvas.width = image.width
    canvas.height = image.height

    // Clean and draw base image
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(image, 0, 0)

    // Draw detections
    detections.forEach((d) => {
        const [x1, y1, x2, y2] = d.bbox
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

    //Draw Area
    if (area) {
        const x1 = area.x1 * canvas.width
        const y1 = area.y1 * canvas.height
        const x2 = area.x2 * canvas.width
        const y2 = area.y2 * canvas.height

        const x = Math.min(x1, x2)
        const y = Math.min(y1, y2)
        const w = Math.abs(x2 - x1)
        const h = Math.abs(y2 - y1)

        ctx.strokeStyle = "blue"
        ctx.lineWidth = 8
        ctx.strokeRect(x, y, w, h)
    }

}