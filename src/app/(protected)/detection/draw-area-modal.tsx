"use client"

import { useEffect, useRef, useState } from "react"

import { Eraser, Save } from "lucide-react"

import { Button } from "@/components/base/buttons/button"

import { Area } from "@/types"

interface Props {
    imageUrl: string | null
    area: Area | null
    onSave: (area: Area | null) => void
}

export function DrawAreaModal({
    imageUrl,
    area,
    onSave,
}: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    const [startPoint, setStartPoint] = useState<{
        x: number
        y: number
    } | null>(null)

    const [currentPoint, setCurrentPoint] = useState<{
        x: number
        y: number
    } | null>(null)

    const [isDragging, setIsDragging] = useState(false)

    const [finalRect, setFinalRect] = useState<Area | null>(area)

    function clearCanvas() {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")

        if (!canvas || !ctx) return

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        )
    }

    function drawArea(rect: Area) {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")

        if (!canvas || !ctx) return

        const { x1, y1, x2, y2 } = rect

        const x = Math.min(x1, x2)
        const y = Math.min(y1, y2)

        const width = Math.abs(x2 - x1)
        const height = Math.abs(y2 - y1)

        ctx.strokeStyle = "blue"
        ctx.lineWidth = 2

        ctx.strokeRect(
            x,
            y,
            width,
            height
        )
    }

    function handlePointerDown(
        e: React.PointerEvent<HTMLCanvasElement>
    ) {
        e.preventDefault()
        e.stopPropagation()

        const canvas = canvasRef.current

        if (!canvas) return

        // Começar um novo desenho apaga a área anterior
        clearCanvas()

        setFinalRect(null)
        setStartPoint(null)
        setCurrentPoint(null)

        const rect = canvas.getBoundingClientRect()
        const img = imageRef.current

        if (!img) return

        const point = {
            x: (e.clientX - rect.left) * img.naturalWidth / rect.width,
            y: (e.clientY - rect.top) * img.naturalHeight / rect.height,
        }

        setStartPoint(point)
        setCurrentPoint(point)
        setIsDragging(true)
    }

    function handlePointerMove(
        e: React.PointerEvent<HTMLCanvasElement>
    ) {
        e.preventDefault()
        e.stopPropagation()

        if (!isDragging || !startPoint) return

        const canvas = canvasRef.current

        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const img = imageRef.current

        if (!img) return

        const point = {
            x: (e.clientX - rect.left) * img.naturalWidth / rect.width,
            y: (e.clientY - rect.top) * img.naturalHeight / rect.height,
        }

        setCurrentPoint(point)

        drawRect(startPoint, point)
    }

    function handlePointerUp(
        e: React.PointerEvent<HTMLCanvasElement>
    ) {
        e.preventDefault()
        e.stopPropagation()

        setIsDragging(false)

        if (!startPoint || !currentPoint) return

        const canvas = canvasRef.current

        if (!canvas) return

        const finalRect: Area = {
            x1: Math.round(Math.min(startPoint.x, currentPoint.x)),
            y1: Math.round(Math.min(startPoint.y, currentPoint.y)),
            x2: Math.round(Math.max(startPoint.x, currentPoint.x)),
            y2: Math.round(Math.max(startPoint.y, currentPoint.y)),
        }

        setFinalRect(finalRect)
    }

    function drawRect(
        p1: { x: number; y: number },
        p2: { x: number; y: number }
    ) {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")

        if (!canvas || !ctx) return

        ctx.clearRect(
            0,
            0,
            canvas.width,
            canvas.height
        )

        const x = Math.min(p1.x, p2.x)
        const y = Math.min(p1.y, p2.y)

        const width = Math.abs(p2.x - p1.x)
        const height = Math.abs(p2.y - p1.y)

        ctx.strokeStyle = "blue"
        ctx.lineWidth = 2

        ctx.strokeRect(
            x,
            y,
            width,
            height
        )
    }

    function save() {
        onSave(finalRect)
        console.log(finalRect)
    }

    function clear() {
        setFinalRect(null)
        setStartPoint(null)
        setCurrentPoint(null)
        setIsDragging(false)

        clearCanvas()
    }

    // Inicializa o canvas e desenha a área existente
    useEffect(() => {
        if (!imageUrl) return

        const img = imageRef.current
        const canvas = canvasRef.current

        if (!img || !canvas) return

        const handleLoad = () => {
            canvas.width = img.naturalWidth
            canvas.height = img.naturalHeight
            canvas.style.width = `${img.clientWidth}px`
            canvas.style.height = `${img.clientHeight}px`

            if (area) {
                setFinalRect(area)
                drawArea(area)
            } else {
                setFinalRect(null)
                clearCanvas()
            }
        }

        if (img.complete) {
            handleLoad()
        } else {
            img.onload = handleLoad
        }

        return () => {
            img.onload = null
        }
    }, [imageUrl])

    return (
        <div
            className="relative w-full h-full flex items-center justify-center"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative">
                <img
                    ref={imageRef}
                    src={imageUrl ?? ""}
                    className="max-h-[90vh] max-w-[90vw] object-contain block"
                    alt=""
                />

                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    className="absolute top-0 left-0 cursor-crosshair"
                />
            </div>

            <div className="absolute bottom-4 flex gap-3">
                <Button
                    onClick={save}
                    iconLeading={Save}
                >
                    Save Area
                </Button>

                <Button
                    color="secondary-destructive"
                    onClick={clear}
                    iconLeading={Eraser}
                >
                    Clear Area
                </Button>
            </div>
        </div>
    )
}