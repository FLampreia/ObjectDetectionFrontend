"use client"

import { useState, useMemo } from "react";
import type { SortDescriptor } from "react-aria-components";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getMembersTeam } from "@/services/members";
import { Member } from "@/types/team";

export function useMembers(teamId: string) {
    const ITEMS_PER_PAGE = 5;


    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "username",
        direction: "ascending",
    });

    const onSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    
    // ---------------- FETCH (CACHED) ----------------
    const {
        data: members = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["members", teamId],
        queryFn: () => getMembersTeam(teamId),
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    const filteredMembers = useMemo(() => {
        return members.filter((member: Member) =>
            member.username.toLowerCase().includes(search.toLowerCase())
        );
    }, [members, search]);

    const sortedMembers = useMemo(() => {
        return [...filteredMembers].sort((a, b) => {
            //normal sorting
            const first = a[sortDescriptor.column as keyof Member];
            const second = b[sortDescriptor.column as keyof Member];

            if (typeof first === "string" && typeof second === "string") {
                const result = first.localeCompare(second);

                return sortDescriptor.direction === "descending"
                    ? -result
                    : result;
            }

            return 0;
        });
    }, [filteredMembers, sortDescriptor]);

    const totalMembers = Math.ceil(sortedMembers.length / ITEMS_PER_PAGE);

    const paginatedMembers = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedMembers.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedMembers, currentPage]);

    return {
        members: paginatedMembers,
        allMembers: sortedMembers,
        totalMembers,
        search,
        setSearch: onSearchChange,
        setCurrentPage,
        sortDescriptor,
        setSortDescriptor,


        error: error ? "Failed to load members" : null,

    }
}