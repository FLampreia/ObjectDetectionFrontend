"use client"

import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal"
import { Button } from "@/components/base/buttons/button"
import { Select } from "@/components/base/select/select"
import { Toggle } from "@/components/base/toggle/toggle"
import type { ReportConfig } from "@/types"
import { SlidersHorizontal, X } from "lucide-react"
import { useId, useState } from "react"
import { Heading } from "react-aria-components"

type AnnotationMode = "boxes" | "points" | "both"
type ColorKey = "bbox_color" | "dot_color" | "text_color" | "text_background_color" | "area_color"

const MODES = [
    { id: "boxes", label: "Bounding boxes" },
    { id: "points", label: "Center points" },
    { id: "both", label: "Boxes and points" },
]

export function ImageAnnotationSettings({ config, onChange }: {
    config: ReportConfig
    onChange: (config: ReportConfig) => void
}) {
    const [isOpen, setIsOpen] = useState(false)
    const descriptionId = useId()
    const mode: AnnotationMode = config.bbox_enable ? (config.dot_enable ? "both" : "boxes") : "points"
    const labelsEnabled = (config.bbox_enable && config.bbox_label_enable) || (config.dot_enable && config.dot_label_enable)

    function selectMode(nextMode: AnnotationMode) {
        onChange({ ...config, bbox_enable: nextMode !== "points", dot_enable: nextMode !== "boxes" })
    }

    function colorInput(key: ColorKey, label: string, disabled = false) {
        return (
            <label className="flex items-center justify-between gap-4 text-sm font-medium text-secondary">
                <span className={disabled ? "text-tertiary" : undefined}>{label}</span>
                <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-tertiary">{config[key].toUpperCase()}</span>
                    <input
                        type="color"
                        value={config[key]}
                        disabled={disabled}
                        onChange={(event) => onChange({ ...config, [key]: event.target.value })}
                        className="h-9 w-12 cursor-pointer rounded-lg border border-secondary bg-primary p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </span>
            </label>
        )
    }

    return (
        <div className="mr-auto">
            <Button color="secondary" iconLeading={<SlidersHorizontal />} onPress={() => setIsOpen(true)}>
                Appearance
            </Button>
            <ModalOverlay isOpen={isOpen} onOpenChange={setIsOpen} isDismissable>
                <Modal className="w-full max-w-md">
                    <Dialog className="p-6" aria-describedby={descriptionId}>
                        <div className="flex items-center justify-between gap-4">
                            <Heading slot="title" className="text-xl font-semibold text-primary">Image appearance</Heading>
                            <Button color="tertiary" size="sm" iconLeading={<X size={18} />} aria-label="Close appearance settings" onPress={() => setIsOpen(false)} />
                        </div>
                        <p id={descriptionId} className="mt-1 text-sm text-tertiary">
                            Changes apply to the image and its download.
                        </p>

                        <div className="mt-6 space-y-5">
                            <Select
                                label="Detection markers"
                                size="md"
                                items={MODES}
                                value={mode}
                                onChange={(value) => {
                                    if (value === "boxes" || value === "points" || value === "both") selectMode(value)
                                }}
                            >
                                {(item) => <Select.Item id={item.id}>{item.label}</Select.Item>}
                            </Select>

                            <div className="space-y-3 border-t border-secondary pt-4">
                                <Toggle
                                    label="Box labels"
                                    isSelected={config.bbox_enable && config.bbox_label_enable}
                                    isDisabled={!config.bbox_enable}
                                    onChange={(enabled) => onChange({ ...config, bbox_label_enable: enabled })}
                                />
                                <Toggle
                                    label="Point labels"
                                    isSelected={config.dot_enable && config.dot_label_enable}
                                    isDisabled={!config.dot_enable}
                                    onChange={(enabled) => onChange({ ...config, dot_label_enable: enabled })}
                                />
                            </div>

                            <div className="space-y-3 border-t border-secondary pt-4">
                                {colorInput("bbox_color", "Box color", !config.bbox_enable)}
                                {colorInput("dot_color", "Point color", !config.dot_enable)}
                                {colorInput("text_color", "Label color", !labelsEnabled)}
                                {colorInput("text_background_color", "Label background", !labelsEnabled)}
                                {colorInput("area_color", "Area color")}
                            </div>
                        </div>

                        <div className="mt-6 flex justify-end border-t border-secondary pt-4">
                            <Button size="md" onPress={() => setIsOpen(false)}>Done</Button>
                        </div>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </div>
    )
}
