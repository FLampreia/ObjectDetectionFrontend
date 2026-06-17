"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SortDescriptor } from "react-aria-components";
import { toggleFavorite as toggleFavoriteAPI, updateTeam } from "@/services/team";
import { getLoggedTeams, addTeam, deleteTeam } from "@/services/team";
import type { Team } from "@/types/team";

export function useTeams() {
    const ITEMS_PER_PAGE = 5;
    const NUMBER_OF_FAVORITES = 3
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });

    // ---------------- FETCH (CACHED) ----------------
    const {
        data: teams = [],
        isLoading,
        error,
    } = useQuery({
        queryKey: ["teams"],
        queryFn: getLoggedTeams,
        staleTime: 1000 * 60 * 5, // 5 minutos de cache
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });

    // ---------------- CREATE/DELETE (MUTATION) ----------------
    const createTeamMutation = useMutation({
        mutationFn: addTeam,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });

    const deleteTeamMutation = useMutation({
        mutationFn: deleteTeam,

        onMutate: async (teamId: string) => {
            await queryClient.cancelQueries({ queryKey: ["teams"] });

            const previousTeams = queryClient.getQueryData<Team[]>(["teams"]);

            queryClient.setQueryData(["teams"], (old: Team[] = []) =>
                old.filter((t) => t.id !== teamId)
            );

            return { previousTeams };
        },

        onError: (_err, _teamId, context) => {
            queryClient.setQueryData(["teams"], context?.previousTeams);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });

    const editTeamMutation = useMutation({
        mutationFn: ({ teamid, name }: { teamid: string; name: string }) =>
            updateTeam(teamid, name),

        onMutate: async ({ teamid, name }) => {
            await queryClient.cancelQueries({ queryKey: ["teams"] });

            const previousTeams = queryClient.getQueryData<Team[]>(["teams"]);

            queryClient.setQueryData(["teams"], (old: Team[] = []) =>
                old.map((t) =>
                    t.id === teamid
                        ? { ...t, name }
                        : t
                )
            );

            return { previousTeams };
        },

        onError: (_err, _vars, context) => {
            queryClient.setQueryData(["teams"], context?.previousTeams);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });

    const createTeam = async (name: string) => {
        await createTeamMutation.mutateAsync(name);
    };

    const removeTeam = async (id: string) => {
        await deleteTeamMutation.mutateAsync(id)
    }

    const editTeam = async (teamid: string, name: string) => {
        await editTeamMutation.mutateAsync({teamid, name})
    }

    // reset page on search
    const onSearchChange = (value: string) => {
        setSearch(value);
        setCurrentPage(1);
    };

    // ---------------- DERIVED DATA ----------------
    const filteredTeams = useMemo(() => {
        return teams.filter((team: Team) =>
            team.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [teams, search]);

    const sortedTeams = useMemo(() => {
        return [...filteredTeams].sort((a, b) => {
            // 1. Favorites first
            if (a.is_favorite !== b.is_favorite) {
                return a.is_favorite ? -1 : 1;
            }

            // 2. then, normal sorting
            const first = a[sortDescriptor.column as keyof Team];
            const second = b[sortDescriptor.column as keyof Team];

            if (typeof first === "string" && typeof second === "string") {
                const result = first.localeCompare(second);

                return sortDescriptor.direction === "descending"
                    ? -result
                    : result;
            }

            return 0;
        });
    }, [filteredTeams, sortDescriptor]);

    const totalPages = Math.ceil(sortedTeams.length / ITEMS_PER_PAGE);

    const paginatedTeams = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        return sortedTeams.slice(start, start + ITEMS_PER_PAGE);
    }, [sortedTeams, currentPage]);

    // ---------------- FAVORITE ----------------

    const toggleFavoriteMutation = useMutation({
        mutationFn: toggleFavoriteAPI,

        onMutate: async (teamId: string) => {
            await queryClient.cancelQueries({ queryKey: ["teams"] });

            const previousTeams = queryClient.getQueryData<Team[]>(["teams"]);

            queryClient.setQueryData(["teams"], (old: Team[] = []) =>
                old.map((t) =>
                    t.id === teamId
                        ? { ...t, is_favorite: !t.is_favorite }
                        : t
                )
            );

            return { previousTeams };
        },

        onError: (_err, _teamId, context) => {
            queryClient.setQueryData(["teams"], context?.previousTeams);
        },

        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["teams"] });
        },
    });

    const toggleFavorite = (teamId: string) => {
        const teams = queryClient.getQueryData<Team[]>(["teams"]) ?? [];

        const currentFavorites = teams.filter(t => t.is_favorite).length;
        const target = teams.find(t => t.id === teamId);

        if (!target) return;

        // blocks if there is already 3 fav
        if (!target.is_favorite && currentFavorites >= NUMBER_OF_FAVORITES) {
            return;
        }

        toggleFavoriteMutation.mutate(teamId);
    };

    const favoriteTeams = useMemo(() => {
        return teams.filter((t) => t.is_favorite);
    }, [teams]);

    return {
        // data
        teams: paginatedTeams,
        allTeams: sortedTeams,
        favoriteTeams,
        totalPages,

        // state
        loading: isLoading,
        error: error ? "Failed to load teams" : null,
        search,
        setSearch: onSearchChange,
        currentPage,
        setCurrentPage,
        sortDescriptor,
        setSortDescriptor,
        toggleFavorite,

        // actions
        createTeam,
        removeTeam,
        editTeam,
    };
}