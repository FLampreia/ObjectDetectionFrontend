import { ListDetection } from "./detection"

export type DetectionType = {
    type: string
    count: number
}

export type TopObject = {
    name: string
    count: number
}

export type ModelUsage = {
    name: string
    count: number
}

export type Stats = {
    total_detections: number
    total_objects: number

    top_objects: TopObject[]
    top_models: ModelUsage[]
    detection_types: DetectionType[]
    
    last_detections: ListDetection[]
}
