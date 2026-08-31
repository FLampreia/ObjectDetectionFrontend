"use client"

import { useMemo, useState } from "react";
import type { DateValue, SortDescriptor } from "react-aria-components";
import { useQuery } from "@tanstack/react-query";

import { ListDetection } from "@/types";
import { getDetections, getDetectionsTeam } from "@/services/detect";
import { useAuth } from "./use-auth";
import { getLocalTimeZone, today } from "@internationalized/date";


const now = today(getLocalTimeZone());

export function useDetections() {

    const { user, loading } = useAuth();

    const ITEMS_PER_PAGE = 10;

    const [dateRange, setDateRange] = useState<{
    start: DateValue;
    end: DateValue;
} | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "created_at",
        direction: "descending",
    });

    const {
        data: detections = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["detections", user?.id],
        queryFn: () => getDetections(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });


    const onDateRangeChange = (
        value: {
            start: DateValue;
            end: DateValue;
        } | null
    ) => {
        setDateRange(value);
        setCurrentPage(1);
    };

    const filteredDetections = useMemo(() => {
        if (!dateRange) {
            return detections;
        }

        const start = dateRange.start.toDate(
            getLocalTimeZone()
        );

        const end = dateRange.end.toDate(
            getLocalTimeZone()
        );

        // Garantir que o dia final inteiro é incluído
        end.setHours(23, 59, 59, 999);

        return detections.filter(
            (detection: ListDetection) => {
                const detectionDate = new Date(
                    detection.created_at
                );

                return (
                    detectionDate >= start &&
                    detectionDate <= end
                );
            }
        );
    }, [detections, dateRange]);


    const sortedDetections = useMemo(() => {
        return [...filteredDetections].sort((a, b) => {
            const first =
                a[sortDescriptor.column as keyof ListDetection];

            const second =
                b[sortDescriptor.column as keyof ListDetection];

            if (
                typeof first === "string" &&
                typeof second === "string"
            ) {
                const result = first.localeCompare(second);

                return sortDescriptor.direction === "descending"
                    ? -result
                    : result;
            }

            if (
                typeof first === "number" &&
                typeof second === "number"
            ) {
                const result = first - second;

                return sortDescriptor.direction === "descending"
                    ? -result
                    : result;
            }

            return 0;
        });
    }, [filteredDetections, sortDescriptor]);



    const totalDetections = Math.ceil(
        sortedDetections.length / ITEMS_PER_PAGE
    );


    const paginatedDetections = useMemo(() => {

        const start =
            (currentPage - 1) * ITEMS_PER_PAGE;

        return sortedDetections.slice(
            start,
            start + ITEMS_PER_PAGE
        );

    }, [
        sortedDetections,
        currentPage
    ]);



    return {
        detections: paginatedDetections,
        allDetections: sortedDetections,

        totalDetections,

        dateRange,
        setDateRange: onDateRangeChange,

        currentPage,
        setCurrentPage,

        sortDescriptor,
        setSortDescriptor,

        error: error
            ? "Failed to load detections"
            : null,

        isLoading,
    };
}