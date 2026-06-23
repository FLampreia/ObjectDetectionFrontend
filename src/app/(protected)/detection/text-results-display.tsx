"use client"

import { usePhotoDetection } from "@/hooks/use-photo-detection"
import { Detection } from "@/types"

interface TextDisplayBoxProps {
    detections: Detection[]
}

export function TextResultDisplay({ detections }: TextDisplayBoxProps) {

    return (
        <div className="w-full h-64 lg:h-112 overflow-y-auto rounded-lg flex flex-col bg-secondary ring-secondary ring-inset lg:rounded-xl lg:ring-1 p-3">            {detections.length === 0 ? (
            <p className="text-tertiary">
                No detections yet
            </p>
        ) : (
            detections.map((d, index) => (
                <div key={index} className="py-1">
                    {d.class_name} - {(d.confidence * 100).toFixed(1)}%
                </div>
            ))
        )}
        </div>
    )
}