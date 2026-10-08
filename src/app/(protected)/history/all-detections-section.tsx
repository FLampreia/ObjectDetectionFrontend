"use client"

import { TableCard } from "@/components/application/table/table";
import { NotFoundTable } from "@/components/custom/not-found-table";
import { useQueryClient } from "@tanstack/react-query";
import { Team } from "@/types";
import { useTeamDetections } from "@/hooks/use-team-detections";
import { DetectionsTable } from "@/components/custom/detection/tables/detections-table";
import { Calendar, SearchLg } from "@untitledui/icons";
import { InputDate } from "@/components/base/input/input-date";
import { PaginationPageMinimalCenter } from "@/components/application/pagination/pagination";
import { DatePicker } from "@/components/application/date-picker/date-picker";
import { Button } from "@/components/base/buttons/button";
import { Eraser } from "lucide-react";
import { DateRangePicker } from "@/components/application/date-picker/date-range-picker";
import { getLocalTimeZone, today } from "@internationalized/date";
import { useState } from "react";
import { DateValue } from "react-aria-components";
import { useDetections } from "@/hooks/use-detections";
import { getDetectionReportInterval } from "@/services/reports";

export function AllDetectionsSection() {


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
    } = useDetections();

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
                                onClick={() => setDateRange(null)}
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
                            onChange={setDateRange}
                        />

                        <Button
                            size="md"
                            isDisabled={!dateRange}
                            onClick={() => handleGenerateReport()}
                        >
                            Extract Report
                        </Button>

                    </div>
                }
            />

            {allDetections.length !== 0
                ?
                <DetectionsTable
                    detections={detections}
                    sortDescriptor={sortDescriptor}
                    onSortChange={setSortDescriptor}
                />
                :
                <NotFoundTable type="detection" />
            }

            <PaginationPageMinimalCenter
                page={currentPage}
                total={totalDetections}
                onPageChange={setCurrentPage}
                className="px-4 py-3 md:px-6 md:pt-3 md:pb-4"
            />
        </TableCard.Root>

    )
}

