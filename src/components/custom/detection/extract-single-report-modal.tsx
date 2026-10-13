"use client";

import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { ModalHeader } from "@/components/custom/layout/modal-parts";
import { InlineFeedback } from "@/components/custom/layout/inline-feedback";
import { FileBarChart } from "lucide-react";
import { Toggle } from "@/components/base/toggle/toggle";
import { DEFAULT_DRAWING_CONFIG } from "@/config/drawing";
import { getSingleDetectionReport } from "@/services/reports";
import type { ReportConfig } from "@/types";
import { useId, useRef, useState } from "react";
import { useNotification } from "@/providers/notification-provider";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    detection_id: string;
};

type ColorKey = "area_color" | "line_color" | "bbox_color" | "dot_color" | "text_color" | "text_background_color";

export function ExtractSingleReportModal({ isOpen, onOpenChange, detection_id }: Props) {
    const descriptionId = useId();
    const notify = useNotification();
    const generatingRef = useRef(false);
    const [error, setError] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [drawingConfig, setDrawingConfig] = useState<ReportConfig>({ ...DEFAULT_DRAWING_CONFIG });

    function updateConfig(changes: Partial<ReportConfig>) {
        setDrawingConfig((previous) => ({ ...previous, ...changes }));
        setError(null);
    }

    async function handleGenerateReport() {
        if (generatingRef.current) return;
        generatingRef.current = true;
        setIsGenerating(true);
        setError(null);
        try {
            const pdf = await getSingleDetectionReport(detection_id, drawingConfig);
            const url = window.URL.createObjectURL(pdf);
            const link = document.createElement("a");
            try {
                link.href = url;
                link.download = `detection-report-${detection_id}.pdf`;
                document.body.appendChild(link);
                link.click();
            } finally {
                link.remove();
                // Give the browser time to start reading the download URL.
                window.setTimeout(() => window.URL.revokeObjectURL(url), 1000);
            }
            notify("Report exported");
            onOpenChange(false);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Unable to generate the report. Please try again.");
        } finally {
            generatingRef.current = false;
            setIsGenerating(false);
        }
    }

    function renderColorInput(key: ColorKey, label: string, disabled = false) {
        const value = drawingConfig[key];
        return (
            <label className="flex items-center justify-between gap-4 text-sm text-secondary">
                <span>{label}</span>
                <span className="flex items-center gap-2">
                    <span className="font-mono text-xs text-tertiary">{value.toUpperCase()}</span>
                    <input
                        type="color"
                        value={value}
                        onChange={(event) => updateConfig({ [key]: event.target.value })}
                        disabled={isGenerating || disabled}
                        className="h-9 w-12 cursor-pointer rounded-lg border border-secondary bg-primary p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </span>
            </label>
        );
    }

    const labelsEnabled = drawingConfig.bbox_label_enable || drawingConfig.dot_label_enable;

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!generatingRef.current) onOpenChange(open);
            }}
            isDismissable={!isGenerating}
            isKeyboardDismissDisabled={isGenerating}
        >
            <Modal className="flex w-full max-w-2xl flex-col overflow-hidden max-sm:overflow-hidden">
                <Dialog className="flex min-h-0 flex-col overflow-hidden" aria-describedby={descriptionId}>
                    <div className="shrink-0 px-5 pt-5 sm:px-6 sm:pt-6">
                    <ModalHeader
                        title="Extract report"
                        description="Customize the image annotations included in your PDF report."
                        descriptionId={descriptionId}
                        icon={<FileBarChart />}
                        onClose={() => onOpenChange(false)}
                        isDisabled={isGenerating}
                    />
                    </div>
                    <form
                        className="flex min-h-0 flex-1 flex-col overflow-hidden"
                        aria-busy={isGenerating}
                        onSubmit={(event) => {
                            event.preventDefault();
                            void handleGenerateReport();
                        }}
                    >
                        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-6 sm:px-6">
                        <fieldset disabled={isGenerating} className="space-y-3 rounded-lg border border-secondary p-4">
                            <legend className="px-1 text-sm font-semibold text-primary">Bounding boxes</legend>
                            <Toggle
                                label="Show bounding boxes"
                                isSelected={drawingConfig.bbox_enable}
                                isDisabled={isGenerating}
                                onChange={(enabled) => updateConfig({
                                    bbox_enable: enabled,
                                    ...(!enabled ? { bbox_label_enable: false } : {}),
                                })}
                            />
                            <Toggle
                                label="Show box labels"
                                isSelected={drawingConfig.bbox_label_enable}
                                isDisabled={isGenerating || !drawingConfig.bbox_enable}
                                onChange={(enabled) => updateConfig({ bbox_label_enable: enabled })}
                            />
                            {renderColorInput("bbox_color", "Box color", !drawingConfig.bbox_enable)}
                        </fieldset>
                        <fieldset disabled={isGenerating} className="space-y-3 rounded-lg border border-secondary p-4">
                            <legend className="px-1 text-sm font-semibold text-primary">Center points</legend>
                            <Toggle
                                label="Show center points"
                                isSelected={drawingConfig.dot_enable}
                                isDisabled={isGenerating}
                                onChange={(enabled) => updateConfig({
                                    dot_enable: enabled,
                                    ...(!enabled ? { dot_label_enable: false } : {}),
                                })}
                            />
                            <Toggle
                                label="Show point labels"
                                isSelected={drawingConfig.dot_label_enable}
                                isDisabled={isGenerating || !drawingConfig.dot_enable}
                                onChange={(enabled) => updateConfig({ dot_label_enable: enabled })}
                            />
                            {renderColorInput("dot_color", "Point color", !drawingConfig.dot_enable)}
                        </fieldset>
                        <fieldset disabled={isGenerating} className="space-y-3 rounded-lg border border-secondary p-4">
                            <legend className="px-1 text-sm font-semibold text-primary">Labels, area and line</legend>
                            {renderColorInput("text_color", "Text color", !labelsEnabled)}
                            {renderColorInput("text_background_color", "Text background", !labelsEnabled)}
                            {renderColorInput("area_color", "Area color")}
                            {renderColorInput("line_color", "Counting line color")}
                        </fieldset>
                        </div>
                        <p role="status" className="sr-only">{isGenerating ? "Generating PDF report. Please wait." : ""}</p>
                        <div className="shrink-0 border-t border-secondary bg-primary px-5 py-4 sm:px-6 sm:pb-6">
                            {error && <div className="mb-3"><InlineFeedback>{error}</InlineFeedback></div>}
                            <div className="flex flex-wrap items-center justify-between gap-3">
                            <Button
                                type="button"
                                color="link-gray"
                                isDisabled={isGenerating}
                                onPress={() => {
                                    setDrawingConfig({ ...DEFAULT_DRAWING_CONFIG });
                                    setError(null);
                                }}
                            >Reset defaults</Button>
                            <div className="flex gap-2">
                                <Button type="button" color="secondary" size="md" isDisabled={isGenerating} onPress={() => onOpenChange(false)}>Cancel</Button>
                                <Button type="submit" size="md" isLoading={isGenerating} isDisabled={isGenerating} showTextWhileLoading>
                                    {isGenerating ? "Generating…" : error ? "Try again" : "Extract PDF"}
                                </Button>
                            </div>
                            </div>
                        </div>
                    </form>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
