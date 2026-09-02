"use client"

import { Table } from "@/components/application/table/table";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { ListDetection } from "@/types";
import { Menu, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SortDescriptor } from "react-aria-components";
import { DetectionObjectsModal } from "../../teams/modals/detections-objects-modal";

type Props = {
    detections: ListDetection[];
    sortDescriptor?: SortDescriptor;
    onSortChange?: (value: SortDescriptor) => void;
};

export function DetectionsTable({ detections, sortDescriptor, onSortChange }: Props) {
    const [selectedDetection, setSelectedDetection] = useState<ListDetection | null>(null)
    const [isDetectionObjOpen, setIsDetectionObjOpen] = useState(false);

    return (
        <>
            <Table
                aria-label="Detections"
                sortDescriptor={sortDescriptor}
                onSortChange={onSortChange}
            >
                <Table.Header>
                    <Table.Head id="created_at" label="Date" isRowHeader allowsSorting />
                    <Table.Head id="username" label="User" allowsSorting />
                    <Table.Head id="model" label="Model" allowsSorting />
                    <Table.Head id="type" label="Type" allowsSorting />
                    <Table.Head id="conf_threshold" label="Confidence (%)" allowsSorting />
                    <Table.Head id="processing_time_ms" label="Processing Time (ms)" allowsSorting />
                    <Table.Head id="count" label="Nº Objects" allowsSorting />
                    <Table.Head id="actions" />
                </Table.Header>

                <Table.Body items={detections}>
                    {(detection) => (
                        <Table.Row id={detection.id}>
                            <Table.Cell>
                                {new Date(detection.created_at).toLocaleString()}
                            </Table.Cell>

                            <Table.Cell>
                                {detection.username}
                            </Table.Cell>

                            <Table.Cell>
                                {detection.model}
                            </Table.Cell>

                            <Table.Cell>
                                {detection.type}
                            </Table.Cell>

                            <Table.Cell>
                                {detection.conf_threshold * 100} %
                            </Table.Cell>

                            <Table.Cell>
                                {detection.processing_time_ms.toFixed(2)} ms
                            </Table.Cell>

                            <Table.Cell>
                                {detection.count}
                            </Table.Cell>

                            <Table.Cell>
                                <div className="flex justify-end">
                                    <ButtonUtility
                                        size="xs"
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
                // onClose={() => setSelectedDetection(null)}
                />
            )}
        </>
    )
}
