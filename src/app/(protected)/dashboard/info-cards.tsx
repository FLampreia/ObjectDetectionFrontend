"use client"

import { DetectionType } from "@/types";

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
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Total de deteções */}
            <div className="min-w-0 rounded-lg border border-secondary bg-primary p-4">
                <h3 className="text-sm font-semibold text-primary">
                    Total Detections
                </h3>

                <p className="mt-1 text-sm text-tertiary">
                    Total number of detections performed
                </p>

                <p className="mt-5 text-xl font-semibold text-primary">
                    {total_detections ?? 0}
                </p>
            </div>

            {/* Total de objetos */}
            <div className="min-w-0 rounded-lg border border-secondary bg-primary p-4">
                <h3 className="text-sm font-semibold text-primary">
                    Total Objects
                </h3>

                <p className="mt-1 text-sm text-tertiary">
                    Total number of objects detected
                </p>

                <p className="mt-5 text-xl font-semibold text-primary">
                    {total_objects ?? 0}
                </p>
            </div>

            {/* Tipos de deteção */}
            <div className="col-span-2 min-w-0 rounded-lg border border-secondary bg-primary p-4">
                <h3 className="text-sm font-semibold text-primary">
                    Detection Types
                </h3>

                <p className="mt-1 text-sm text-tertiary">
                    Number of detections by type
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                    {detection_types?.map((item) => (
                        <div
                            key={item.type}
                            className="rounded-lg border border-secondary p-3"
                        >
                            <p className="text-xs text-tertiary capitalize">
                                {item.type}
                            </p>

                            <p className="mt-1 text-xl font-semibold text-primary">
                                {item.count}
                            </p>
                        </div>
                    ))}
                </div>

                {(!detection_types || detection_types.length === 0) && (
                    <div className="mt-5 rounded-lg border border-secondary p-3 text-center">
                        <p className="text-sm text-tertiary">
                            No detections
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}