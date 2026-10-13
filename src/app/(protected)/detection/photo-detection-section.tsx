"use client"

import { FileUploadInput } from "@/components/custom/detection/file-upload-input"
import { MultiSelectClassesBox } from "@/components/custom/detection/multi-select-class-box"
import { useState } from "react"
import { ImageDisplayBox } from "./image-display-box"
import { Button } from "@/components/base/buttons/button"
import { ImageIcon, PenLine, SlidersHorizontal } from "lucide-react"
import { Camera01 } from "@untitledui/icons"
import { useFileDetection } from "@/hooks/use-file-detection"
import { TextResultDisplay } from "./text-results-display"
import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { DrawAreaModal } from "./draw-area-modal"
import { AlgorithmSelect } from "@/components/custom/detection/algorithm-select"
import { MinConfidenceInput } from "@/components/custom/detection/min-confidence-input"
import { useAlgorithms } from "@/hooks/use-algorithms"
import { SelectTeamBox } from "@/components/custom/detection/select-team-box"
import { ImageAnnotationSettings } from "@/components/custom/detection/image-annotation-settings"
import { DEFAULT_DRAWING_CONFIG } from "@/config/drawing"
import type { ReportConfig } from "@/types"
import { InlineFeedback } from "@/components/custom/layout/inline-feedback"
import { DetectionPerformanceInfo } from "@/components/custom/detection/detection-performance-info"

export function PhotoDetectionSection() {
    const {
        file,
        setFile,
        imageUrl,
        detections,
        setDetections,
        setTrackedDetections,
        detectImage,
        loading,
        processingSeconds,
        detectionPerformance,
        detectionError,
        selectedClasses,
        setSelectedClasses,

        area,
        setArea,

        selectedAlgorithm,
        setSelectedAlgorithm,

        selectedTeamId,
        setSelectedTeamId,

        minConfidence,
        setMinConfidence,
    } = useFileDetection()

    const {
        data: algorithms = [],
    } = useAlgorithms()

    const [isAreaOpen, setIsAreaOpen] = useState(false)
    const [drawingConfig, setDrawingConfig] = useState<ReportConfig>({
        ...DEFAULT_DRAWING_CONFIG,
        dot_label_enable: true,
    })
    const [imageSize, setImageSize] = useState({
        width: 0,
        height: 0,
    })

    return (
        <>
            <section aria-labelledby="photo-configuration-title" className="overflow-hidden rounded-xl border border-secondary bg-primary">
                <div className="flex items-start gap-3 border-b border-secondary bg-secondary px-5 py-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-secondary bg-primary text-brand-secondary">
                        <SlidersHorizontal className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 id="photo-configuration-title" className="text-sm font-semibold text-primary">Photo configuration</h2>
                        <p className="mt-1 text-sm text-tertiary">Upload a photo and choose how to detect its objects.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 p-5 sm:grid-cols-2 xl:grid-cols-6">
                    <div className="min-w-0 xl:col-span-2">
                        <FileUploadInput
                            type="photo"
                            accepted="SVG, PNG, JPG"
                            onFileSelect={(file) => {
                                setFile(file)
                                setArea(null)
                                setDetections([])
                                setTrackedDetections(new Map())
                            }}
                        />
                    </div>
                    <div className="min-w-0 xl:col-span-2">
                        <AlgorithmSelect
                            algorithms={algorithms}
                            selectedAlgorithm={selectedAlgorithm}
                            onAlgorithmChange={setSelectedAlgorithm}
                        />
                    </div>
                    <div className="min-w-0 sm:col-span-2 xl:col-span-2">
                        <MultiSelectClassesBox
                            selectedKeys={selectedClasses}
                            onSelectionChange={setSelectedClasses}
                        />
                    </div>
                    <div className="min-w-0 xl:col-span-3">
                        <SelectTeamBox
                            selectedTeamId={selectedTeamId}
                            onTeamChange={setSelectedTeamId}
                        />
                    </div>
                    <div className="min-w-0 xl:col-span-3">
                        <MinConfidenceInput
                            value={minConfidence}
                            onChange={(confValue) => {
                                setMinConfidence(confValue)
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-secondary px-5 py-4">

                    <ImageAnnotationSettings config={drawingConfig} onChange={setDrawingConfig} isDisabled={loading} />

                    <Button
                        iconLeading={<PenLine />}
                        color="secondary"
                        onClick={() => setIsAreaOpen(true)}
                        isDisabled={!imageUrl}
                    >
                        Define Area
                    </Button>
                    <Button
                        iconLeading={<Camera01 />}
                        onClick={detectImage}
                        isDisabled={
                            !file ||
                            loading ||
                            !selectedAlgorithm ||
                            (
                                selectedClasses !== "all" &&
                                ((selectedClasses as Set<string | number> | undefined)?.size ?? 0) === 0
                            )
                        }
                        isLoading={loading}
                        showTextWhileLoading
                    >
                        {loading ? "Detecting..." : "Detect"}
                    </Button>

                </div>
            </section>

            {detectionError && (
                <div className="mt-4"><InlineFeedback>{detectionError}</InlineFeedback></div>
            )}

            <div className="mt-6 flex w-full flex-col gap-6">
                <section aria-labelledby="photo-preview-title" className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h2 id="photo-preview-title" className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <ImageIcon className="size-4 text-tertiary" aria-hidden="true" />
                            Image preview
                        </h2>
                        {file && <p className="min-w-0 break-all text-sm text-tertiary">{file.name}</p>}
                    </div>
                    <ImageDisplayBox
                        imageUrl={imageUrl}
                        detections={detections}
                        area={area}
                        drawingConfig={drawingConfig}
                        onImageLoad={(width, height) =>
                            setImageSize({
                                width,
                                height,
                            })
                        }
                    />
                    <DetectionPerformanceInfo performance={detectionPerformance} type="photo" />
                </section>

                <TextResultDisplay
                    processingSeconds={processingSeconds}
                    isProcessing={loading}
                    layout="expanded"
                    type="Image"
                    detections={detections}
                    area={area}
                    imageWidth={imageSize.width}
                    imageHeight={imageSize.height}
                />

            </div>

            <FullScreenModal
                isOpen={isAreaOpen}
                onClose={() => setIsAreaOpen(false)}
            >
                <DrawAreaModal
                    imageUrl={imageUrl}
                    area={area}
                    allowLine={false}
                    colors={{ areaColor: drawingConfig.area_color, lineColor: "#FFFF00" }}
                    onSave={(newArea, _newLine, colors) => {
                        setArea(newArea)
                        setDrawingConfig((config) => ({ ...config, area_color: colors.areaColor }))
                        setIsAreaOpen(false)
                        setDetections([])
                        setTrackedDetections(new Map())
                    }}
                />
            </FullScreenModal>
        </>
    )
}
