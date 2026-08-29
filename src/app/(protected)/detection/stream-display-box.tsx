"use client"

import { EmptyFile } from "./empty-file"

import { RefObject, useEffect, useRef } from "react"

import { Area, Detection } from "@/types"

import { drawArea, drawNotations } from "@/utils/draw-notations"
// import { drawArea } from "./draw-area"

interface StreamDisplayBoxProps {
    videoStream: MediaStream | null
    streamUrl: string
    area: Area | null
    detections: Detection[]
    videoRef: RefObject<HTMLVideoElement | null>
    loading: boolean
    onImageLoad: (width: number, height: number) => void
    onVideoReady?: (ready: boolean) => void
}

export function StreamDisplayBox({
    videoStream,
    streamUrl,
    area,
    videoRef,
    detections,
    loading,
    onImageLoad,
    onVideoReady,
}: StreamDisplayBoxProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null)

    const clearCanvas = (
        canvas: HTMLCanvasElement | null
    ) => {
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)
    }

    const draw = (
        video: HTMLVideoElement | null,
        canvas: HTMLCanvasElement | null
    ) => {
        if (!video || !canvas) return
        if (!video.videoWidth || !video.videoHeight) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        canvas.style.left = `${video.offsetLeft}px`
        canvas.style.top = `${video.offsetTop}px`
        canvas.style.width = `${video.clientWidth}px`
        canvas.style.height = `${video.clientHeight}px`

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // A área é sempre desenhada
        drawArea({
            canvas,
            source: video,
            area,
        })

        // As deteções só são desenhadas durante a deteção
        if (loading) {
            drawNotations({
                canvas,
                source: video,
                detections,
                area,
            })
        }
    }

    // Liga o MediaStream ou URL ao elemento <video>
    useEffect(() => {
        const video = videoRef.current

        if (!video) return

        onVideoReady?.(false)

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

    // Redesenha sempre que a área/deteções/loading mudam
    useEffect(() => {
        draw(videoRef.current, canvasRef.current)
    }, [detections, area, loading])

    return (
        <div className="w-full h-64 lg:h-112 rounded-lg overflow-hidden flex items-center justify-center bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1">

            {videoStream || streamUrl ? (

                <div className="relative w-full h-full flex items-center justify-center">

                    <div className="relative flex items-center justify-center w-full h-full">

                        <video
                            ref={videoRef}
                            crossOrigin="anonymous"
                            autoPlay
                            muted
                            playsInline
                            className="block max-w-full max-h-full object-contain"

                            onLoadedMetadata={() => {
                                const video = videoRef.current

                                if (!video) return

                                onVideoReady?.(true)

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

                            onCanPlay={() => {
                                onVideoReady?.(true)
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