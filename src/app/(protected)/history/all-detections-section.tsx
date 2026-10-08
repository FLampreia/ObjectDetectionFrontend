"use client"

import { TableCard } from "@/components/application/table/table";
import { TableState } from "@/components/custom/layout/table-state";
import type { ListDetection } from "@/types";
import { DetectionsTable } from "@/components/custom/detection/tables/detections-table";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { Button } from "@/components/base/buttons/button";
import { Eraser, ListChecks, Trash2, X } from "lucide-react";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { useState } from "react";
import type { Selection } from "react-aria-components";
import { useDetections } from "@/hooks/use-detections";
import { getDetectionReportInterval } from "@/services/reports";
import { DeleteDetectionConfirmationModal } from "@/components/custom/detection/delete-detection-confirmation-modal";

export function AllDetectionsSection() {
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [isSelecting, setIsSelecting] = useState(false);
    const {
        detections,
        allDetections,
        dateRange,
        setDateRange,
        sortDescriptor,
        setSortDescriptor,
        currentPage,
        setCurrentPage,
        totalDetections,

        error,
        isLoading,
    } = useDetections();

    // Only detections in the current filtered results can be deleted.
    const selectedDetectionIds = allDetections
        .filter((detection: ListDetection) => selectedIds.has(detection.id))
        .map((detection: ListDetection) => detection.id);
    const selectedCount = selectedDetectionIds.length;
    const pageSelectedKeys = new Set<string>(
        detections.filter((detection: ListDetection) => selectedIds.has(detection.id))
            .map((detection: ListDetection) => detection.id),
    );

    function handleSelectionChange(keys: Selection) {
        // The table header checkbox selects this page; preserve other pages.
        const pageKeys = keys === "all"
            ? detections.map((detection: ListDetection) => detection.id)
            : [...keys].map(String);
        setSelectedIds((previous) => {
            const next = new Set(previous);
            detections.forEach((detection: ListDetection) => next.delete(detection.id));
            pageKeys.forEach((id: string) => next.add(id));
            return next;
        });
    }

    async function handleGenerateReport() {
        if (!dateRange) return;

        try {
            const blob = await getDetectionReportInterval(
                dateRange.start.toString(),
                dateRange.end.toString(),
            );

            const url = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = url;
            link.download = `detections-report-${dateRange.start}-${dateRange.end}.pdf`;

            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to generate detection report:", error);
        }
    }

    return (
        <>
        <TableCard.Root size="sm">
            <TableCard.Header
                title={"All Detections"}
                badge={allDetections.length}
                description={
                    `Search for your old detections`
                }
                contentTrailing={
                    <div className="flex flex-col gap-4 mb-4 xl:flex-row xl:items-end xl:justify-between">

                        {dateRange && (
                            <Button
                                size="md"
                                color="secondary"
                                onClick={() => {
                                    setSelectedIds(new Set());
                                    setDateRange(null);
                                }}
                                aria-label="Clear date"
                            >
                                <Eraser size={20} />
                            </Button>
                        )}

                        <DateRangePicker
                            size="md"
                            aria-label="Date range picker"
                            shouldCloseOnSelect={false}
                            value={dateRange}
                            onChange={(value) => {
                                setSelectedIds(new Set());
                                setDateRange(value);
                            }}
                        />

                        <Button
                            size="md"
                            isDisabled={!dateRange}
                            onClick={() => handleGenerateReport()}
                        >
                            Extract Report
                        </Button>

                        <Button
                            size="md"
                            color="secondary"
                            iconLeading={isSelecting ? X : ListChecks}
                            isDisabled={!isSelecting && (allDetections.length === 0 || !!error)}
                            aria-expanded={isSelecting}
                            aria-controls="detection-selection-actions"
                            onPress={() => {
                                setSelectedIds(new Set());
                                setIsSelecting((previous) => !previous);
                            }}
                        >
                            {isSelecting ? "Cancel selection" : "Select detections"}
                        </Button>

                    </div>
                }
            />

            {isSelecting && (
            <div id="detection-selection-actions" className="flex flex-wrap items-center gap-3 border-b border-secondary bg-secondary px-4 py-3 md:px-5">
                <p role="status" className="mr-auto text-sm text-secondary">
                    <span className="font-semibold text-primary">{selectedCount}</span> selected
                </p>

                <Button
                    color="secondary"
                    size="sm"
                    isDisabled={allDetections.length === 0 || selectedCount === allDetections.length}
                    onPress={() => setSelectedIds(new Set(allDetections.map((detection: ListDetection) => detection.id)))}
                >
                    Select all
                </Button>

                <Button color="secondary" size="sm" isDisabled={selectedCount === 0} onPress={() => setSelectedIds(new Set())}>
                    Deselect all
                </Button>

                <Button
                    color="secondary-destructive"
                    size="sm"
                    iconLeading={Trash2}
                    isDisabled={selectedCount === 0}
                    onPress={() => setIsDeleteOpen(true)}
                >
                    Delete detections
                </Button>

                <p className="w-full text-xs text-tertiary">Select all includes every page in the current date filter.</p>

            </div>
            )}

            <TableState isLoading={isLoading} error={error} isEmpty={allDetections.length === 0} type="detection">
                <DetectionsTable
                    detections={detections}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                    selectedKeys={isSelecting ? pageSelectedKeys : undefined}
                    onSelectionChange={isSelecting ? handleSelectionChange : undefined}
                />
            </TableState>

            <PaginationPageMinimalCenter
                page={currentPage}
                total={Math.max(1, totalDetections)}
                onPageChange={setCurrentPage}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>

        {isDeleteOpen && (
            <DeleteDetectionConfirmationModal
                isOpen={isDeleteOpen}
                onOpenChange={setIsDeleteOpen}
                detection_id={selectedDetectionIds}
                onDeleted={() => {
                    setSelectedIds(new Set());
                    setIsSelecting(false);
                    setCurrentPage(1);
                }}
            />
        )}
        </>

    )
}

