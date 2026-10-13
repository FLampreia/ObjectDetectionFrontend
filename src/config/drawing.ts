import type { DrawingColors, ReportConfig } from "@/types"

export const DEFAULT_AREA_LINE_COLORS: Readonly<DrawingColors> = {
    areaColor: "#0000FF",
    lineColor: "#FFFF00",
}

export const DEFAULT_DRAWING_CONFIG: Readonly<ReportConfig> = {
    bbox_enable: true,
    bbox_label_enable: true,
    dot_enable: false,
    dot_label_enable: false,
    area_color: "#0000FF",
    line_color: "#A78BFA",
    bbox_color: "#FF0000",
    dot_color: "#FFFF00",
    text_color: "#FFFF00",
    text_background_color: "#000000",
}
