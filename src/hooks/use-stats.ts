import { getStats } from "@/services/stats";
import { useQuery } from "@tanstack/react-query";


export function useStats() {
    const {
        data: stats = null,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["dashboard-stats"],
        queryFn: () => getStats(),
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: false,
        refetchOnMount: true,
    });

    return{
        stats,
        isLoading,
        error
    }
}
