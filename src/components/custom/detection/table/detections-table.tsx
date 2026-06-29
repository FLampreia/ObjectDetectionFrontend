"use client"

import { Table } from "@/components/application/table/table";
import { ListDetection } from "@/types";
import { SortDescriptor } from "react-aria-components";

type Props = {
    detections: ListDetection[];
    sortDescriptor: SortDescriptor;
    onSortChange: (value: SortDescriptor) => void;
};

export function DetectionsTable({ detections, sortDescriptor, onSortChange }: Props) {
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
                    <Table.Head id="conf_threshold" label="Confidence" allowsSorting />
                    <Table.Head id="processing_time_ms" label="Processing Time (ms)" allowsSorting />
                    <Table.Head id="count" label="Nº Objects" allowsSorting />
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
                                {detection.conf_threshold}
                            </Table.Cell>

                            <Table.Cell>
                                {detection.processing_time_ms.toFixed(2)}
                            </Table.Cell>

                            <Table.Cell>
                                {detection.count}
                            </Table.Cell>
                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

        </>
    )
}
