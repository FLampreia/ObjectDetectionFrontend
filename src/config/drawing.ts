import type { ReportConfig } from "@/types"

export const DEFAULT_DRAWING_CONFIG: Readonly<ReportConfig> = {
    bbox_enable: true,
    bbox_label_enable: true,
    dot_enable: false,
    dot_label_enable: false,
    area_color: "#0000FF",
    bbox_color: "#FF0000",
    dot_color: "#FFFF00",
    text_color: "#FFFF00",
    text_background_color: "#000000",
}
