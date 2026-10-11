"use client"

import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { Maximize02 } from "@untitledui/icons"
import { useCallback, useEffect, useRef, useState } from "react"
import { EmptyFile } from "./empty-file"
import type { Area, Detection, ReportConfig } from "@/types"
import { Download } from "lucide-react"
import { drawAnnotatedImage } from "@/utils/draw-annotated-image"

interface ImageDisplayBoxProps {
    imageUrl: string | null
    detections: Detection[]
    area: Area | null
    drawingConfig?: ReportConfig
    onImageLoad: (width: number, height: number) => void
}

export function ImageDisplayBox({ imageUrl, detections, area, drawingConfig, onImageLoad }: ImageDisplayBoxProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)
    const fullImgRef = useRef<HTMLImageElement>(null)
    const fullCanvasRef = useRef<HTMLCanvasElement>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [downloadError, setDownloadError] = useState<string | null>(null)

    const draw = useCallback((img: HTMLImageElement | null, canvas: HTMLCanvasElement | null) => {
        if (!canvas || !img?.complete || !img.naturalWidth || !img.naturalHeight) return

        drawAnnotatedImage({ canvas, source: img, detections, area, drawingConfig })
        // object-contain may leave empty space inside the image element.
        const rect = img.getBoundingClientRect()
        const scale = Math.min(rect.width / img.naturalWidth, rect.height / img.naturalHeight)
        canvas.style.width = `${img.naturalWidth * scale}px`
        canvas.style.height = `${img.naturalHeight * scale}px`
    }, [detections, area, drawingConfig])

    useEffect(() => {
        const observer = new ResizeObserver(() => {
            draw(imgRef.current, canvasRef.current)
            draw(fullImgRef.current, fullCanvasRef.current)
        })
        if (imgRef.current) observer.observe(imgRef.current)
        if (fullImgRef.current) observer.observe(fullImgRef.current)
        draw(imgRef.current, canvasRef.current)
        draw(fullImgRef.current, fullCanvasRef.current)
        return () => observer.disconnect()
    }, [draw, imageUrl, isOpen])

    const downloadImage = () => {
        const img = imgRef.current
        if (!img?.complete || !img.naturalWidth) return
        setDownloadError(null)
        try {
            const canvas = document.createElement("canvas")
            drawAnnotatedImage({ canvas, source: img, detections, area, drawingConfig, includeSource: true })
            const link = document.createElement("a")
            link.download = "detections.png"
            link.href = canvas.toDataURL("image/png")
            document.body.appendChild(link)
            try {
                link.click()
            } finally {
                link.remove()
            }
        } catch {
            setDownloadError("Unable to download the annotated image. Please try again.")
        }
    }

    return (
        <>
            <div className="w-full h-64 lg:h-112 rounded-lg overflow-hidden bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1">
                {imageUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <img
                            ref={imgRef}
                            src={imageUrl}
                            crossOrigin="anonymous"
                            alt="Detection image"
                            className="block max-w-full max-h-full object-contain"
                            onLoad={(event) => {
                                const img = event.currentTarget
                                onImageLoad(img.naturalWidth, img.naturalHeight)
                                setDownloadError(null)
                                draw(img, canvasRef.current)
                            }}
                        />
                        <canvas ref={canvasRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                        <div className="absolute flex gap-2 top-2 right-2">
                            {detections.length > 0 && (
                                <button type="button" aria-label="Download annotated image" title="Download annotated image" className="p-2 rounded-md bg-primary hover:bg-brand-primary transition cursor-pointer" onClick={downloadImage}>
                                    <Download size={18} />
                                </button>
                            )}
                            <button type="button" aria-label="Maximize image" title="Maximize image" className="p-2 rounded-md bg-primary hover:bg-brand-primary transition cursor-pointer" onClick={() => setIsOpen(true)}>
                                <Maximize02 size={18} />
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center"><EmptyFile /></div>
                )}
            </div>
            {downloadError && <p role="alert" className="mt-2 text-sm text-error-primary">{downloadError}</p>}
            {isOpen && imageUrl && (
                <FullScreenModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="relative flex h-full w-full items-center justify-center overflow-hidden p-4 sm:p-6">
                        <img
                            ref={fullImgRef}
                            src={imageUrl}
                            alt="Maximized detection image"
                            className="block h-full w-full object-contain"
                            onLoad={(event) => draw(event.currentTarget, fullCanvasRef.current)}
                        />
                        <canvas ref={fullCanvasRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                </FullScreenModal>
            )}
        </>
    )
}
