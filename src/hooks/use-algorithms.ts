import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { getAlgorithms, downloadAlgorithm } from "@/services/algorithms"
import { AlgorithmObj } from "@/types"


export function useAlgorithms() {
    const queryClient = useQueryClient()

    const algorithmsQuery = useQuery<AlgorithmObj[]>({
        queryKey: ["algorithms"],
        queryFn: getAlgorithms,

        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
    })

    const downloadMutation = useMutation({
        mutationFn: downloadAlgorithm,

        onSuccess: () => {
            // Updates list after download
            queryClient.invalidateQueries({
                queryKey: ["algorithms"],
            })
        },
    })

    return {
        ...algorithmsQuery,

        downloadAlgorithm: downloadMutation.mutateAsync,
        downloadingAlgorithm: downloadMutation.variables ?? null,
        isDownloading: downloadMutation.isPending,
    }
}