"use client"

import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal"
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination"
import { TableCard } from "@/components/application/table/table"
import { Badge } from "@/components/base/badges/badges"
import { Button } from "@/components/base/buttons/button"

import { useDetectionObjects } from "@/hooks/use-detections-objects"
import { ListDetection } from "@/types"
import { Trash, X } from "lucide-react"
import { NotFoundTable } from "../../not-found-table"
import { MultiSelect } from "@/components/base/select/multi-select"
import { ExtractSingleReportModal } from "../../detection/extract-single-report-modal"
import { useState } from "react"
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

    const {
        objects,
        paginatedObjects,
        filteredObjects,

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

    const averageConfidence =
        objects.length > 0
            ? objects.reduce((sum, object) => sum + object.confidence, 0) / detection.count
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

                        <div className="grid flex-none grid-cols-1 gap-4 lg:min-h-0 lg:flex-1 lg:grid-cols-[1fr_1.5fr] lg:grid-rows-[minmax(0,1fr)] lg:gap-6 lg:overflow-hidden">
                            {/* RESUMO - 1/3 */}
                            <div className="min-w-0 rounded-lg border border-secondary bg-primary p-4 lg:min-h-0 lg:overflow-y-auto">


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

                            {/* TABELA - 2/3 */}
                            <TableCard.Root
                                size="sm"
                                className="flex min-w-0 flex-col overflow-hidden lg:h-full lg:min-h-0"
                            >
                                <TableCard.Header
                                    className="shrink-0"
                                    title="Objects Detected"
                                    badge={filteredObjects.length}
                                    description="All objects detected in the selected detection"

                                    contentTrailing={
                                        <MultiSelect
                                            size="sm"
                                            placeholder="Select classes"
                                            className="w-full md:w-48"
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
                                    }
                                />

                                <div className="min-h-0 flex-1 overflow-auto">
                                    <div className="min-w-0">
                                        {isLoading ? (
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
                                                sortDescriptor={sortDescriptor}
                                                setSortChange={setSortDescriptor}
                                            />

                                        ) : (
                                            <NotFoundTable type="object" />
                                        )}
                                    </div>
                                </div>
                            </TableCard.Root>


                        </div>

                        <div className="shrink-0 border-t border-secondary bg-primary">
                            <PaginationPageMinimalCenter
                                page={currentPage}
                                total={Math.max(1, totalPages)}
                                onPageChange={setCurrentPage}
                                className="border-t-0 pt-3"
                            />
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

