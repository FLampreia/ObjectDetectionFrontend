"use client"

import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { Maximize02 } from "@untitledui/icons"
import { useEffect, useRef, useState } from "react"
import { EmptyFile } from "./empty-file"
import { Area, Detection } from "@/types"
import { Download } from "lucide-react"
import { drawNotations, drawArea } from "@/utils/draw-notations"
import Image from "next/image"


interface ImageDisplayBoxProps {
    imageUrl: string | null
    detections: Detection[]
    area: Area | null
    onImageLoad: (width: number, height: number) => void
}

export function ImageDisplayBox({
    imageUrl,
    detections,
    area,
    onImageLoad
}: ImageDisplayBoxProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    const fullImgRef = useRef<HTMLImageElement>(null)
    const fullCanvasRef = useRef<HTMLCanvasElement>(null)

    const hasDetections = detections && detections.length > 0

    const [isOpen, setIsOpen] = useState(false)

    const draw = () => {
        const canvas = canvasRef.current
        const img = imgRef.current

        if (!canvas || !img) return
        if (!img.naturalWidth || !img.naturalHeight) return

        const rect = img.getBoundingClientRect()

        // Dimensões internas = dimensões reais da imagem
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight

        // Dimensões visuais = dimensões apresentadas da imagem
        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        drawArea({
            canvas,
            source: img,
            area,
        })

        if (detections.length > 0) {
            drawNotations({
                canvas,
                source: img,
                detections,
                area,
            })
        }
    }

    // Load Image
    useEffect(() => {
        if (!imageUrl) {
            imgRef.current = null
            const canvas = canvasRef.current
            const ctx = canvas?.getContext("2d")

            if (canvas && ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height)
            }

            return
        }
    }, [imageUrl])

    // Redraw when detections change
    useEffect(() => {
        draw()
    }, [detections, area])

    useEffect(() => {
        if (!isOpen) return

        const img = fullImgRef.current
        const canvas = fullCanvasRef.current

        if (!img || !canvas) return

        const rect = img.getBoundingClientRect()

        canvas.style.width = `${rect.width}px`
        canvas.style.height = `${rect.height}px`

        drawNotations({
            canvas,
            source: img,
            detections,
            area,
            lineWidth: 2,
        })
    }, [isOpen, detections, area])

    const downloadImage = () => {
        if (!imgRef.current) return

        const exportCanvas = document.createElement("canvas")

        drawNotations({
            canvas: exportCanvas,
            source: imgRef.current,
            detections,
            area,
            drawSource: true,
        })

        const link = document.createElement("a")
        link.download = "detections.png"
        link.href = exportCanvas.toDataURL("image/png")
        link.click()
    }

    return (
        <>
            <div className="w-full h-64 lg:h-112 rounded-lg overflow-hidden bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1">
                {imageUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative flex items-center justify-center w-full h-full">
                            <img
                                ref={imgRef}
                                src={imageUrl}
                                alt=""
                                className="block max-w-full max-h-full object-contain"
                                onLoad={(e) => {
                                    const img = e.currentTarget

                                    onImageLoad(
                                        img.naturalWidth,
                                        img.naturalHeight
                                    )

                                    draw()
                                }}
                            />

                            <canvas
                                ref={canvasRef}
                                className="absolute pointer-events-none"
                            />

                        </div>

                        <div className="absolute flex gap-2 top-2 right-2">
                            {hasDetections && (
                                <button
                                    className=" p-2 rounded-md bg-primary hover:bg-brand-primary transition cursor-pointer"
                                    onClick={downloadImage}
                                >
                                    <Download size={18} />
                                </button>
                            )}

                            <button
                                className="top-2 right-2 p-2 rounded-md bg-primary hover:bg-brand-primary transition cursor-pointer"
                                onClick={() => {
                                    setIsOpen(true)
                                }}
                            >
                                <Maximize02 size={18} />
                            </button>

                        </div>
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <EmptyFile />
                    </div>
                )}
            </div>
            {isOpen && imageUrl && (
                <FullScreenModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="relative inline-block">
                        <img
                            ref={fullImgRef}
                            src={imageUrl}
                            alt=""
                            className="max-w-full max-h-full object-contain block"
                            onLoad={() => {
                                const img = fullImgRef.current
                                const canvas = fullCanvasRef.current

                                if (!img || !canvas) return

                                const rect = img.getBoundingClientRect()

                                canvas.style.width = `${rect.width}px`
                                canvas.style.height = `${rect.height}px`

                                drawNotations({
                                    canvas,
                                    source: img,
                                    detections,
                                    area,
                                    lineWidth: 2,
                                })
                            }}
                        />

                        <canvas
                            ref={fullCanvasRef}
                            className="absolute inset-0 pointer-events-none"
                        />
                    </div>
                </FullScreenModal>
            )}
        </>
    )
}