import { useMemo, useState } from "react"

import { useQuery } from "@tanstack/react-query"
import { SortDescriptor } from "react-aria-components"

import { ListObjects } from "@/types"
import { getObjects } from "@/services/detections"

export function useDetectionObjects(
    detectionId: string,
    isOpen: boolean
) {
    const ITEMS_PER_PAGE = 10

    const [currentPage, setCurrentPage] = useState(1)
    const [selectedClasses, setSelectedClasses] = useState<Set<number> | null>(null)

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "obj_name",
        direction: "descending",
    })

    const {
        data: objects = [],
        isLoading,
        error,
    } = useQuery<ListObjects[]>({
        queryKey: ["objects", detectionId],
        queryFn: () => getObjects(detectionId),
        enabled: isOpen && !!detectionId,
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
    })

    const classes = useMemo(() => {
        const uniqueClasses = new Map<number, string>()

        objects.forEach((object) => {
            uniqueClasses.set(
                object.obj_class_id,
                object.obj_name
            )
        })

        return Array.from(uniqueClasses.entries()).map(
            ([id, name]) => ({
                id,
                name,
            })
        )
    }, [objects])

    const filteredObjects = useMemo(() => {
        if (selectedClasses === null) {
            return objects
        }

        return objects.filter((object) =>
            selectedClasses.has(object.obj_class_id)
        )
    }, [objects, selectedClasses])

    const sortedObjects = useMemo(() => {
        return [...filteredObjects].sort((a, b) => {
            let first: string | number
            let second: string | number

            switch (sortDescriptor.column) {
                case "obj_name":
                    first = a.obj_name
                    second = b.obj_name
                    break

                case "obj_class":
                    first = a.obj_class_id
                    second = b.obj_class_id
                    break

                case "obj_conf":
                    first = a.confidence
                    second = b.confidence
                    break

                default:
                    return 0
            }

            let result = 0

            if (
                typeof first === "string" &&
                typeof second === "string"
            ) {
                result = first.localeCompare(second)
            } else if (
                typeof first === "number" &&
                typeof second === "number"
            ) {
                result = first - second
            }

            return sortDescriptor.direction === "descending"
                ? -result
                : result
        })
    }, [filteredObjects, sortDescriptor])

    const totalPages = Math.ceil(
        sortedObjects.length / ITEMS_PER_PAGE
    )

    const paginatedObjects = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE

        return sortedObjects.slice(
            start,
            start + ITEMS_PER_PAGE
        )
    }, [sortedObjects, currentPage])

    const onClassesChange = (values: Set<number> | null) => {
        setSelectedClasses(values)
        setCurrentPage(1)
    }
    return {
        objects,
        paginatedObjects,
        filteredObjects,
        sortedObjects,
        itemsPerPage: ITEMS_PER_PAGE,

        classes,

        selectedClasses,
        setSelectedClasses: onClassesChange,

        currentPage,
        setCurrentPage,

        totalPages,

        isLoading,

        sortDescriptor,
        setSortDescriptor,

        error: error ? "Failed to load objects" : null,
    }
}
