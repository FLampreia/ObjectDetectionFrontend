"use client"

import { EmptyFile } from "./empty-file"

import { RefObject, useCallback, useEffect, useLayoutEffect, useRef } from "react"
import type { StreamFrameRenderer } from "@/types/stream-performance"

import { Area, CrossingCounts, Detection, DrawingColors, Line, ReportConfig } from "@/types"

import { drawNotations } from "@/utils/draw-notations"
import { drawArea } from "@/utils/draw-area"
import { drawLine } from "@/utils/draw-line"
import { drawCounter } from "@/utils/draw-counts"

interface StreamDisplayBoxProps {
    videoStream: MediaStream | null
    streamUrl: string
    area: Area | null
    line: Line | null
    crossingCounts?: CrossingCounts
    colors: DrawingColors
    drawingConfig: ReportConfig
    streamFrameRendererRef: RefObject<StreamFrameRenderer | null>
    videoRef: RefObject<HTMLVideoElement | null>
    loading: boolean
    onImageLoad: (width: number, height: number) => void
    onVideoReady?: (ready: boolean) => void
}

export function StreamDisplayBox({
    videoStream,
    streamUrl,
    area,
    line,
    crossingCounts,
    colors,
    drawingConfig,
    videoRef,
    streamFrameRendererRef,
    loading,
    onImageLoad,
    onVideoReady,
}: StreamDisplayBoxProps) {

    const canvasRef = useRef<HTMLCanvasElement>(null)
    const latestDetectionsRef = useRef<Detection[]>([])

    const draw = useCallback((
        video: HTMLVideoElement | null,
        canvas: HTMLCanvasElement | null
    ) => {
        if (!video || !canvas) return
        if (!video.videoWidth || !video.videoHeight) return

        // Resizing clears and reallocates the canvas; do it only when resolution changes.
        if (canvas.width !== video.videoWidth) canvas.width = video.videoWidth
        if (canvas.height !== video.videoHeight) canvas.height = video.videoHeight

        canvas.style.left = `${video.offsetLeft}px`
        canvas.style.top = `${video.offsetTop}px`
        canvas.style.width = `${video.clientWidth}px`
        canvas.style.height = `${video.clientHeight}px`

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Area always draw
        drawArea({
            canvas,
            source: video,
            area,
            areaColor: drawingConfig.area_color,
        })

        // Line always draw
        drawLine({
            canvas,
            source: video,
            line,
            lineColor: colors.lineColor,
        })

        // Draw passages counter in the corner
        if (line) {
            drawCounter({
                canvas,
                source: video,
                crossingCounts
            })
        }



        // Detections only draw during processing
        if (loading) {
            drawNotations({
                canvas,
                source: video,
                detections: latestDetectionsRef.current,
                drawingConfig,
                area
            })
        }
    }, [area, line, crossingCounts, drawingConfig, colors.lineColor, loading])

    // Connect the MediaStream or URL to the <video> element.
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

    // Draw responses immediately, without waiting for a React render of the whole form.
    useLayoutEffect(() => {
        if (!loading) latestDetectionsRef.current = []
        const renderFrame: StreamFrameRenderer = (detections) => {
            const startedAt = performance.now()
            latestDetectionsRef.current = detections
            draw(videoRef.current, canvasRef.current)
            return performance.now() - startedAt
        }
        streamFrameRendererRef.current = renderFrame
        draw(videoRef.current, canvasRef.current)
        const observer = new ResizeObserver(() => draw(videoRef.current, canvasRef.current))
        if (videoRef.current) observer.observe(videoRef.current)
        return () => {
            observer.disconnect()
            if (streamFrameRendererRef.current === renderFrame) streamFrameRendererRef.current = null
        }
    }, [draw, loading, videoRef, streamFrameRendererRef, videoStream, streamUrl])

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
                    <EmptyFile source="stream" />
                </div>

            )}

        </div>
    )
}
