"use client"

import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal"
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination"
import { Table, TableCard } from "@/components/application/table/table"
import { Badge } from "@/components/base/badges/badges"
import { Button } from "@/components/base/buttons/button"

import { useDetectionObjects } from "@/hooks/use-detections-objects"
import { ListDetection } from "@/types"
import { X } from "lucide-react"
import { NotFoundTable } from "../../not-found-table"
import { MultiSelect } from "@/components/base/select/multi-select"

type DetectionObjectsModalProps = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;

    detection: ListDetection;

    // onClose: () => void
}

export function DetectionObjectsModal({
    isOpen,
    onOpenChange,
    detection,
    // onClose,
}: DetectionObjectsModalProps) {



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

        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >

            <Modal>
                <Dialog
                    className="w-[80vw] max-w-8xl mx-auto space-y-4 p-6 overflow-y-auto lg:overflow-hidden h-[80vh] flex flex-col"
                    aria-label="objects"
                >
                    <div className="flex items-center justify-between">


                        <div className="flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-tertiary">
                            <span>
                                Created:
                                <span className="font-medium text-secondary"> {new Date(detection.created_at).toLocaleString()}</span>
                            </span>
                            <span>
                                Model:
                                <span className="font-medium text-secondary"> {detection.model}</span>
                            </span>
                            <span>
                                Processing Time:
                                <span className="font-medium text-secondary"> {detection.processing_time_ms.toFixed(2)} ms</span>
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

                        <Button
                            color="secondary"
                            size="sm"
                            onClick={() => onOpenChange(false)}
                            aria-label="Close"
                        >
                            <X size={18} />
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_1.5fr] lg:flex-1 lg:min-h-0">
                        {/* RESUMO - 1/3 */}
                        <div className="min-w-0 rounded-lg border border-secondary bg-primary p-4">


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
                            className="min-h-0 h-full flex flex-col overflow-hidden"
                        >
                            <TableCard.Header
                                title="Objects Detected"
                                badge={filteredObjects.length}
                                description="All objects detected in the selected detection"

                                contentTrailing={
                                    <MultiSelect
                                        size="sm"
                                        placeholder="Select classes"
                                        className="w-48"
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

                            <div className="flex-1 min-h-0 p-4">
                                <div className="min-w-0 h-full overflow-hidden">
                                    {isLoading ? (
                                        <div className="flex justify-center py-8">
                                            Loading objects...
                                        </div>
                                    ) : error ? (
                                        <div className="flex justify-center py-8 text-sm">
                                            {error}
                                        </div>
                                    ) : paginatedObjects.length !== 0 ? (
                                        <div className="h-full flex flex-col overflow-y-auto">

                                            <Table
                                                aria-label="ObjectsDetected"
                                                sortDescriptor={sortDescriptor}
                                                onSortChange={setSortDescriptor}
                                            >
                                                <Table.Header>
                                                    <Table.Head id="obj_name" label="Name" isRowHeader allowsSorting className="sticky top-0 z-10 bg-secondary" />
                                                    <Table.Head id="obj_class" label="Class" allowsSorting className="sticky top-0 z-10 bg-secondary" />
                                                    <Table.Head id="obj_conf" label="Confidence (%)" allowsSorting className="sticky top-0 z-10 bg-secondary" />

                                                </Table.Header>
                                                <Table.Body items={paginatedObjects} className="overflow-y-auto">
                                                    {(objects) => (
                                                        <Table.Row id={objects.id}>
                                                            <Table.Cell>
                                                                {objects.obj_name}
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                {objects.obj_class_id}
                                                            </Table.Cell>

                                                            <Table.Cell>
                                                                {(objects.confidence * 100).toFixed(1)} %
                                                            </Table.Cell>

                                                        </Table.Row>
                                                    )}
                                                </Table.Body>
                                            </Table>
                                        </div>

                                    ) : (
                                        <NotFoundTable type="object" />
                                    )}
                                </div>
                            </div>

                            <div className="shrink-0 border-t border-secondary bg-primary">


                                <PaginationPageMinimalCenter
                                    page={currentPage}
                                    total={totalPages}
                                    onPageChange={setCurrentPage}
                                    className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
                                />
                            </div>
                        </TableCard.Root>


                    </div>

                </Dialog>
            </Modal>
        </ModalOverlay>
    )
}

