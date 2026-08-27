import { Area, Detection } from "@/types"

interface DrawOptions {
    canvas: HTMLCanvasElement
    source: HTMLImageElement | HTMLVideoElement
    detections: Detection[]
    area: Area | null
    boxColor?: string
    lineWidth?: number
    font?: string
    drawSource?: boolean;
}

/**
 * Draws an image on a canvas and overlays:
 * - detection bounding boxes
 * - a user-selected area (if provided)
 */
export function drawNotations({
    canvas,
    source,
    detections,
    area,
    boxColor = "red",
    lineWidth = 8,
    font = "32px sans-serif",
    drawSource = false
}: DrawOptions) {
    
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Resize canvas to match the image dimensions
    const width =
        source instanceof HTMLImageElement
            ? source.naturalWidth
            : source.videoWidth

    const height =
        source instanceof HTMLImageElement
            ? source.naturalHeight
            : source.videoHeight

    canvas.width = width
    canvas.height = height

    // Clear previous content and draw the base image
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (drawSource) {
        ctx.drawImage(source, 0, 0, canvas.width, canvas.height)
    }

    // Draw detection bounding boxes and labels
    detections.forEach((d) => {
        const [bx1, by1, bx2, by2] = d.bbox

        // Base bounding box coordinates (relative to full image)
        let x1 = bx1
        let y1 = by1
        let x2 = bx2
        let y2 = by2


        /**
         * If a selected area exists, shift detections into that region.
         * This assumes detections are relative to the cropped area.
         */
        if (area) {

            // Convert normalized area origin to absolute image coordinates
            const ax = area.x1 * width
            const ay = area.y1 * height

            // Offset detection coordinates by selected area position
            x1 += ax
            y1 += ay
            x2 += ax
            y2 += ay
        }

        // Compute final bounding box size
        const w = x2 - x1
        const h = y2 - y1

        // Set bounding box style
        ctx.strokeStyle = boxColor
        ctx.lineWidth = lineWidth

        // Draw bounding box
        ctx.strokeRect(x1, y1, w, h)

        // Set label style
        ctx.fillStyle = boxColor
        ctx.font = font

        // Draw class name + confidence above the bounding box
        ctx.fillText(
            `${d.class_name} ${(d.confidence * 100).toFixed(1)}%`,
            x1,
            Math.max(10, y1 - 5)
        )
    })

    // Draw user-selected area (normalized coordinates 0–1)
    if (area) {

        // Convert normalized coordinates to canvas coordinates
        const x1 = area.x1 * canvas.width
        const y1 = area.y1 * canvas.height
        const x2 = area.x2 * canvas.width
        const y2 = area.y2 * canvas.height

        // Ensure valid rectangle regardless of drag direction
        const x = Math.min(x1, x2)
        const y = Math.min(y1, y2)
        const w = Math.abs(x2 - x1)
        const h = Math.abs(y2 - y1)

        // Style for selected area
        ctx.strokeStyle = "blue"
        ctx.lineWidth = 8

        // Draw selected region rectangle
        ctx.strokeRect(x, y, w, h)
    }

}