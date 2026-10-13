import type { Detection } from "./detection"

export type StreamFrameRenderer = (detections: Detection[]) => number

