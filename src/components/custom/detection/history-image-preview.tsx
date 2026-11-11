"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Maximize2, Scan, X } from "lucide-react"
import type { DetectionImage, ListObjects } from "@/types"
import { Button } from "@/components/base/buttons/button"
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal"

function AnnotatedImage({ image, selectedObjectId, objectNumbers, showArea, showCenters, expanded = false, onSelectObject }: {
    image: DetectionImage
    selectedObjectId: string | null
    objectNumbers: Readonly<Record<string, number>>
    showArea: boolean
    showCenters: boolean
    expanded?: boolean
    onSelectObject: (objectId: string) => void
}) {
    const [size, setSize] = useState<{ width: number; height: number } | null>(null)
    const [failed, setFailed] = useState(false)
    if (failed) return <p className="p-6 text-center text-sm text-tertiary" role="status">Unable to load the saved image.</p>
    // Draw the selected box last so overlapping boxes cannot hide it.
    const objects = [...image.objects].sort((a, b) => Number(a.id === selectedObjectId) - Number(b.id === selectedObjectId))
    return (
        <div className={`flex items-center justify-center rounded-lg bg-secondary p-3 ${expanded ? "h-full min-h-0 w-full" : "min-h-40"}`}>
            <div className={`relative max-w-full ${expanded ? "h-full w-full" : ""}`}>
                {/* Native dimensions keep boxes aligned at every display size. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src={image.image_url}
                    alt={image.frame_number === null ? "Saved detection photo" : `Saved detection frame ${image.frame_number}`}
                    className={expanded ? "absolute inset-0 h-full w-full object-contain" : "block h-auto w-auto max-h-[38dvh] max-w-full"}
                    onLoad={event => setSize({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
                    onError={() => setFailed(true)}
                />
                {size && <svg
                    className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                    preserveAspectRatio="xMidYMid meet"
                    viewBox={`0 0 ${size.width} ${size.height}`}
                    aria-label="Detection annotations"
                    role="group"
                >
                    {image.line && (() => {
                        const line = image.line
                        const dx = line.x2 - line.x1, dy = line.y2 - line.y1
                        const length = Math.hypot(dx, dy)
                        const fontSize = Math.max(14, size.width / 50)
                        const offset = fontSize * 1.5
                        return <g aria-label="Counting line">
                            <line x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                                stroke="#a78bfa" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                            {length > 0 && [-1, 1].map(sign => <text key={sign}
                                x={(line.x1 + line.x2) / 2 - sign * dy / length * offset}
                                y={(line.y1 + line.y2) / 2 + sign * dx / length * offset}
                                fill="#a78bfa" stroke="#000" strokeWidth="2" paintOrder="stroke"
                                fontSize={fontSize} fontWeight="700" textAnchor="middle" dominantBaseline="middle">
                                {sign < 0 ? "A" : "B"}
                            </text>)}
                        </g>
                    })()}

                    {showArea && image.area && <rect
                        x={image.area.x1} y={image.area.y1}
                        width={Math.max(0, image.area.x2 - image.area.x1)}
                        height={Math.max(0, image.area.y2 - image.area.y1)}
                        stroke="#a78bfa" strokeWidth="2" strokeDasharray="8 5"
                        fill="#a78bfa1a" vectorEffect="non-scaling-stroke"
                        aria-label="Detection area"
                    ><title>Detection area</title></rect>}

                    {objects.map(object => {

                        const box = object.bbox
                        if (!box || ![box.x1, box.y1, box.x2, box.y2].every(Number.isFinite)) return null

                        const selected = object.id === selectedObjectId
                        const label = `${objectNumbers[object.id] ? `#${objectNumbers[object.id]} · ` : ""}${object.obj_name}`
                        const color = selected ? "#fbbf24" : "#22d3ee"
                        const centerX = (box.x1 + box.x2) / 2
                        const centerY = (box.y1 + box.y2) / 2
                        const centerRadius = Math.max(5, size.width / 120)
                        const isCrossingObject = image.crossings?.some(event => event.object_id === object.id)

                        return <g
                            key={object.id}
                            opacity={selectedObjectId && !selected ? 0.3 : 1}
                            className="pointer-events-auto cursor-pointer outline-none focus-visible:outline-none"
                            role="button"
                            tabIndex={0}
                            aria-label={`Select ${label}`}
                            aria-pressed={selected}
                            onClick={event => {
                                event.stopPropagation()
                                onSelectObject(object.id)
                            }}
                            onKeyDown={event => {
                                if (event.key === "Enter" || event.key === " ") {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    onSelectObject(object.id)
                                }
                            }}
                        >

                            <title>{`${label}${selected ? " (selected)" : ""}`}</title>

                            <rect
                                x={box.x1} y={box.y1}
                                width={Math.max(0, box.x2 - box.x1)} height={Math.max(0, box.y2 - box.y1)}
                                stroke={color} strokeWidth={selected ? 4 : 2}
                                fill={selected ? "#fbbf2426" : "none"}
                                vectorEffect="non-scaling-stroke"
                                pointerEvents="all"
                            />

                            <text x={box.x1 > size.width * 0.6 ? Math.min(size.width, box.x2) : Math.max(0, box.x1)}
                                textAnchor={box.x1 > size.width * 0.6 ? "end" : "start"}
                                y={Math.max(size.height / 30, box.y1 - size.height / 100)}
                                fontSize={Math.max(size.width / 40, size.height / 30)} fontWeight="600"
                                fill={color} stroke="#111827" strokeWidth="3" paintOrder="stroke" strokeLinejoin="round">
                                {label}
                            </text>

                            {showCenters && isCrossingObject && <g aria-label={`${label} bounding-box center`}>
                                <title>Bounding-box center used for line crossing</title>
                                <circle cx={centerX} cy={centerY} r={centerRadius * 1.8}
                                    fill="none" stroke="#111827" strokeWidth="4" vectorEffect="non-scaling-stroke" />
                                <circle cx={centerX} cy={centerY} r={centerRadius * 1.8}
                                    fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
                                <circle cx={centerX} cy={centerY} r={centerRadius}
                                    fill={color} stroke="#111827" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                            </g>}
                        </g>
                    })}
                </svg>}
            </div>
        </div>
    )
}

export function HistoryImagePreview({ image, selectedObject, type, isLoading, error, onClearSelection, selectedObjectIndex, objectCount, onNavigateObject, objectNumbers, showCenters = false, onSelectObject }: {
    image: DetectionImage | null
    selectedObject: ListObjects | null
    objectNumbers: Readonly<Record<string, number>>
    showCenters?: boolean
    type: "photo" | "video" | "stream"
    isLoading: boolean
    error: boolean
    onClearSelection: () => void
    selectedObjectIndex: number
    objectCount: number
    onNavigateObject: (direction: -1 | 1) => void
    onSelectObject: (objectId: string) => void
}) {

    const [expanded, setExpanded] = useState(false)
    const [showArea, setShowArea] = useState(true)
    const title = type === "photo" ? "Detection photo" : "Detection frame"
    const canGoBack = selectedObjectIndex > 0
    const canGoForward = selectedObjectIndex + 1 < objectCount

    const areaToggle = image?.area ? <Button color="secondary" size="sm"
        iconLeading={<Scan size={16} />} aria-pressed={showArea}
        onClick={() => setShowArea(value => !value)}>
        {showArea ? "Hide area" : "Show area"}
    </Button> : null

    return (
        <section className="mb-5 border-b border-secondary pb-5" aria-label={title}>

            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-primary">{title}</h3>
                <div className="flex items-center gap-2">
                    {areaToggle}
                    {image && <Button color="secondary" size="sm" iconLeading={<Maximize2 size={16} />} onClick={() => setExpanded(true)}>Enlarge</Button>}
                </div>

            </div>

            {isLoading ? <p className="py-8 text-center text-sm text-tertiary" role="status">Loading saved images...</p>
                : error ? <p className="py-8 text-center text-sm text-tertiary" role="alert">Failed to load saved images.</p>
                    : image ? <AnnotatedImage key={image.image_url} image={image} selectedObjectId={selectedObject?.id ?? null} objectNumbers={objectNumbers} showArea={showArea} showCenters={showCenters} onSelectObject={onSelectObject} />
                        : <p className="py-8 text-center text-sm text-tertiary" role="status">{selectedObject ? "No saved image is available for this object." : "No saved images available."}</p>}

            {image && type !== "photo" &&
                <p className="mt-2 text-xs text-tertiary">
                    Frame {image.frame_number ?? "—"}{image.timestamp_ms !== null && ` · ${(image.timestamp_ms / 1000).toFixed(2)} s`}
                    {" · "}{image.crossings?.length ? `Line passages: ${image.crossings.length}` : "First detections saved in this frame"}
                </p>
            }

            {image && showCenters && <p className="mt-2 text-xs text-tertiary">Dots mark the bounding-box centers used to count passages. The selected object's center is yellow.</p>}

            {selectedObject ?
                <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-sm text-secondary" aria-live="polite">Selected: <span className="font-semibold">#{objectNumbers[selectedObject.id]} · {selectedObject.obj_name}</span></p>
                    <Button color="tertiary" size="sm" onClick={onClearSelection}>Clear</Button>
                </div> : <p className="mt-3 text-xs text-tertiary">Select an object in the table to highlight it{type === "photo" ? "." : " in its saved frame."}</p>
            }

            {expanded && <ModalOverlay isOpen onOpenChange={setExpanded}>
                <Modal className="h-[calc(100dvh-4rem)] w-full max-w-[calc(100vw-2rem)] overflow-hidden max-sm:overflow-hidden">
                    <Dialog aria-label="Enlarged detection image" className="h-full max-h-full overflow-hidden p-3 sm:p-4">
                        <div className="flex h-full min-h-0 flex-col gap-3"
                            onKeyDown={event => {
                                if (event.altKey || event.ctrlKey || event.metaKey) return
                                if (event.key === "ArrowLeft" && canGoBack) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    onNavigateObject(-1)
                                } else if (event.key === "ArrowRight" && canGoForward) {
                                    event.preventDefault()
                                    event.stopPropagation()
                                    onNavigateObject(1)
                                }
                            }}>

                            <div className="flex shrink-0 items-center justify-between gap-2">
                                <h3 className="min-w-0 truncate font-semibold text-primary">{title}{selectedObject ? ` · #${objectNumbers[selectedObject.id]} ${selectedObject.obj_name}` : ""}</h3>
                                <div className="flex shrink-0 items-center gap-2">
                                    {areaToggle}
                                    <Button color="secondary" size="sm" iconLeading={<X size={18} />} aria-label="Close enlarged image" onClick={() => setExpanded(false)} />
                                </div>
                            </div>

                            <div className="min-h-0 flex-1">
                                {image ? <AnnotatedImage key={image.image_url} image={image} selectedObjectId={selectedObject?.id ?? null} objectNumbers={objectNumbers} showArea={showArea} showCenters={showCenters} expanded onSelectObject={onSelectObject} />
                                    : <p className="py-16 text-center text-sm text-tertiary" role="status">No saved image is available for this object.</p>}
                            </div>

                            <div className="flex shrink-0 items-center justify-between gap-3 border-t border-secondary pt-3">
                                <Button color="secondary" size="sm" iconLeading={<ChevronLeft size={18} />}
                                    aria-label="Previous object" isDisabled={!canGoBack} onClick={() => onNavigateObject(-1)}>Previous</Button>
                                <div className="text-center text-sm text-secondary" aria-live="polite">
                                    <p>{selectedObjectIndex >= 0 ? `Object ${selectedObjectIndex + 1} of ${objectCount}` : `${objectCount} objects · Select an object`}</p>
                                    {image && type !== "photo" && <p className="text-xs text-tertiary">Frame {image.frame_number ?? "—"}
                                        {image.timestamp_ms !== null && ` · ${(image.timestamp_ms / 1000).toFixed(2)} s`}</p>}
                                </div>
                                <Button color="secondary" size="sm" iconTrailing={<ChevronRight size={18} />}
                                    aria-label="Next object" isDisabled={!canGoForward} onClick={() => onNavigateObject(1)}>Next</Button>
                            </div>

                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>}
        </section>
    )
}
