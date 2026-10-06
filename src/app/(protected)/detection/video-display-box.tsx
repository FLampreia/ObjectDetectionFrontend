"use client"

import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { EmptyFile } from "./empty-file"
import { Maximize02 } from "@untitledui/icons"
import { RefObject, useEffect, useRef, useState } from "react"
import { Area, Detection, DrawingColors, Line } from "@/types"
import { drawNotations } from "@/utils/draw-notations"
import { drawArea } from "@/utils/draw-area"
import { drawLine } from "@/utils/draw-line"

interface VideoDisplayBoxProps {
    videoUrl: string | null,
    area: Area | null,
    line: Line | null
    colors: DrawingColors
    detections: Detection[]
    videoRef: RefObject<HTMLVideoElement | null>
    loading: boolean
    onImageLoad: (width: number, height: number) => void
    onDurationChange?: (duration: number) => void
    onCurrentTimeChange?: (currentTime: number) => void
}

export function VideoDisplayBox({
    videoUrl,
    area,
    line,
    colors,
    videoRef,
    detections,
    loading,
    onImageLoad,
    onDurationChange,
    onCurrentTimeChange,
}: VideoDisplayBoxProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)


    const draw = (
        video: HTMLVideoElement | null,
        canvas: HTMLCanvasElement | null
    ) => {
        if (!canvas || !video) return
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

        // Area always draw
        drawArea({
            canvas,
            source: video,
            area,
            areaColor: colors.areaColor,
        })

        // Line always draw
        drawLine({
            canvas,
            source: video,
            line,
            lineColor: colors.lineColor,
        })

        // Detections only draw during processing
        if (loading) {
            drawNotations({
                canvas,
                source: video,
                detections: loading ? detections : [],
                area,
            })
        }
    }

    useEffect(() => {
        draw(videoRef.current, canvasRef.current)

    }, [detections, area, line, loading, colors])

    return (
        <>
            <div className="w-full h-64 lg:h-112 rounded-lg overflow-hidden flex items-center justify-center bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1">
                {videoUrl ? (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative flex items-center justify-center w-full h-full">
                            <video
                                ref={videoRef}
                                src={videoUrl}
                                className="block max-w-full max-h-full object-contain"
                                onLoadedMetadata={() => {
                                    onImageLoad(videoRef.current!.videoWidth, videoRef.current!.videoHeight)
                                    onDurationChange?.(videoRef.current!.duration)
                                    draw(videoRef.current, canvasRef.current)
                                }}
                                onTimeUpdate={() => {
                                    onCurrentTimeChange?.(videoRef.current!.currentTime)
                                }}

                            />

                            <canvas
                                ref={canvasRef}
                                className="absolute inset-0 pointer-events-none"
                            />
                        </div>

                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        <EmptyFile />
                    </div>
                )}
            </div>
        </>
    )
}