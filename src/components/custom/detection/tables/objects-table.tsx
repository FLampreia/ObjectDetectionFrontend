"use client"

import { Table } from "@/components/application/table/table";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { ListDetection, ListObjects } from "@/types";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SortDescriptor } from "react-aria-components";
import { DetectionObjectsModal } from "../../teams/modals/detections-objects-modal";

type Props = {
    objects: ListObjects[];
    sortDescriptor: SortDescriptor;
    setSortChange: (value: SortDescriptor) => void;
};

export function ObjectsTable({ objects, sortDescriptor, setSortChange }: Props) {

    return (
        <>
            <Table
                aria-label="ObjectsDetected"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortChange}
            >
                <Table.Header>
                    <Table.Head id="obj_name" label="Name" isRowHeader allowsSorting />
                    <Table.Head id="obj_class" label="Class" allowsSorting />
                    <Table.Head id="obj_conf" label="Confidence (%)" allowsSorting />

                </Table.Header>

                <Table.Body items={objects}>
                    {(objects) => (
                        <Table.Row id={objects.id}>
                            <Table.Cell>
                                {objects.obj_name}
                            </Table.Cell>

                            <Table.Cell>
                                {objects.obj_class_id}
                            </Table.Cell>

                            <Table.Cell>
                                {(objects.confidence * 100).toFixed(1)} %
                            </Table.Cell>

                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

        </>
    )
}
