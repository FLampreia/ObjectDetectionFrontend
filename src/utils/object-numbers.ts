import type { ListObjects } from "@/types"

/** Number objects independently of table sorting, filtering and pagination. */
export function createObjectNumbers(objects: ListObjects[]): Record<string, number> {
    const ordered = [...objects].sort((a, b) =>
        (a.frame_number ?? 0) - (b.frame_number ?? 0) || a.id.localeCompare(b.id))
    return Object.fromEntries(ordered.map((object, index) => [object.id, index + 1]))
}
