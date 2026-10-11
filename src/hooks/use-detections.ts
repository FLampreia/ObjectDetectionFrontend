
import { useMemo, useState } from "react";
import type { DateValue, SortDescriptor } from "react-aria-components";
import { useQuery } from "@tanstack/react-query";

import { ListDetection } from "@/types";
import { getDetections } from "@/services/detect";
import { useAuth } from "./use-auth";
import { getLocalTimeZone } from "@internationalized/date";
import { filterDetections } from "@/utils/filter-detections";

export function useDetections() {

    const { user, loading } = useAuth();

    const ITEMS_PER_PAGE = 10;

    const [dateRange, setDateRange] = useState<{
        start: DateValue;
        end: DateValue;
    } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [model, setModel] = useState<string | null>(null);
    const [detectionType, setDetectionType] = useState<ListDetection["type"] | null>(null);
    const [teamId, setTeamId] = useState<string | null>(null);

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
        enabled: !loading && !!user?.id,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
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

    const models = useMemo(() => [...new Set(detections.map((detection) => detection.model))].sort(), [detections]);
    const teams = useMemo(() => {
        const names = new Map<string, string>();
        detections.forEach((detection) => {
            if (detection.team_id) names.set(detection.team_id, detection.team_name ?? "Unnamed team");
        });
        return [...names].map(([id, label]) => ({ id, label })).sort((a, b) => a.label.localeCompare(b.label));
    }, [detections]);

    const filteredDetections = useMemo(() => {
        const start = dateRange?.start.toDate(getLocalTimeZone());
        const end = dateRange?.end.toDate(getLocalTimeZone());
        end?.setHours(23, 59, 59, 999);
        return filterDetections(detections, { model, detectionType, teamId, start, end });
    }, [detections, dateRange, model, detectionType, teamId]);

    function clearFilters() {
        setDateRange(null);
        setModel(null);
        setDetectionType(null);
        setTeamId(null);
        setCurrentPage(1);
    }


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
        model,
        setModel: (value: string | null) => { setModel(value); setCurrentPage(1); },
        detectionType,
        setDetectionType: (value: ListDetection["type"] | null) => { setDetectionType(value); setCurrentPage(1); },
        teamId,
        setTeamId: (value: string | null) => { setTeamId(value); setCurrentPage(1); },
        models,
        teams,
        clearFilters,

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
