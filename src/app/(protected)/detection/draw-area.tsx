"use client"

import { useEffect, useRef, useState } from "react"
import { PenLine, Check, Trash, Save } from "lucide-react"
import { Button } from "@/components/base/buttons/button"

interface Props {
    imageUrl: string | null
    onSave: (area: { x1: number; y1: number; x2: number; y2: number }) => void
}

export function DrawArea({ imageUrl, onSave }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)

    const [drawing, setDrawing] = useState(false)
    const [startPoint, setStartPoint] = useState<{ x: number; y: number } | null>(null)
    const [currentPoint, setCurrentPoint] = useState<{ x: number; y: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)

    const [finalRect, setFinalRect] = useState<{
        x1: number
        y1: number
        x2: number
        y2: number
    } | null>(null)

    function drawCanvasBounds() {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.strokeStyle = "blue"
        ctx.lineWidth = 3
        ctx.strokeRect(
            0,
            0,
            canvas.width,
            canvas.height
        )
    }

    useEffect(() => {
        if (!imageUrl) return

        const img = imageRef.current
        const canvas = canvasRef.current

        if (!img || !canvas) return

        img.onload = () => {
            canvas.width = img.clientWidth
            canvas.height = img.clientHeight

            drawCanvasBounds()
        }
    }, [imageUrl])

    function handlePointerDown(e: React.MouseEvent<HTMLCanvasElement>) {
        e.preventDefault()
        e.stopPropagation()

        const rect = canvasRef.current!.getBoundingClientRect()

        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }

        setStartPoint(point)
        setCurrentPoint(point)
        setIsDragging(true)
    }

    function handlePointerMove(e: React.MouseEvent<HTMLCanvasElement>) {
        e.preventDefault()
        e.stopPropagation()

        if (!isDragging || !startPoint) return

        const rect = canvasRef.current!.getBoundingClientRect()

        const point = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        }

        setCurrentPoint(point)
        drawRect(startPoint, point)
    }
    function handlePointerUp(e: React.MouseEvent<HTMLCanvasElement>) {
        e.preventDefault()
        e.stopPropagation()

        const canvas = canvasRef.current
        if (canvas) {
            canvas.releasePointerCapture(e.pointerId)
        }

        setIsDragging(false)

        if (!startPoint || !currentPoint) return


        const rect = {
            x1: startPoint.x,
            y1: startPoint.y,
            x2: currentPoint.x,
            y2: currentPoint.y,
        }

        setFinalRect(rect)
        onSave(rect)
    }

    function drawRect(p1: { x: number; y: number }, p2: { x: number; y: number }) {
        const canvas = canvasRef.current
        const ctx = canvas?.getContext("2d")
        if (!canvas || !ctx) return

        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const x = Math.min(p1.x, p2.x)
        const y = Math.min(p1.y, p2.y)
        const w = Math.abs(p2.x - p1.x)
        const h = Math.abs(p2.y - p1.y)

        ctx.strokeStyle = "red"
        ctx.lineWidth = 2
        ctx.strokeRect(x, y, w, h)
    }

    // function reset() {
    //     setPoints([])
    //     const ctx = canvasRef.current?.getContext("2d")
    //     ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
    // }

    // function save() {
    //     if (points.length !== 2) return

    //     onSave({
    //         x1: points[0].x,
    //         y1: points[0].y,
    //         x2: points[1].x,
    //         y2: points[1].y,
    //     })
    // }

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
                    onClick={() => setDrawing(!drawing)}
                    color="secondary"
                    iconLeading={PenLine}
                />

                <Button
                    // onClick={reset}
                    color="secondary"
                    iconLeading={Trash}
                />

                <Button
                    // onClick={save}
                    iconLeading={Save}
                >
                    Guardar
                </Button>
            </div>
        </div>
    )
}