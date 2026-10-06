"use client";

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type PointerEvent,
} from "react";
import { Eraser, Save, Scan, Minus } from "lucide-react";
import { Button } from "@/components/base/buttons/button";
import {
    ButtonGroup,
    ButtonGroupItem,
} from "@/components/base/button-group/button-group";
import type { Area, DrawingColors, Line } from "@/types";
import { DEFAULT_AREA_LINE_COLORS } from "@/config/drawing";

type DrawType = "area" | "line";
type Point = { x: number; y: number };
type Drag = { pointerId: number; type: DrawType; start: Point; current: Point };

interface Props {
    imageUrl: string | null;
    area: Area | null;
    line?: Line | null;
    allowLine?: boolean;
    colors?: DrawingColors;
    onSave: (area: Area | null, line: Line | null, colors: DrawingColors) => void;
}

function getDrawing(type: DrawType, start: Point, end: Point): Area | Line {
    if (type === "area") {
        return {
            x1: Math.round(Math.min(start.x, end.x)),
            y1: Math.round(Math.min(start.y, end.y)),
            x2: Math.round(Math.max(start.x, end.x)),
            y2: Math.round(Math.max(start.y, end.y)),
        };
    }

    return {
        x1: Math.round(start.x),
        y1: Math.round(start.y),
        x2: Math.round(end.x),
        y2: Math.round(end.y),
    };
}

