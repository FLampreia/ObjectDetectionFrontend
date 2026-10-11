export type Detection = {
    track_id?: number
    class_id: number
    class_name: string
    confidence: number
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
    track_id?: number | null;
    image_id?: string | null;
    frame_number?: number | null;
    id: string;
    obj_name: string;
    obj_class_id: number;
    confidence: number
}
