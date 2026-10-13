import { useQuery } from "@tanstack/react-query"
import { getDetectionImages } from "@/services/detections"

export function useDetectionImages(detectionId: string, isOpen: boolean) {
    return useQuery({
        queryKey: ["detection-images", detectionId],
        queryFn: () => getDetectionImages(detectionId),
        enabled: isOpen && !!detectionId,
        staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
    })
}
