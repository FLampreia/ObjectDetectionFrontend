"use client"

import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal"
import { Button } from "@/components/base/buttons/button"
import { Select } from "@/components/base/select/select"
import { Toggle } from "@/components/base/toggle/toggle"
import type { ReportConfig } from "@/types"
import { SlidersHorizontal } from "lucide-react"
import { ModalActions, ModalHeader } from "@/components/custom/layout/modal-parts"
import { useId, useState } from "react"

type AnnotationMode = "boxes" | "points" | "both"
type ColorKey = "bbox_color" | "dot_color" | "text_color" | "text_background_color" | "area_color"

const MODES = [
    { id: "boxes", label: "Bounding boxes" },
    { id: "points", label: "Center points" },
    { id: "both", label: "Boxes and points" },
]

export function ImageAnnotationSettings({ config, onChange, isDisabled, title = "Image appearance", description = "Changes apply to the image and its download." }: {
    config: ReportConfig
    onChange: (config: ReportConfig) => void
    isDisabled: boolean
    title?: string
    description?: string
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
            <Button color="secondary" iconLeading={<SlidersHorizontal />} onPress={() => setIsOpen(true)} isDisabled={isDisabled}>
                Appearance
            </Button>
            <ModalOverlay isOpen={isOpen} onOpenChange={setIsOpen} isDismissable>
                <Modal className="w-full max-w-2xl">
                    <Dialog className="p-5 sm:p-6" aria-describedby={descriptionId}>
                        <ModalHeader
                            title={title}
                            description={description}
                            descriptionId={descriptionId}
                            icon={<SlidersHorizontal />}
                            onClose={() => setIsOpen(false)}
                        />

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

                        <ModalActions>
                            <Button size="md" onPress={() => setIsOpen(false)}>Done</Button>
                        </ModalActions>
                    </Dialog>
                </Modal>
            </ModalOverlay>
        </div>
    )
}
