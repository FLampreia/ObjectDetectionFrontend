"use client"

import { usePhotoDetection } from "@/hooks/use-photo-detection"
import { Area, Detection } from "@/types"

interface TextDisplayBoxProps {
    detections: Detection[]
    area: Area | null
    imageWidth: number
    imageHeight: number
}

export function TextResultDisplay({
    detections,
    area,
    imageWidth,
    imageHeight
}: TextDisplayBoxProps) {

    return (
        <div className="w-full h-64 lg:h-112 overflow-y-auto rounded-lg flex flex-col bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1 p-3">
            {imageHeight && imageWidth && (
                <>
                    <p>
                        Image size:
                    </p>
                    <p className="pl-3">
                        Hight: {imageHeight}px <br />
                        Width: {imageWidth}px <br />
                        
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
                        x1: {Math.round(area.x1 * imageWidth)}px <br />
                        y1: {Math.round(area.y1 * imageHeight)}px <br />
                        x2: {Math.round(area.x2 * imageWidth)}px <br />
                        y2: {Math.round(area.y2 * imageHeight)}px
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
                            {d.class_name} - {(d.confidence * 100).toFixed(1)}%
                        </p>
                    ))}

                </>

            )}
        </div>
    )
}