export function DrawAreaModal({
    imageUrl,
    area,
    line = null,
    allowLine = true,
    colors = DEFAULT_AREA_LINE_COLORS,
    onSave,
}: Props) {
    const [selectedTypeOfDraw, setSelectedTypeOfDraw] =
        useState<DrawType>("area");
    const [finalRect, setFinalRect] = useState<Area | null>(area);
    const [finalLine, setFinalLine] = useState<Line | null>(line);
    const [areaColor, setAreaColor] = useState(colors.areaColor);
    const [lineColor, setLineColor] = useState(colors.lineColor);
    const [isDragging, setIsDragging] = useState(false);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);
    const dragRef = useRef<Drag | null>(null);

    const redraw = useCallback(
        (preview: Drag | null = null) => {
            const canvas = canvasRef.current;
            const ctx = canvas?.getContext("2d");
            if (!canvas || !ctx) return;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.lineWidth = 2;

            const rect =
                preview?.type === "area"
                    ? getDrawing("area", preview.start, preview.current)
                    : finalRect;
            const segment =
                preview?.type === "line"
                    ? getDrawing("line", preview.start, preview.current)
                    : finalLine;

            if (rect) {
                ctx.strokeStyle = areaColor;
                ctx.strokeRect(rect.x1, rect.y1, rect.x2 - rect.x1, rect.y2 - rect.y1);
            }
            if (allowLine && segment) {
                ctx.strokeStyle = lineColor;
                ctx.beginPath();
                ctx.moveTo(segment.x1, segment.y1);
                ctx.lineTo(segment.x2, segment.y2);
                ctx.stroke();
            }
        },
        [finalRect, finalLine, allowLine, areaColor, lineColor],
    );

    useEffect(() => {
        const img = imageRef.current;
        const canvas = canvasRef.current;
        if (!imageUrl || !img || !canvas) return;

        const handleLoad = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            redraw(dragRef.current);
        };

        img.addEventListener("load", handleLoad);
        if (img.complete && img.naturalWidth > 0) handleLoad();
        return () => img.removeEventListener("load", handleLoad);
    }, [imageUrl, redraw]);

    function getPoint(e: PointerEvent<HTMLCanvasElement>): Point | null {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height || !imageRef.current?.naturalWidth)
            return null;

        return {
            x: Math.max(
                0,
                Math.min(
                    canvas.width,
                    ((e.clientX - rect.left) * canvas.width) / rect.width,
                ),
            ),
            y: Math.max(
                0,
                Math.min(
                    canvas.height,
                    ((e.clientY - rect.top) * canvas.height) / rect.height,
                ),
            ),
        };
    }

    function handlePointerDown(e: PointerEvent<HTMLCanvasElement>) {
        e.preventDefault();
        e.stopPropagation();
        if (e.button !== 0 || dragRef.current) return;
        const point = getPoint(e);
        if (!point) return;

        e.currentTarget.setPointerCapture(e.pointerId);
        const drag: Drag = {
            pointerId: e.pointerId,
            type: allowLine ? selectedTypeOfDraw : "area",
            start: point,
            current: point,
        };
        dragRef.current = drag;
        setIsDragging(true);
        redraw(drag);
    }

    function handlePointerMove(e: PointerEvent<HTMLCanvasElement>) {
        e.preventDefault();
        e.stopPropagation();
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== e.pointerId) return;
        const point = getPoint(e);
        if (!point) return;

        drag.current = point;
        redraw(drag);
    }

    function handlePointerUp(e: PointerEvent<HTMLCanvasElement>) {
        e.preventDefault();
        e.stopPropagation();
        const drag = dragRef.current;
        if (!drag || drag.pointerId !== e.pointerId) return;
        const drawing = getDrawing(
            drag.type,
            drag.start,
            getPoint(e) ?? drag.current,
        );
        const valid =
            drag.type === "area"
                ? drawing.x1 !== drawing.x2 && drawing.y1 !== drawing.y2
                : drawing.x1 !== drawing.x2 || drawing.y1 !== drawing.y2;

        dragRef.current = null;
        setIsDragging(false);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
        if (valid) {
            if (drag.type === "area") setFinalRect(drawing);
            else setFinalLine(drawing);
        } else {
            redraw();
        }
    }

    function cancelDraw(e: PointerEvent<HTMLCanvasElement>) {
        if (dragRef.current?.pointerId !== e.pointerId) return;
        dragRef.current = null;
        setIsDragging(false);
        redraw();
    }

    function clear() {
        dragRef.current = null;
        setIsDragging(false);
        setFinalRect(null);
        setFinalLine(null);
    }

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
                    src={imageUrl ?? undefined}
                    className="max-h-[90vh] max-w-[90vw] object-contain block"
                    alt={
                        allowLine
                            ? "Image for drawing an area or line"
                            : "Image for drawing an area"
                    }
                    draggable={false}
                />
                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={cancelDraw}
                    onLostPointerCapture={cancelDraw}
                    className="absolute inset-0 w-full h-full cursor-crosshair touch-none"
                />
            </div>
            <div className="absolute bottom-4 mx-4 flex max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-3 rounded-xl bg-primary p-3 shadow-lg">
                {allowLine && (
                    <ButtonGroup
                        size="sm"
                        disallowEmptySelection
                        isDisabled={isDragging}
                        selectedKeys={[selectedTypeOfDraw]}
                        onSelectionChange={(keys) => {
                            const selected = Array.from(keys)[0];
                            if (selected === "area" || selected === "line")
                                setSelectedTypeOfDraw(selected);
                        }}
                    >
                        <ButtonGroupItem id="area" iconLeading={<Scan />}>
                            Area
                        </ButtonGroupItem>
                        <ButtonGroupItem id="line" iconLeading={<Minus />}>
                            Line
                        </ButtonGroupItem>
                    </ButtonGroup>
                )}
                <label className="flex items-center gap-2 text-sm font-medium text-secondary">
                    Area color
                    <input
                        type="color"
                        value={areaColor}
                        onChange={(event) => setAreaColor(event.target.value)}
                        disabled={isDragging}
                        className="h-9 w-12 cursor-pointer rounded-lg border border-secondary bg-primary p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </label>
                {allowLine && (
                    <label className="flex items-center gap-2 text-sm font-medium text-secondary">
                        Line color
                        <input
                            type="color"
                            value={lineColor}
                            onChange={(event) => setLineColor(event.target.value)}
                            disabled={isDragging}
                            className="h-9 w-12 cursor-pointer rounded-lg border border-secondary bg-primary p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </label>
                )}
                <Button
                    onClick={() => onSave(finalRect, allowLine ? finalLine : null, { areaColor, lineColor })}
                    iconLeading={Save}
                    size="md"
                    isDisabled={isDragging || !imageUrl}
                >
                    {allowLine ? "Save" : "Save Area"}
                </Button>
                <Button
                    color="secondary-destructive"
                    onClick={clear}
                    iconLeading={Eraser}
                    size="md"
                >
                    Clear All
                </Button>
            </div>
        </div>
    );
}
