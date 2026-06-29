import { useState } from "react";
import type { Selection } from "react-aria-components";
import { MultiSelect } from "@/components/base/select/multi-select";
import { cocoClassesItems } from "@/utils/coco-classes";

const getSelectedClasses = (selectedKeys?: Selection) => {
    if (!selectedKeys || selectedKeys === "all") {
        return cocoClassesItems.length;
    }

    return (selectedKeys as Set<string | number>).size;
};

export const MultiSelectClassesBox = ({
    selectedKeys,
    onSelectionChange,
}: {
    selectedKeys: Selection
    onSelectionChange: (keys: Selection) => void
}) => {

    return (
        <MultiSelect
            size="md"
            label="2. Choose Classes"
            tooltip="Check the box of the classes you want to detect on the uploaded file"
            placeholder="Select classes"
            items={cocoClassesItems}
            selectedKeys={selectedKeys}
            onSelectionChange={onSelectionChange}
            supportingText={`${getSelectedClasses(selectedKeys)} classes`}
            onReset={() => onSelectionChange(new Set())}
            onSelectAll={() =>
                onSelectionChange(new Set(cocoClassesItems.map((t) => t.id)))
            }
        >
            {(item) => (
                <MultiSelect.Item
                    id={item.id}
                    selectionIndicator="checkbox"
                    selectionIndicatorAlign="left"
                >
                    {item.label}
                </MultiSelect.Item>
            )}
        </MultiSelect>
    );
};