import { useQuery } from "@tanstack/react-query"
import { getAlgorithms } from "@/services/detect"
import { AlgorithmObj } from "@/types"


export function useAlgorithms() {
    return useQuery<AlgorithmObj[]>({
        queryKey: ["algorithms"],
        queryFn: getAlgorithms,

        // 10 min for the next request
        staleTime: 1000 * 60 * 10,

        // stores cache for 30 min
        gcTime: 1000 * 60 * 30,
    })
}