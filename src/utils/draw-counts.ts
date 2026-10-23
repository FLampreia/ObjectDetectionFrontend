import type { CrossingCounts } from "@/types"

interface DrawCountsOptions {
    canvas: HTMLCanvasElement
    source: HTMLImageElement | HTMLVideoElement
    crossingCounts?: CrossingCounts
    fontColor?: string
}

export function drawCounter({
    canvas,
    source,
    crossingCounts,
    fontColor = "yellow",
}: DrawCountsOptions) {
    if (!crossingCounts) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = source instanceof HTMLImageElement ? source.naturalWidth : source.videoWidth
    const height = source instanceof HTMLImageElement ? source.naturalHeight : source.videoHeight
    
    if (!width || !height) return

    const fontSize = Math.max(14, width / 50)
    const margin = fontSize
    
    const padding = Math.round(fontSize * 0.5)
    const lineHeight = Math.round(fontSize * 1.5)
    
    const labels = [
        `A → B: ${crossingCounts.A_to_B}`,
        `B → A: ${crossingCounts.B_to_A}`,
        `Total: ${crossingCounts.A_to_B + crossingCounts.B_to_A}`,
    ]

    ctx.save()
    ctx.font = `bold ${fontSize}px sans-serif`
    ctx.textAlign = "right"
    ctx.textBaseline = "top"

    const textWidth = Math.max(...labels.map(label => ctx.measureText(label).width))
    
    ctx.fillStyle = "rgba(17, 24, 39, 0.8)"
    ctx.fillRect(width - margin - textWidth - padding * 2, margin, textWidth + padding * 2, labels.length * lineHeight + padding * 2)

    ctx.fillStyle = fontColor
    
    labels.forEach((label, index) => {
        ctx.fillText(label, width - margin - padding, margin + padding + index * lineHeight)
    })

    ctx.restore()
}
