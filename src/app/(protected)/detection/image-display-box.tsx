"use client"

import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { Maximize02 } from "@untitledui/icons"
import { useEffect, useRef, useState } from "react"
import { EmptyFile } from "./empty-file"
import { Detection } from "@/types"
import { Download } from "lucide-react"
import { drawNotations } from "@/utils/draw-notations"


interface ImageDisplayBoxProps {
    imageUrl: string | null
    detections: Detection[]
}

export function ImageDisplayBox({ imageUrl, detections }: ImageDisplayBoxProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imgRef = useRef<HTMLImageElement | null>(null)

    const hasDetections = detections && detections.length > 0

    const [isOpen, setIsOpen] = useState(false)



    const draw = () => {
        const canvas = canvasRef.current
        const img = imgRef.current

        if (!canvas || !img) return

        drawNotations({
            canvas,
            image: img,
            detections,
        })
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

        const img = new Image()

        img.onload = () => {
            imgRef.current = img
            draw()
        }

        img.src = imageUrl
    }, [imageUrl])

    // Redraw when detections change
    useEffect(() => {
        draw()
    }, [detections])

    const downloadImage = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const link = document.createElement("a")
        link.download = "detections.png"
        link.href = canvas.toDataURL("image/png")
        link.click()
    }

    return (
        <>
            <div className="w-full h-64 lg:h-112 rounded-lg overflow-hidden flex items-center justify-center bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1">
                {imageUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <canvas
                            ref={canvasRef}
                            className="object-contain"
                            style={{ width: "100%", height: "100%" }}
                        />



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
                    <EmptyFile />
                )}
            </div>
            {isOpen && imageUrl && (
                <FullScreenModal isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <canvas
                        ref={(node) => {
                            if (!node) return

                            const img = imgRef.current
                            if (!img) return

                            drawNotations({
                                canvas: node,
                                image: img,
                                detections,
                                lineWidth: 2,
                            })
                        }}
                        className="max-w-full max-h-full"
                    />
                </FullScreenModal>
            )}
        </>
    )
}