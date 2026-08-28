"use client"

import { EmptyFile } from "./empty-file"
import { RefObject, useEffect, useRef } from "react"
import { Area, Detection } from "@/types"
import { drawNotations } from "@/utils/draw-notations"

interface StreamDisplayBoxProps {
    videoStream: MediaStream | null
    streamUrl: string
    area: Area | null
    detections: Detection[]
    videoRef: RefObject<HTMLVideoElement | null>
    loading: boolean
    onImageLoad: (width: number, height: number) => void
}

export function StreamDisplayBox({
    videoStream,
    streamUrl,
    area,
    videoRef,
    detections,
    loading,
    onImageLoad,
}: StreamDisplayBoxProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const draw = (
        video: HTMLVideoElement | null,
        canvas: HTMLCanvasElement | null
    ) => {
        if (!video || !canvas) return

        if (!video.videoWidth || !video.videoHeight) return

        canvas.style.left = `${video.offsetLeft}px`
        canvas.style.top = `${video.offsetTop}px`
        canvas.style.width = `${video.clientWidth}px`
        canvas.style.height = `${video.clientHeight}px`

        drawNotations({
            canvas,
            source: video,
            detections,
            area,
        })
    }

    /*
     * Liga o MediaStream ao elemento <video>
     */
    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        if (videoStream) {
            video.srcObject = videoStream
            video.play().catch(error => {
                console.error("Failed to play stream:", error)
            })
        } else if (streamUrl) {
            video.srcObject = null
            video.src = streamUrl
            video.load()

            video.play().catch(error => {
                console.error("Failed to play URL stream:", error)
            })
        } else {
            video.srcObject = null
            video.src = ""
        }

        return () => {
            video.srcObject = null
        }
    }, [videoStream, streamUrl, videoRef])
    /*
     * Atualiza as deteções desenhadas no canvas
     */
    useEffect(() => {
        draw(videoRef.current, canvasRef.current)
    }, [detections, area])

    return (
        <div className="w-full h-64 lg:h-112 rounded-lg overflow-hidden flex items-center justify-center bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1">

            {videoStream || streamUrl ? (
                <div className="relative w-full h-full flex items-center justify-center">

                    <div className="relative flex items-center justify-center w-full h-full">

                        <video
                            ref={videoRef}
                            autoPlay
                            muted
                            playsInline
                            className="block max-w-full max-h-full object-contain"
                            onLoadedMetadata={() => {
                                const video = videoRef.current

                                if (!video) return

                                onImageLoad(
                                    video.videoWidth,
                                    video.videoHeight
                                )

                                draw(video, canvasRef.current)
                            }}
                            onResize={() => {
                                draw(
                                    videoRef.current,
                                    canvasRef.current
                                )
                            }}
                        />

                        <canvas
                            ref={canvasRef}
                            className="absolute pointer-events-none"
                        />

                    </div>
                </div>
            ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                    <EmptyFile />
                </div>
            )}

        </div>
    )
}