import { Detection } from "@/types"

interface DrawOptions {
    canvas: HTMLCanvasElement
    image: HTMLImageElement
    detections: Detection[]
    boxColor?: string
    lineWidth?: number
    font?: string
}

export function drawNotations({
    canvas,
    image,
    detections,
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

    // Draw dtections
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
}