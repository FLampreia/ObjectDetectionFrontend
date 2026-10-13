export type Detection = {
    track_id?: number
    class_id: number
    class_name: string
    confidence: number
    mean_confidence?: number | null
    confidence_samples?: number | null
    bbox: [number, number, number, number]
}

export type VideoProcessingResponse = {
    processing_time: number
    detections_per_frame: Detection[]
}

type TwoPoints = {
    x1: number
    y1: number
    x2: number
    y2: number
}

export type Area = TwoPoints;

export type Line = TwoPoints;

export type DrawingColors = {
    areaColor: string;
    lineColor: string;
};


export type AlgorithmObj = {
    name: string
    installed: boolean
}

export type ListDetection = {
    id: string;
    username: string;
    created_at: string;
    model: string;
    conf_threshold: number;
    processing_time_ms: number;
    count: number;
    type: "photo" | "video" | "stream";
    team_id?: string | null;
    team_name?: string | null;
}

export type ListObjects = {
    bbox?: Area;
    track_id?: number | null;
    image_id?: string | null;
    frame_number?: number | null;
    id: string;
    obj_name: string;
    obj_class_id: number;
    confidence: number
    frame_confidence?: number | null
    mean_confidence?: number | null
    confidence_samples?: number | null
}

export type DetectionImage = {
    area?: Area | null;
    line?: Line | null;
    crossings?: LineCrossing[];
    id: string;
    frame_number: number | null;
    timestamp_ms: number | null;
    image_url: string;
    objects: ListObjects[];
}

export type CrossingCounts = { A_to_B: number; B_to_A: number }
export type CrossingEvent = Detection & { track_id: number; direction: "A_to_B" | "B_to_A" }
export type LineCrossing = {
    id: string; object_id: string; image_id: string; track_id: number;
    obj_name: string; obj_class_id: number; confidence: number;
    direction: "A_to_B" | "B_to_A"; frame_number: number; timestamp_ms: number; bbox: Area;
}
