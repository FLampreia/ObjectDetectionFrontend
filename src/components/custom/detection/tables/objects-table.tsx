"use client"

import { Table } from "@/components/application/table/table";
import { ListObjects } from "@/types";

import { ResizableTableContainer, type SortDescriptor } from "react-aria-components";

type Props = {
    objects: ListObjects[];
    objectNumbers: Readonly<Record<string, number>>;
    sortDescriptor: SortDescriptor;
    setSortChange: (value: SortDescriptor) => void;
    selectedObjectId?: string | null;
    onSelectObject?: (objectId: string | null) => void;
};

export function ObjectsTable({ objects, objectNumbers, sortDescriptor, setSortChange, selectedObjectId, onSelectObject }: Props) {

    return (
        <ResizableTableContainer className="w-full min-w-0">
            <Table
                aria-label="ObjectsDetected"
                // Override the library's min-content width inside resizable table containers.
                className="w-full! min-w-full table-fixed"
                sortDescriptor={sortDescriptor}
                onSortChange={setSortChange}
                selectionMode={onSelectObject ? "single" : "none"}
                selectionBehavior="replace"
                selectedKeys={selectedObjectId ? new Set([selectedObjectId]) : new Set()}
                onSelectionChange={onSelectObject ? keys => {
                    if (keys !== "all") onSelectObject([...keys][0]?.toString() ?? null)
                } : undefined}
            >
                <Table.Header>
                    <Table.Head id="object_number" label="#" width={64} minWidth={64} maxWidth={64}
                        className="w-16! px-3 md:px-3 [&>div]:justify-center" />
                    <Table.Head id="obj_name" label="Object" isRowHeader allowsSorting width="1fr"
                        className="px-3 md:px-3" />
                    <Table.Head id="obj_conf" label="Confidence" allowsSorting width={128} minWidth={128} maxWidth={128}
                        className="w-32! px-3 md:px-3 [&>div]:justify-end" />

                </Table.Header>

                <Table.Body items={objects} dependencies={[selectedObjectId, objectNumbers]}>
                    {(objects) => (
                        <Table.Row id={objects.id} className={onSelectObject ? "cursor-pointer" : undefined}>
                            <Table.Cell className="px-3 text-center md:px-3">
                                <span className={`inline-flex min-w-7 items-center justify-center rounded-md px-1.5 py-1 text-xs font-semibold tabular-nums ${objects.id === selectedObjectId ? "bg-amber-400/15 text-amber-500 ring-1 ring-amber-400/40" : "bg-secondary text-secondary"}`}>
                                    {objectNumbers[objects.id] ?? "—"}
                                </span>
                            </Table.Cell>
                            <Table.Cell className="overflow-hidden px-3 md:px-3">
                                <p className="truncate font-medium text-primary" title={objects.obj_name}>{objects.obj_name}</p>
                                <p className="text-xs text-tertiary">Class {objects.obj_class_id}</p>
                            </Table.Cell>

                            <Table.Cell className="px-3 text-right whitespace-nowrap tabular-nums md:px-3">
                                {(objects.confidence * 100).toFixed(1)}%
                            </Table.Cell>

                        </Table.Row>
                    )}
                </Table.Body>
            </Table>

        </ResizableTableContainer>
    )
}
