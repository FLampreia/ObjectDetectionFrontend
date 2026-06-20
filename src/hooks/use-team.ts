"use client";

import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { SortDescriptor } from "react-aria-components";

import {
    toggleFavorite as toggleFavoriteAPI,
    updateTeam,
    getLoggedTeams,
    getAllTeams,
    addTeam,
    deleteTeam,
} from "@/services/team";

import type { Team } from "@/types/team";


export function useTeams() {
    const ITEMS_PER_PAGE = 5;
    const NUMBER_OF_FAVORITES = 3;

    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [currentPageLogged, setCurrentPageLogged] = useState(1);
    const [currentPageAll, setCurrentPageAll] = useState(1);

    const [sortDescriptor, setSortDescriptor] = useState<SortDescriptor>({
        column: "name",
        direction: "ascending",
    });


    // =========================
    // FETCH LOGGED USER TEAMS
    // =========================

    const {
        data: loggedTeams = [],
        isLoading: isLoadingLogged,
        error: errorLogged,
    } = useQuery({
        queryKey: ["logged-teams"],
        queryFn: getLoggedTeams,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });


    // =========================
    // FETCH ALL TEAMS
    // =========================

    const {
        data: allTeams = [],
        isLoading: isLoadingAll,
        error: errorAll,
    } = useQuery({
        queryKey: ["all-teams"],
        queryFn: getAllTeams,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
    });



    const invalidateTeams = () => {
        queryClient.invalidateQueries({
            queryKey: ["logged-teams"]
        });

        queryClient.invalidateQueries({
            queryKey: ["all-teams"]
        });
    };


    // =========================
    // CREATE
    // =========================

    const createTeamMutation = useMutation({
        mutationFn: addTeam,

        onSuccess: () => {
            invalidateTeams();
        },
    });



    // =========================
    // DELETE
    // =========================

    const deleteTeamMutation = useMutation({

        mutationFn: deleteTeam,

        onMutate: async (teamId) => {

            await queryClient.cancelQueries({
                queryKey: ["logged-teams"]
            });


            const previous =
                queryClient.getQueryData<Team[]>([
                    "logged-teams"
                ]);


            queryClient.setQueryData<Team[]>(
                ["logged-teams"],
                old =>
                    old?.filter(
                        t => t.id !== teamId
                    ) ?? []
            );


            return { previous };
        },


        onError: (_, __, context) => {

            queryClient.setQueryData(
                ["logged-teams"],
                context?.previous
            );

        },


        onSettled: () => {
            invalidateTeams();
        },
    });



    // =========================
    // EDIT
    // =========================

    const editTeamMutation = useMutation({

        mutationFn: ({
            teamid,
            name
        }: {
            teamid: string;
            name: string;
        }) =>
            updateTeam(teamid, name),


        onMutate: async ({
            teamid,
            name
        }) => {

            await queryClient.cancelQueries({
                queryKey: ["logged-teams"]
            });


            const previous =
                queryClient.getQueryData<Team[]>(
                    ["logged-teams"]
                );


            queryClient.setQueryData<Team[]>(
                ["logged-teams"],
                old =>
                    old?.map(t =>
                        t.id === teamid
                            ? { ...t, name }
                            : t
                    ) ?? []
            );


            return { previous };
        },


        onError: (_, __, context) => {
            queryClient.setQueryData(
                ["logged-teams"],
                context?.previous
            );
        },


        onSettled() {
            invalidateTeams();
        }
    });



    // =========================
    // FAVORITE
    // =========================

    const toggleFavoriteMutation = useMutation({

        mutationFn: toggleFavoriteAPI,


        onMutate: async (teamId) => {

            await queryClient.cancelQueries({
                queryKey: ["logged-teams"]
            });


            const previous =
                queryClient.getQueryData<Team[]>(
                    ["logged-teams"]
                );


            queryClient.setQueryData<Team[]>(
                ["logged-teams"],
                old =>
                    old?.map(t =>
                        t.id === teamId
                            ? {
                                ...t,
                                is_favorite:
                                    !t.is_favorite
                            }
                            : t
                    ) ?? []
            );


            return { previous };
        },


        onError: (_, __, context) => {
            queryClient.setQueryData(
                ["logged-teams"],
                context?.previous
            );
        },


        onSettled() {
            invalidateTeams();
        }
    });



    // =========================
    // FILTER
    // =========================

    const filteredLoggedTeams = useMemo(
        () =>
            loggedTeams.filter(t =>
                t.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
            ),
        [loggedTeams, search]
    );


    const filteredAllTeams = useMemo(
        () =>
            allTeams.filter(t =>
                t.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
            ),
        [allTeams, search]
    );



    // =========================
    // SORT
    // =========================

    const sortTeams = (teams: Team[]) =>
        [...teams].sort((a, b) => {

            if (a.is_favorite !== b.is_favorite) {
                return a.is_favorite ? -1 : 1;
            }


            const first =
                a[sortDescriptor.column as keyof Team];

            const second =
                b[sortDescriptor.column as keyof Team];


            if (
                typeof first === "string" &&
                typeof second === "string"
            ) {
                const result =
                    first.localeCompare(second);

                return sortDescriptor.direction === "descending"
                    ? -result
                    : result;
            }

            return 0;
        });



    const sortedLoggedTeams =
        useMemo(
            () => sortTeams(filteredLoggedTeams),
            [filteredLoggedTeams, sortDescriptor]
        );


    const sortedAllTeams =
        useMemo(
            () => sortTeams(filteredAllTeams),
            [filteredAllTeams, sortDescriptor]
        );



    const totalPagesLogged =
        Math.ceil(
            sortedLoggedTeams.length /
            ITEMS_PER_PAGE
        );


    const totalPagesAll =
        Math.ceil(
            sortedAllTeams.length /
            ITEMS_PER_PAGE
        );



    const paginatedLoggedTeams =
        sortedLoggedTeams.slice(
            (currentPageLogged - 1) * ITEMS_PER_PAGE,
            currentPageLogged * ITEMS_PER_PAGE
        );


    const paginatedAllTeams =
        sortedAllTeams.slice(
            (currentPageAll - 1) * ITEMS_PER_PAGE,
            currentPageAll * ITEMS_PER_PAGE
        );



    const toggleFavorite = (teamId: string) => {

        const teams =
            queryClient.getQueryData<Team[]>(
                ["logged-teams"]
            ) ?? [];


        const target =
            teams.find(t => t.id === teamId);


        if (!target) return;


        const favorites =
            teams.filter(
                t => t.is_favorite
            ).length;


        if (
            !target.is_favorite &&
            favorites >= NUMBER_OF_FAVORITES
        ) {
            return;
        }


        toggleFavoriteMutation.mutate(teamId);
    };



    return {

        loggedTeams: paginatedLoggedTeams,
        allLoggedTeams: sortedLoggedTeams,

        teams: paginatedAllTeams,
        allTeams: sortedAllTeams,

        favoriteTeams:
            loggedTeams.filter(
                t => t.is_favorite
            ),


        totalPagesLogged,
        totalPagesAll,

        loading:
            isLoadingLogged ||
            isLoadingAll,


        error:
            errorLogged || errorAll
                ? "Failed to load teams"
                : null,


        search,
        setSearchLogged: (value: string) => {
            setSearch(value);
            setCurrentPageLogged(1);
        },
        setSearchALL: (value: string) => {
            setSearch(value);
            setCurrentPageAll(1);
        },

        currentPageLogged,
        setCurrentPageLogged,
        currentPageAll,
        setCurrentPageAll,

        sortDescriptor,
        setSortDescriptor,


        toggleFavorite,


        createTeam:
            (name: string) =>
                createTeamMutation.mutateAsync(name),


        removeTeam:
            (id: string) =>
                deleteTeamMutation.mutateAsync(id),


        editTeam:
            (id: string, name: string) =>
                editTeamMutation.mutateAsync({
                    teamid: id,
                    name
                })
    };
}