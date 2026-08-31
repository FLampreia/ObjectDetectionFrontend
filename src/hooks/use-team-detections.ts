"use client"

import { useMemo, useState } from "react";
import type { DateValue, SortDescriptor } from "react-aria-components";
import { useQuery } from "@tanstack/react-query";

import { ListDetection } from "@/types";
import { getDetectionsTeam } from "@/services/detect";


export function useTeamDetections(teamId: string) {

    const ITEMS_PER_PAGE = 5;

    const [searchDate, setSearchDate] = useState<DateValue | null>(null);
    const [currentPage, setCurrentPage] = useState(1);


    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "created_at",
        direction: "descending",
    });


    const onSearchDateChange = (value: DateValue | null) => {
        setSearchDate(value);
        setCurrentPage(1);
    };

    const {
        data: detections = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["detections", teamId],
        queryFn: () => getDetectionsTeam(teamId),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });


    const filteredDetections = useMemo(() => {

        if (!searchDate) {
            return detections;
        }

        return detections.filter((detection: ListDetection) =>
            detection.created_at.includes(String(searchDate))
        );

    }, [detections, searchDate]);


    const sortedDetections = useMemo(() => {

        return [...filteredDetections].sort((a, b) => {

            const first =
                a[sortDescriptor.column as keyof ListDetection];

            const second =
                b[sortDescriptor.column as keyof ListDetection];


            if (typeof first === "string" && typeof second === "string") {

                const result = first.localeCompare(second);

                return sortDescriptor.direction === "descending"
                    ? -result
                    : result;
            }


            if (typeof first === "number" && typeof second === "number") {

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

        searchDate,
        setSearchDate: onSearchDateChange,

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