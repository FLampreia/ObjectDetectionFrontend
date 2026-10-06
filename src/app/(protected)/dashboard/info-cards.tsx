"use client";

import { Boxes, Scan } from "lucide-react";
import type { DetectionType } from "@/types";

type Props = {
    total_detections?: number;
    total_objects?: number;
    detection_types?: DetectionType[];
};

export default function InfoCards({
    total_detections,
    total_objects,
    detection_types,
}: Props) {
    const metrics = [
        {
            title: "Total Detections",
            description: "Detections performed",
            value: total_detections ?? 0,
            icon: Scan,
        },
        {
            title: "Total Objects",
            description: "Objects detected",
            value: total_objects ?? 0,
            icon: Boxes,
        },
    ];

    return (
        <div className="grid min-h-72 flex-1 auto-rows-fr grid-cols-2 gap-4">
            {metrics.map(({ title, description, value, icon: Icon }) => (
                <div
                    key={title}
                    className="flex min-w-0 flex-col items-center justify-center rounded-xl border border-secondary bg-primary px-3 py-5 text-center shadow-xs sm:px-4"
                >
                    <span className="mb-3 flex size-9 items-center justify-center rounded-lg bg-secondary text-brand-secondary ring-1 ring-secondary ring-inset">
                        <Icon size={18} aria-hidden="true" />
                    </span>

                    <h3 className="text-sm font-medium text-secondary">{title}</h3>
                    
                    <p className="mt-2 max-w-full text-3xl leading-tight font-semibold tracking-tight text-primary tabular-nums [overflow-wrap:anywhere] sm:text-4xl">
                        {value.toLocaleString("en-US")}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-tertiary">{description}</p>
                </div>
            ))}

            <div className="col-span-2 flex min-w-0 flex-col rounded-xl border border-secondary bg-primary p-4 shadow-xs">
                
                <h3 className="text-sm font-semibold text-primary">Detection Types</h3>
                
                <p className="mt-1 text-xs leading-5 text-tertiary">
                    Number of detections by type
                </p>

                {detection_types && detection_types.length > 0 ? (
                    <div className="mt-4 grid flex-1 auto-cols-fr grid-flow-col gap-2 sm:gap-3">
                        
                        {detection_types.map((item) => (
                            <div
                                key={item.type}
                                className="flex min-w-0 flex-col items-center justify-center gap-2 rounded-lg bg-secondary px-2 py-4 text-center"
                            >
                                <p className="text-xs font-medium break-words text-tertiary capitalize">
                                    {item.type}
                                </p>
                                
                                <p className="max-w-full text-xl leading-tight font-semibold tracking-tight text-primary tabular-nums [overflow-wrap:anywhere] sm:text-2xl">
                                    {item.count.toLocaleString("en-US")}
                                </p>
                            </div>
                        ))}

                    </div>
                ) : (
                    <div className="mt-4 flex flex-1 items-center justify-center rounded-lg bg-secondary p-4 text-center">
                        <p className="text-sm text-tertiary">No detections</p>
                    </div>
                )}
            </div>
        </div>
    );
}
