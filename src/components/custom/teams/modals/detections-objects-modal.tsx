"use client"

import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal"
import { TableCard } from "@/components/application/table/table"
import { Badge } from "@/components/base/badges/badges"
import { Button } from "@/components/base/buttons/button"

import { useDetectionObjects } from "@/hooks/use-detections-objects"
import { useDetectionImages } from "@/hooks/use-detection-images"
import { HistoryImagePreview } from "../../detection/history-image-preview"
import { selectDetectionImage } from "@/utils/select-detection-image"
import { createObjectNumbers } from "@/utils/object-numbers"
import { ListDetection, type ListObjects, type LineCrossing } from "@/types"
import { ChevronLeft, ChevronRight, Trash, X } from "lucide-react"
import { NotFoundTable } from "../../not-found-table"
import { MultiSelect } from "@/components/base/select/multi-select"
import { ExtractSingleReportModal } from "../../detection/extract-single-report-modal"
import { useEffect, useMemo, useState } from "react"
import { ObjectsTable } from "../../detection/tables/objects-table"
import { DeleteDetectionConfirmationModal } from "../../detection/delete-detection-confirmation-modal"

type DetectionObjectsModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;

    detection: ListDetection;

}

export function DetectionObjectsModal({
    isOpen,
    onOpenChange,
    detection,
}: DetectionObjectsModalProps) {

    const [isExtractOpen, setIsExtractOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [selection, setSelection] = useState<{ detectionId: string; objectId: string } | null>(null)
    const imagesQuery = useDetectionImages(detection.id, isOpen)
    const [tableMode, setTableMode] = useState<"objects" | "crossings">("objects")
    const [selectedCrossingId, setSelectedCrossingId] = useState<string | null>(null)

    useEffect(() => {
        if (!isOpen) {
            setSelection(null)
            setSelectedCrossingId(null)
            setTableMode("objects")
        }
    }, [isOpen])

    const {
        objects,
        paginatedObjects,
        filteredObjects,
        sortedObjects,
        itemsPerPage,

        classes,
        selectedClasses,
        setSelectedClasses,

        sortDescriptor,
        setSortDescriptor,

        currentPage,
        setCurrentPage,
        totalPages,

        isLoading,
        error,
    } = useDetectionObjects(detection.id, isOpen)

    // Only highlight objects that are present on the visible table page.
    const allCrossings = (imagesQuery.data ?? []).flatMap(image => image.crossings ?? [])
        .sort((a, b) => a.frame_number - b.frame_number || a.track_id - b.track_id)
    const crossings = allCrossings.filter(event => selectedClasses === null || selectedClasses.has(event.obj_class_id))
    const crossingAsObject = (event: LineCrossing): ListObjects => ({ ...event, id: event.object_id })
    const selectedCrossing = tableMode === "crossings" ? crossings.find(event => event.id === selectedCrossingId) : null
    const selectedObject = selectedCrossing ? crossingAsObject(selectedCrossing) : tableMode === "objects" && selection?.detectionId === detection.id
        ? paginatedObjects.find(object => object.id === selection.objectId) ?? null : null
    const savedImage = selectDetectionImage(imagesQuery.data ?? [], selectedObject)
    const selectedImage = savedImage && selectedCrossing ? { ...savedImage,
        objects: [...new Map([...savedImage.objects, ...(savedImage.crossings ?? []).map(crossingAsObject)]
            .map(object => [object.id, object])).values()] } : savedImage
    const objectNumbers = useMemo(() => createObjectNumbers(objects), [objects])
    const selectedObjectIndex = tableMode === "crossings" ? crossings.findIndex(event => event.id === selectedCrossingId)
        : selectedObject ? sortedObjects.findIndex(object => object.id === selectedObject.id) : -1
    const tablePages = tableMode === "crossings" ? Math.ceil(crossings.length / itemsPerPage) : totalPages
    const displayPage = Math.min(currentPage, Math.max(1, tablePages))
    const navigateObject = (direction: -1 | 1) => {
        const nextIndex = selectedObjectIndex + direction
        if (tableMode === "crossings") {
            const nextCrossing = crossings[nextIndex]
            if (!nextCrossing) return
            setSelectedCrossingId(nextCrossing.id)
            setCurrentPage(Math.floor(nextIndex / itemsPerPage) + 1)
            return
        }
        const nextObject = sortedObjects[nextIndex]
        if (!nextObject) return
        setSelection({ detectionId: detection.id, objectId: nextObject.id })
        // Keep the selected table row visible when navigation crosses a page boundary.
        setCurrentPage(Math.floor(nextIndex / itemsPerPage) + 1)
    }

    const averageConfidence =
        objects.length > 0
            ? objects.reduce((sum, object) => sum + object.confidence, 0) / objects.length
            : 0

    const classSummary = Object.values(
        objects.reduce<Record<
            number,
            {
                id: number
                name: string
                count: number
                confidenceSum: number
            }
        >>((acc, object) => {
            const classId = object.obj_class_id
            const className = object.obj_name

            if (!acc[classId]) {
                acc[classId] = {
                    id: classId,
                    name: className,
                    count: 0,
                    confidenceSum: 0,
                }
            }

            acc[classId].count += 1
            acc[classId].confidenceSum += object.confidence

            return acc
        }, {})
    ).map((item) => ({
        ...item,
        averageConfidence:
            item.confidenceSum / item.count,
    }))

    const detectedClasses = classSummary.map((item) => ({
        id: String(item.id),
        label: item.name,
    }))

    const selectedClassCount =
        selectedClasses === null
            ? detectedClasses.length
            : selectedClasses.size


    return (
        <>
            <ModalOverlay
                isOpen={isOpen}
                onOpenChange={onOpenChange}
            >

                <Modal className="w-full max-w-7xl overflow-hidden">
                    <Dialog
                        className="flex min-h-0 flex-col gap-4 overflow-y-auto p-4 sm:h-[85dvh] sm:p-6 lg:overflow-hidden"
                        aria-label="objects"
                    >
                        <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


                            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-2 break-words text-sm text-tertiary sm:justify-center">
                                {detection.username && <span>User: <span className="font-medium text-secondary">{detection.username}</span></span>}
                                {detection.team_name && <span>Team: <span className="font-medium text-secondary">{detection.team_name}</span></span>}
                                <span>
                                    Created:
                                    <span className="font-medium text-secondary"> {new Date(detection.created_at).toLocaleString()}</span>
                                </span>
                                <span>
                                    Model:
                                    <span className="font-medium text-secondary"> {detection.model}</span>
                                </span>
                                <span>
                                    Processing Time:{" "}
                                    <span className="font-medium text-secondary">
                                        {detection.processing_time_ms < 1000
                                            ? `${detection.processing_time_ms.toFixed(2)} ms`
                                            : detection.processing_time_ms < 60000
                                                ? `${(detection.processing_time_ms / 1000).toFixed(2)} s`
                                                : `${(detection.processing_time_ms / 60000).toFixed(2)} min`
                                        }
                                    </span>
                                </span>
                                <span>
                                    Type:
                                    <span className="font-medium text-secondary"> {detection.type}</span>
                                </span>
                                <span>
                                    Threshold:
                                    <span className="font-medium text-secondary"> {(detection.conf_threshold * 100).toFixed(1)}%</span>
                                </span>
                            </div>

                            <div className="flex items-center gap-2 [&>button:first-child]:flex-1 sm:gap-3 sm:[&>button:first-child]:flex-none">
                                <Button
                                    size="md"
                                    onClick={() => {
                                        setIsExtractOpen(true)
                                    }}
                                >
                                    Extract Report
                                </Button>

                                <Button
                                    color="secondary-destructive"
                                    size="md"
                                    aria-label="Delete detection"
                                    onClick={() => {
                                        setIsDeleteOpen(true)
                                    }}
                                    iconLeading = {<Trash size={20}/>}
                                />

                                <Button
                                    color="secondary"
                                    size="md"
                                    onClick={() => onOpenChange(false)}
                                    aria-label="Close"
                                    iconLeading={<X size={20} />}
                                />

                            </div>
                        </div>

                        <div className="grid flex-none grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-[minmax(0,1fr)] lg:gap-6 lg:overflow-hidden">
                            {/* Image preview and summary */}
                            <div className="min-w-0 rounded-lg border border-secondary bg-primary p-4 lg:min-h-0 lg:overflow-y-auto">
                                <HistoryImagePreview
                                    key={detection.id}
                                    image={selectedImage}
                                    showCenters={tableMode === "crossings"}
                                    selectedObject={selectedObject}
                                    objectNumbers={objectNumbers}
                                    type={detection.type}
                                    isLoading={imagesQuery.isLoading}
                                    error={imagesQuery.isError}
                                    onClearSelection={() => { setSelection(null); setSelectedCrossingId(null) }}
                                    selectedObjectIndex={selectedObjectIndex}
                                    objectCount={tableMode === "crossings" ? crossings.length : sortedObjects.length}
                                    onNavigateObject={navigateObject}
                                />
                                <h3 className="text-sm font-semibold text-primary">
                                    Detection Summary
                                </h3>

                                <p className="mt-1 text-sm text-tertiary">
                                    Overview of the detected objects
                                </p>

                                <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    {/* Total */}
                                    <div className="rounded-lg border border-secondary p-3">
                                        <p className="text-xs text-tertiary">
                                            Total Objects
                                        </p>

                                        <p className="mt-1 text-xl font-semibold text-primary">
                                            {detection.count}
                                        </p>
                                    </div>

                                    {/* Average confidence */}
                                    <div className="rounded-lg border border-secondary p-3">
                                        <p className="text-xs text-tertiary">
                                            Avg. Confidence
                                        </p>

                                        <p className="mt-1 text-xl font-semibold text-primary">
                                            {(averageConfidence * 100).toFixed(1)}%
                                        </p>
                                    </div>

                                    {/* Classes */}
                                    <div className="rounded-lg border border-secondary p-3">
                                        <p className="text-xs text-tertiary">
                                            Classes
                                        </p>

                                        <p className="mt-1 text-xl font-semibold text-primary">
                                            {classes.length}
                                        </p>
                                    </div>
                                </div>

                                {/* Objects by class */}
                                <div className="mt-6">

                                    <div className="mb-3 flex items-center justify-between">
                                        <h4 className="text-sm font-medium text-primary">
                                            Objects by Class
                                        </h4>

                                        <span className="text-xs text-tertiary">
                                            {classSummary.length} classes
                                        </span>
                                    </div>

                                    <div className="divide-y divide-secondary rounded-lg border border-secondary">

                                        {classSummary
                                            .sort((a, b) => b.count - a.count)
                                            .map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between gap-3 p-3"
                                                >
                                                    <div className="min-w-0">

                                                        <p className="truncate text-sm font-medium text-primary">
                                                            {item.name}
                                                        </p>

                                                        <p className="text-xs text-tertiary">
                                                            Avg. confidence{" "}
                                                            {(item.averageConfidence * 100).toFixed(1)}%
                                                        </p>

                                                    </div>

                                                    <Badge
                                                        color="gray"
                                                        size="sm"
                                                    >
                                                        {item.count}
                                                    </Badge>

                                                </div>
                                            ))}

                                        {classSummary.length === 0 && (
                                            <div className="p-4 text-center text-sm text-tertiary">
                                                No objects detected
                                            </div>
                                        )}

                                    </div>
                                </div>
                            </div>

                            {/* Object selection table */}
                            <TableCard.Root
                                size="sm"
                                className="flex min-w-0 flex-col overflow-hidden lg:h-full lg:min-h-0"
                            >
                                <TableCard.Header
                                    className="shrink-0"
                                    title={tableMode === "objects" ? "Objects Detected" : "Line passages"}
                                    badge={tableMode === "objects" ? filteredObjects.length : crossings.length}
                                    description="Select an object to highlight it in the image."
                                />
                                {(imagesQuery.data ?? []).some(image => image.line) && <div className="shrink-0 border-b border-secondary px-4 py-3">
                                    <div className="flex gap-2">
                                        <Button size="sm" color={tableMode === "objects" ? "secondary" : "tertiary"} onClick={() => { setTableMode("objects"); setCurrentPage(1) }}>Objects</Button>
                                        <Button size="sm" color={tableMode === "crossings" ? "secondary" : "tertiary"} onClick={() => { setTableMode("crossings"); setCurrentPage(1) }}>Passages</Button>
                                    </div>
                                    <p className="mt-2 text-xs text-tertiary">Total: {allCrossings.length} · A → B: {allCrossings.filter(event => event.direction === "A_to_B").length} · B → A: {allCrossings.filter(event => event.direction === "B_to_A").length}</p>
                                </div>}
                                <div className="shrink-0 border-b border-secondary px-4 py-3">
                                        <MultiSelect
                                            size="sm"
                                            placeholder="Select classes"
                                            className="w-full"
                                            items={detectedClasses}
                                            selectedKeys={
                                                selectedClasses === null
                                                    ? new Set(detectedClasses.map((item) => item.id))
                                                    : new Set([...selectedClasses].map(String))
                                            }
                                            onSelectionChange={(keys) => {
                                                if (keys === "all") {
                                                    setSelectedClasses(null)
                                                    return
                                                }

                                                const values = new Set(
                                                    [...keys].map(Number)
                                                )

                                                setSelectedClasses(values)
                                            }}
                                            supportingText={`${selectedClassCount} classes`}
                                            onReset={() => setSelectedClasses(new Set())}
                                            onSelectAll={() => setSelectedClasses(null)}
                                        >
                                            {(item) => (
                                                <MultiSelect.Item
                                                    id={item.id}
                                                    selectionIndicator="checkbox"
                                                    selectionIndicatorAlign="left"
                                                >
                                                    {item.label}
                                                </MultiSelect.Item>
                                            )}
                                        </MultiSelect>
                                </div>

                                <div className="min-h-0 flex-1 overflow-auto">
                                    <div className="min-w-0">
                                        {tableMode === "crossings" ? <table className="w-full table-fixed text-sm">
                                            <thead className="bg-secondary text-xs text-tertiary"><tr>
                                                <th className="w-14 px-3 py-2 text-center">#</th><th className="px-3 py-2 text-left">Passage</th><th className="w-24 px-3 py-2 text-right">Time</th>
                                            </tr></thead>
                                            <tbody>{crossings.slice((displayPage - 1) * itemsPerPage, displayPage * itemsPerPage).map(event => <tr key={event.id} className={`border-b border-secondary ${selectedCrossingId === event.id ? "bg-secondary" : ""}`}>
                                                <td className="px-3 py-3 text-center">
                                                    <button type="button" onClick={() => setSelectedCrossingId(event.id)}
                                                        aria-label={`Select passage for object ${objectNumbers[event.object_id]}`}
                                                        aria-pressed={selectedCrossingId === event.id}
                                                        className={`inline-flex min-w-7 cursor-pointer items-center justify-center rounded-md px-1.5 py-1 text-xs font-semibold tabular-nums ${selectedCrossingId === event.id ? "bg-amber-400/15 text-amber-500 ring-1 ring-amber-400/40" : "bg-secondary text-secondary"}`}>
                                                        {objectNumbers[event.object_id]}
                                                    </button>
                                                </td>
                                                <td className="px-3 py-3"><button type="button" className="w-full cursor-pointer text-left text-primary" onClick={() => setSelectedCrossingId(event.id)}>
                                                    <span className="block truncate font-medium">{event.obj_name} · {event.direction === "A_to_B" ? "A → B" : "B → A"}</span>
                                                    <span className="text-xs text-tertiary">Frame {event.frame_number}</span>
                                                </button></td><td className="px-3 py-3 text-right tabular-nums text-secondary">{(event.timestamp_ms / 1000).toFixed(2)} s</td>
                                            </tr>)}</tbody>
                                            {crossings.length === 0 && <tfoot><tr><td colSpan={3} className="p-6 text-center text-tertiary">No line passages recorded.</td></tr></tfoot>}
                                        </table> : isLoading ? (
                                            <div className="flex justify-center py-8">
                                                Loading objects...
                                            </div>
                                        ) : error ? (
                                            <div className="flex justify-center py-8 text-sm">
                                                {error}
                                            </div>
                                        ) : paginatedObjects.length !== 0 ? (
                                            <ObjectsTable
                                                objects={paginatedObjects}
                                                objectNumbers={objectNumbers}
                                                sortDescriptor={sortDescriptor}
                                                setSortChange={setSortDescriptor}
                                                selectedObjectId={selectedObject?.id ?? null}
                                                onSelectObject={objectId => setSelection(objectId ? { detectionId: detection.id, objectId } : null)}
                                            />

                                        ) : (
                                            <NotFoundTable type="object" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex shrink-0 items-center justify-between gap-2 border-t border-secondary bg-primary px-4 py-3">
                                    <Button color="secondary" size="sm" iconLeading={<ChevronLeft size={18} />}
                                        aria-label="Previous objects page" isDisabled={displayPage <= 1} onClick={() => setCurrentPage(displayPage - 1)} />
                                    <span className="text-sm tabular-nums text-secondary">Page {displayPage} of {Math.max(1, tablePages)}</span>
                                    <Button color="secondary" size="sm" iconLeading={<ChevronRight size={18} />}
                                        aria-label="Next objects page" isDisabled={displayPage >= tablePages} onClick={() => setCurrentPage(displayPage + 1)} />
                                </div>
                            </TableCard.Root>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>

            {isExtractOpen && (
                <ExtractSingleReportModal
                    isOpen={isExtractOpen}
                    onOpenChange={setIsExtractOpen}
                    detection_id={detection.id}
                />
            )}

            {isDeleteOpen && (
                <DeleteDetectionConfirmationModal
                    isOpen={isDeleteOpen}
                    onOpenChange={setIsDeleteOpen}
                    detection_id={detection.id}
                    onDeleted={() => onOpenChange(false)}
                />
            )}
        </>
    )
}

