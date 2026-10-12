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
    videoStream?: MediaStream | null;
    streamUrl?: string;
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
    videoStream = null,
    streamUrl = "",
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
    const videoRef = useRef<HTMLVideoElement>(null);
    const dragRef = useRef<Drag | null>(null);
    const isLive = !!videoStream || !!streamUrl;
    const [videoReady, setVideoReady] = useState(false);
    const sourceReady = isLive ? videoReady : !!imageUrl;

    useEffect(() => {
        const video = videoRef.current;
        if (!isLive || !video) return;
        setVideoReady(false);
        if (videoStream) video.srcObject = videoStream;
        else video.src = streamUrl;
        video.play().catch((error) => console.error("Failed to play drawing preview:", error));
        return () => {
            video.pause();
            video.srcObject = null;
            video.removeAttribute("src");
            video.load();
        };
    }, [isLive, videoStream, streamUrl]);

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
        const source = isLive ? videoRef.current : imageRef.current;
        const canvas = canvasRef.current;
        if (!source || !canvas) return;

        const handleLoad = () => {
            const width = source instanceof HTMLVideoElement ? source.videoWidth : source.naturalWidth;
            const height = source instanceof HTMLVideoElement ? source.videoHeight : source.naturalHeight;
            if (!width || !height) return;
            canvas.width = width;
            canvas.height = height;
            const bounds = source.getBoundingClientRect();
            const scale = Math.min(
                bounds.width / width,
                bounds.height / height,
            );
            canvas.style.width = `${width * scale}px`;
            canvas.style.height = `${height * scale}px`;
            redraw(dragRef.current);
        };

        const observer = new ResizeObserver(handleLoad);
        observer.observe(source);
        source.addEventListener("load", handleLoad);
        source.addEventListener("loadedmetadata", handleLoad);
        source.addEventListener("resize", handleLoad);
        handleLoad();
        return () => {
            observer.disconnect();
            source.removeEventListener("load", handleLoad);
            source.removeEventListener("loadedmetadata", handleLoad);
            source.removeEventListener("resize", handleLoad);
        };
    }, [imageUrl, isLive, videoStream, streamUrl, redraw]);

    function getPoint(e: PointerEvent<HTMLCanvasElement>): Point | null {
        const canvas = e.currentTarget;
        const rect = canvas.getBoundingClientRect();
        if (!rect.width || !rect.height || !sourceReady)
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
            className="relative w-full h-full flex items-center justify-center p-4 sm:p-6"
            onPointerDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
        >
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden">
                {isLive ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        aria-label="Live stream for drawing an area or line"
                        className="block h-full w-full object-contain"
                        onLoadedMetadata={() => setVideoReady(true)}
                        onEmptied={() => setVideoReady(false)}
                        onError={() => setVideoReady(false)}
                    />
                ) : (
                    <img
                        ref={imageRef}
                        src={imageUrl ?? undefined}
                        className="block h-full w-full object-contain"
                        alt={
                            allowLine
                                ? "Image for drawing an area or line"
                                : "Image for drawing an area"
                        }
                        draggable={false}
                    />
                )}
                <canvas
                    ref={canvasRef}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={cancelDraw}
                    onLostPointerCapture={cancelDraw}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-crosshair touch-none"
                />
            </div>

            {!isDragging && (
                <div className="absolute bottom-4 mx-4 flex max-w-[calc(100%-2rem)] flex-wrap items-center justify-center gap-3 rounded-xl bg-primary p-3 shadow-lg">
                    {allowLine && (
                        <ButtonGroup
                            size="sm"
                            disallowEmptySelection
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
                                className="h-9 w-12 cursor-pointer rounded-lg border border-secondary bg-primary p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </label>
                    )}
                    <Button
                        onClick={() => onSave(finalRect, allowLine ? finalLine : null, { areaColor, lineColor })}
                        iconLeading={Save}
                        size="md"
                        isDisabled={!sourceReady}
                    >
                        {allowLine ? "Save" : "Save Area"}
                    </Button>
                    <Button
                        color="secondary-destructive"
                        onClick={clear}
                        iconLeading={Eraser}
                        isDisabled={!sourceReady}
                        size="md"
                    >
                        Clear All
                    </Button>
                </div>
            )}
        </div>
    );
}
