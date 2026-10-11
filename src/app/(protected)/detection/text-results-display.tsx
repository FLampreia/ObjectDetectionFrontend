"use client";

import { Badge } from "@/components/base/badges/badges";
import type { Area, Detection, Line } from "@/types";
import { ScanSearch } from "lucide-react";
import { Tab, TabList, TabPanel, Tabs } from "react-aria-components";
import { cx } from "@/utils/cx";
import { memo } from "react";

interface TextDisplayBoxProps {
    type: string;
    detections: Detection[];
    trackedDetections?: Detection[];
    area: Area | null;
    line?: Line | null;
    imageWidth: number;
    imageHeight: number;
    videoDuration?: number;
    videoCurrentTime?: number;
    layout?: "compact" | "expanded";
}

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "—";
    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainder = String(totalSeconds % 60).padStart(2, "0");
    return hours > 0
        ? `${hours}:${String(minutes).padStart(2, "0")}:${remainder}`
        : `${minutes}:${remainder}`;
}

const percentage = (value: number) => `${(value * 100).toFixed(1)}%`;

const tabClassName =
    "cursor-pointer border-b-2 border-transparent px-1 py-3 text-sm font-semibold text-tertiary outline-hidden transition selected:border-brand selected:text-brand-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export const TextResultDisplay = memo(function TextResultDisplay({
    type,
    detections,
    trackedDetections,
    area,
    line = null,
    imageWidth,
    imageHeight,
    videoDuration,
    videoCurrentTime,
    layout = "compact",
}: TextDisplayBoxProps) {
    const expanded = layout === "expanded";
    const classes = new Map<
        number,
        { id: number; name: string; count: number; confidenceTotal: number }
    >();
    let confidenceTotal = 0;
    let highest = 0;
    let lowest = 1;

    for (const detection of detections) {
        confidenceTotal += detection.confidence;
        highest = Math.max(highest, detection.confidence);
        lowest = Math.min(lowest, detection.confidence);
        const item = classes.get(detection.class_id) ?? {
            id: detection.class_id,
            name: detection.class_name,
            count: 0,
            confidenceTotal: 0,
        };
        item.count += 1;
        item.confidenceTotal += detection.confidence;
        classes.set(detection.class_id, item);
    }

    const classSummary = [...classes.values()].sort(
        (a, b) => b.count - a.count || a.id - b.id,
    );
    const hasDetections = detections.length > 0;
    const hasDimensions = imageWidth > 0 && imageHeight > 0;
    const areaWidth = area ? Math.abs(area.x2 - area.x1) : 0;
    const areaHeight = area ? Math.abs(area.y2 - area.y1) : 0;
    const areaCoverage =
        hasDimensions && area
            ? Math.min(1, (areaWidth * areaHeight) / (imageWidth * imageHeight))
            : null;
    const isImage = type.toLowerCase() === "image";

    const emptyState = (
        <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <div className="rounded-lg border border-secondary bg-primary p-2.5 text-tertiary">
                <ScanSearch size={20} aria-hidden="true" />
            </div>

            <p className="text-sm font-semibold text-primary">No detections yet</p>

            <p className="max-w-64 text-sm text-tertiary">
                Detected objects and confidence scores will appear here.
            </p>
        </div>
    );

    return (
        <section
            aria-label={`${type} detection results`}
            className={cx("flex min-w-0 flex-col overflow-hidden rounded-xl border border-secondary bg-primary", !expanded && "h-112")}
        >
            <div className={cx("shrink-0", expanded ? "px-5 pt-5 sm:px-6 sm:pt-6" : "px-4 pt-4")}>
                <div className="flex items-center justify-between gap-3">
                    <h2 className="text-md font-semibold text-primary">
                        Detection results
                    </h2>
                    <Badge color="gray" size="sm">
                        {type}
                    </Badge>
                </div>

                <p className={cx("mt-1 text-tertiary", expanded ? "text-sm" : "text-xs")}>
                    {isImage
                        ? "Summary of the detected objects"
                        : "Results for the current frame"}
                </p>

                <dl className="mt-4 grid grid-cols-3 divide-x divide-secondary rounded-lg border border-secondary bg-secondary py-3">
                    {[
                        { label: isImage ? "Objects" : "Frame objects", value: String(detections.length) },
                        { label: "Classes", value: String(classes.size) },
                        {
                            label: "Avg. confidence",
                            value: hasDetections
                                ? percentage(confidenceTotal / detections.length)
                                : "—",
                        },
                    ].map((stat) => (
                        <div key={stat.label} className="min-w-0 px-3">
                            <dt className={cx("text-tertiary", expanded ? "text-sm" : "text-xs")}>{stat.label}</dt>
                            <dd className="mt-1 text-lg font-semibold tabular-nums text-primary">
                                {stat.value}
                            </dd>
                        </div>
                    ))}
                </dl>
                {trackedDetections !== undefined && (
                    <dl className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-secondary bg-secondary px-3 py-2">
                        <dt className={cx("text-tertiary", expanded ? "text-sm" : "text-xs")}>
                            Total new objects
                        </dt>
                        <dd className="text-lg font-semibold tabular-nums text-primary">
                            {trackedDetections.length}
                        </dd>
                    </dl>
                )}
            </div>

            <Tabs
                defaultSelectedKey="overview"
                className="mt-2 flex min-h-0 flex-1 flex-col"
            >
                <TabList
                    aria-label="Result views"
                    className={cx("flex shrink-0 gap-5 border-b border-secondary", expanded ? "mx-5 sm:mx-6" : "mx-4")}
                >
                    <Tab id="overview" className={tabClassName}>
                        Overview
                    </Tab>
                    <Tab id="objects" className={tabClassName}>
                        Objects
                    </Tab>
                    {trackedDetections !== undefined && (
                        <Tab id="tracked" className={tabClassName}>
                            Tracked
                        </Tab>
                    )}
                </TabList>

                <TabPanel
                    id="overview"
                    className={cx("outline-hidden", expanded ? "grid items-start gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]" : "min-h-0 flex-1 space-y-5 overflow-y-auto p-4")}
                >
                    <div className="min-w-0 space-y-5">
                        <div>
                            <h3 className="text-sm font-semibold text-primary">
                                Objects by class
                            </h3>
                            {hasDetections ? (
                                <ul className="mt-2 divide-y divide-secondary">
                                    {classSummary.map((item) => (
                                        <li
                                            key={item.id}
                                            className="flex items-center justify-between gap-3 py-2.5"
                                        >
                                            <div className="min-w-0">
                                                <p className={cx("text-sm font-medium text-secondary", expanded ? "break-words" : "truncate")}>
                                                    {item.name}
                                                </p>
                                                <p className={cx("mt-0.5 text-tertiary", expanded ? "text-sm" : "text-xs")}>
                                                    Avg. confidence{" "}
                                                    {percentage(item.confidenceTotal / item.count)}
                                                </p>
                                            </div>
                                            <Badge color="gray" size="sm">
                                                {item.count}
                                            </Badge>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                emptyState
                            )}
                        </div>

                        {hasDetections && (
                            <dl className={cx("flex flex-wrap justify-between gap-3 border-t border-secondary pt-3", expanded ? "text-sm" : "text-xs")}>
                                <div>
                                    <dt className="text-tertiary">Lowest confidence</dt>
                                    <dd className="mt-1 font-medium tabular-nums text-secondary">
                                        {percentage(lowest)}
                                    </dd>
                                </div>
                                <div>
                                    <dt className="text-tertiary">Highest confidence</dt>
                                    <dd className="mt-1 font-medium tabular-nums text-secondary">
                                        {percentage(highest)}
                                    </dd>
                                </div>
                            </dl>
                        )}
                    </div>

                    <div className={expanded ? "min-w-0 rounded-lg border border-secondary bg-secondary p-5" : "border-t border-secondary pt-4"}>
                        <h3 className="text-sm font-semibold text-primary">
                            {type} details
                        </h3>

                        <dl className={cx("mt-3", expanded ? "space-y-4 text-sm" : "space-y-2 text-xs")}>
                            <div className="flex justify-between gap-3">
                                <dt className="text-tertiary">Resolution</dt>
                                <dd className="text-right font-medium tabular-nums text-secondary">
                                    {hasDimensions ? `${imageWidth} × ${imageHeight} px` : "—"}
                                </dd>
                            </div>

                            {videoDuration !== undefined && (
                                <div className="flex justify-between gap-3">
                                    <dt className="text-tertiary">Playback</dt>
                                    <dd className="font-medium tabular-nums text-secondary">
                                        {formatTime(videoCurrentTime ?? 0)} /{" "}
                                        {formatTime(videoDuration)}
                                    </dd>
                                </div>
                            )}
                            <div className="flex justify-between gap-3">
                                <dt className="text-tertiary">Detection area</dt>
                                <dd className="text-right font-medium text-secondary">
                                    {area
                                        ? `${Math.round(areaWidth)} × ${Math.round(areaHeight)} px`
                                        : "Full frame"}
                                </dd>
                            </div>
                            {area && (
                                <div className="flex justify-between gap-3">
                                    <dt className="text-tertiary">Area coordinates</dt>
                                    <dd className="text-right font-medium tabular-nums text-secondary">
                                        ({Math.round(area.x1)}, {Math.round(area.y1)}) → (
                                        {Math.round(area.x2)}, {Math.round(area.y2)})
                                    </dd>
                                </div>
                            )}
                            {areaCoverage !== null && (
                                <div className="flex justify-between gap-3">
                                    <dt className="text-tertiary">Frame coverage</dt>
                                    <dd className="font-medium tabular-nums text-secondary">
                                        {percentage(areaCoverage)}
                                    </dd>
                                </div>
                            )}
                            {line && (
                                <div className="flex justify-between gap-3">
                                    <dt className="text-tertiary">Line coordinates</dt>
                                    <dd className="text-right font-medium tabular-nums text-secondary">
                                        ({Math.round(line.x1)}, {Math.round(line.y1)}) → (
                                        {Math.round(line.x2)}, {Math.round(line.y2)})
                                    </dd>
                                </div>
                            )}
                        </dl>
                    </div>
                </TabPanel>

                <TabPanel
                    id="objects"
                    className={cx("outline-hidden", expanded ? "p-5 sm:p-6" : "min-h-0 flex-1 overflow-y-auto p-4")}
                >
                    {hasDetections ? (
                        <>
                            <p className={cx("mb-3 text-tertiary", expanded ? "text-sm" : "text-xs")}>
                                Numbers match the labels drawn on the image.
                            </p>

                            <ol className={expanded ? "grid gap-3 xl:grid-cols-2" : "divide-y divide-secondary"}>
                                {detections.map((detection, index) => (
                                    <li key={index} className={cx("flex items-start gap-3", expanded ? "min-w-0 rounded-lg border border-secondary p-4" : "py-3")}>
                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-secondary text-xs font-semibold tabular-nums text-secondary">
                                            {index + 1}
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center justify-between gap-2">
                                                <p className={cx("text-sm font-medium text-primary", expanded ? "break-words" : "truncate")}>
                                                    {detection.class_name}
                                                </p>
                                                <Badge color="gray" size="sm">
                                                    {percentage(detection.confidence)}
                                                </Badge>
                                            </div>
                                            <p className={cx("mt-1 tabular-nums text-tertiary", expanded ? "text-sm" : "text-xs")}>
                                                Box{" "}
                                                {Math.round(
                                                    Math.abs(detection.bbox[2] - detection.bbox[0]),
                                                )}{" "}
                                                ×{" "}
                                                {Math.round(
                                                    Math.abs(detection.bbox[3] - detection.bbox[1]),
                                                )}{" "}
                                                px
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        </>
                    ) : (
                        emptyState
                    )}
                </TabPanel>

                {trackedDetections !== undefined && (
                    <TabPanel
                        id="tracked"
                        className={cx("outline-hidden", expanded ? "p-5 sm:p-6" : "min-h-0 flex-1 overflow-y-auto p-4")}
                    >
                        <p className={cx("mb-3 text-tertiary", expanded ? "text-sm" : "text-xs")}>
                            {trackedDetections.length} tracked objects across processed
                            frames.
                        </p>
                        {trackedDetections.length > 0 ? (
                            <ul className={expanded ? "grid gap-3 xl:grid-cols-2" : "divide-y divide-secondary"}>
                                {trackedDetections.map((detection, index) => (
                                    <li
                                        key={detection.track_id ?? index}
                                        className={cx("flex items-center justify-between gap-3", expanded ? "min-w-0 rounded-lg border border-secondary p-4" : "py-3")}
                                    >
                                        <div className="min-w-0">
                                            <p className={cx("text-sm font-medium text-primary", expanded ? "break-words" : "truncate")}>
                                                {detection.class_name}
                                            </p>
                                            <p className={cx("mt-1 tabular-nums text-tertiary", expanded ? "text-sm" : "text-xs")}>
                                                Track #{detection.track_id ?? "—"}
                                            </p>
                                        </div>
                                        <Badge color="gray" size="sm">
                                            {percentage(detection.confidence)}
                                        </Badge>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="py-6 text-center text-sm text-tertiary">
                                No tracked objects yet
                            </p>
                        )}
                    </TabPanel>
                )}
            </Tabs>
        </section>
    );
});
