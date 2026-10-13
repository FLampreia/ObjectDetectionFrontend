import type { DetectionImage, ListObjects } from "@/types"

export function selectDetectionImage(images: DetectionImage[], object: ListObjects | null) {
    if (!object) return images[0] ?? null
    // Never substitute an unrelated frame when an object's saved image is missing.
    return images.find(image => image.id === object.image_id)
        ?? images.find(image => image.objects.some(candidate => candidate.id === object.id))
        ?? null
}
