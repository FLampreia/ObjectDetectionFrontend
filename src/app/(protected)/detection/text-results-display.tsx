"use client"

import { Area, Detection } from "@/types"

interface TextDisplayBoxProps {
    type: string
    detections: Detection[]
    trackedDetections?: Detection[]
    area: Area | null
    imageWidth: number
    imageHeight: number
    videoDuration?: number
    videoCurrentTime?: number
}

export function TextResultDisplay({
    type,
    detections,
    trackedDetections,
    area,
    imageWidth,
    imageHeight,
    videoDuration,
    videoCurrentTime,
}: TextDisplayBoxProps) {

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)

        return `${mins}:${secs.toString().padStart(2, "0")}`
    }
    // TODO colocar mais informações aqui colcoar as deteções por class, e nao só a lista total de deteções

    return (
        <div className="w-full h-64 lg:h-112 overflow-y-auto rounded-lg flex flex-col bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1 p-3">
            {imageHeight != 0 && imageWidth != 0 && (
                <>
                    <p>
                        {type} details:
                    </p>
                    <p className="pl-3">
                        Hight: {imageHeight}px <br />
                        Width: {imageWidth}px <br />

                        {videoDuration !== undefined && (
                            <>
                                Duration: {formatTime(videoDuration)} / {formatTime(videoCurrentTime ?? 0)} <br />
                            </>
                        )}

                    </p>
                    <hr className="my-3 border-secondary" />

                </>
            )}
            {area && (
                <>
                    <p>
                        Defined area:
                    </p>

                    <p className="pl-3">
                        x1: {Math.round(area.x1)}px <br />
                        y1: {Math.round(area.y1)}px <br />
                        x2: {Math.round(area.x2)}px <br />
                        y2: {Math.round(area.y2)}px
                    </p>

                    <hr className="my-3 border-secondary" />

                </>
            )}
            {detections.length === 0 ? (
                <p className="text-tertiary">
                    No detections yet
                </p>
            ) : (
                <>
                    <p>
                        Detections:
                    </p>

                    {detections.map((d, index) => (
                        <p key={index} className="pl-3">
                            {index + 1}. {d.class_name} - {(d.confidence * 100).toFixed(1)}%
                        </p>
                    ))}

                </>

            )}
            {trackedDetections && trackedDetections.length > 0 && (
                <>
                    <hr className="my-3 border-secondary" />

                    <p>Tracked objects:</p>

                    {trackedDetections.map((d) => (
                        <p
                            className="pl-3"
                            key={d.track_id}>
                            {d.class_name} #{d.track_id}
                        </p>
                    ))}
                </>
            )}
        </div>
    )
}
