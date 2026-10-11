"use client"

import { Table } from "@/components/application/table/table";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { ListDetection } from "@/types";
import { Menu } from "lucide-react";
import { useState } from "react";
import { Selection, SortDescriptor } from "react-aria-components";
import { DetectionObjectsModal } from "../../teams/modals/detections-objects-modal";

type Props = {
    detections: ListDetection[];
    sortDescriptor?: SortDescriptor;
    onSortChange?: (value: SortDescriptor) => void;
    selectedKeys?: Set<string>;
    onSelectionChange?: (keys: Selection) => void;
    showUsername?: boolean;
};

export function DetectionsTable({ detections, sortDescriptor, onSortChange, selectedKeys, onSelectionChange, showUsername = false }: Props) {
    const [selectedDetection, setSelectedDetection] = useState<ListDetection | null>(null)
    const [isDetectionObjOpen, setIsDetectionObjOpen] = useState(false);

    return (
        <>
            <Table
                aria-label="Detections"
                sortDescriptor={sortDescriptor}
                onSortChange={onSortChange}
                selectionMode={onSelectionChange ? "multiple" : "none"}
                selectionBehavior={onSelectionChange ? "toggle" : "replace"}
                selectedKeys={selectedKeys}
                onSelectionChange={onSelectionChange}
            >
                <Table.Header>
                    <Table.Head id="created_at" label="Date" isRowHeader allowsSorting />
                    {showUsername && <Table.Head id="username" label="User" allowsSorting className="hidden md:table-cell" />}
                    <Table.Head id="model" label="Model" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="type" label="Type" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="conf_threshold" label="Confidence (%)" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="processing_time_ms" label="Processing Time" allowsSorting className="hidden md:table-cell" />
                    <Table.Head id="count" label="Objects" allowsSorting />
                    <Table.Head id="actions" />
                </Table.Header>

                <Table.Body items={detections}>
                    {(detection) => (
                        <Table.Row id={detection.id}>
                            <Table.Cell>
                                <span className="hidden md:inline">{new Date(detection.created_at).toLocaleString()}</span>
                                <span className="md:hidden">
                                    {new Date(detection.created_at).toLocaleDateString()}
                                    <span className="mt-1 block text-xs">{new Date(detection.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} · {detection.type}</span>
                                </span>
                            </Table.Cell>

                            {showUsername && (
                                <Table.Cell className="hidden md:table-cell">
                                    {detection.username}
                                </Table.Cell>
                            )}

                            <Table.Cell className="hidden md:table-cell">
                                {detection.model}
                            </Table.Cell>

                            <Table.Cell className="hidden md:table-cell">
                                {detection.type}
                            </Table.Cell>

                            <Table.Cell className="hidden md:table-cell">
                                {detection.conf_threshold * 100} %
                            </Table.Cell>

                            <Table.Cell className="hidden md:table-cell">
                                {detection.processing_time_ms < 1000
                                    ? `${detection.processing_time_ms.toFixed(2)} ms`
                                    : detection.processing_time_ms < 60000
                                        ? `${(detection.processing_time_ms / 1000).toFixed(2)} s`
                                        : `${(detection.processing_time_ms / 60000).toFixed(2)} min`
                                }
                            </Table.Cell>

                            <Table.Cell>
                                {detection.count}
                            </Table.Cell>

                            <Table.Cell>
                                <div className="flex justify-end">
                                    <ButtonUtility
                                        size="sm"
                                        color="tertiary"
                                        tooltip="Details"
                                        icon={Menu}
                                        onClick={() => {
                                            setSelectedDetection(detection)
                                            setIsDetectionObjOpen(true)
                                        }}
                                    />
                                </div>
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

            {isDetectionObjOpen && selectedDetection && (
                <DetectionObjectsModal
                    isOpen={isDetectionObjOpen}
                    onOpenChange={setIsDetectionObjOpen}
                    detection={selectedDetection}
                />
            )}
        </>
    )
}
