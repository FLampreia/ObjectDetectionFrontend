"use client"

import { FileUploadInput } from "@/components/custom/detection/file-upload-input"
import { MultiSelectClassesBox } from "@/components/custom/detection/multi-select-class-box"
import { useState } from "react"
import { ImageDisplayBox } from "./image-display-box"
import { Button } from "@/components/base/buttons/button"
import { PenLine } from "lucide-react"
import { Camera01 } from "@untitledui/icons"
import { useFileDetection } from "@/hooks/use-file-detection"
import { TextResultDisplay } from "./text-results-display"
import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { DrawAreaModal } from "./draw-area-modal"
import { AlgorithmSelect } from "@/components/custom/detection/algorithm-select"
import { MinConfidenceInput } from "@/components/custom/detection/min-confidence-input"
import { useAlgorithms } from "@/hooks/use-algorithms"
import { SelectTeamBox } from "@/components/custom/detection/select-team-box"

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
    const [imageSize, setImageSize] = useState({
        width: 0,
        height: 0,
    })

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">


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

                    <AlgorithmSelect
                        algorithms={algorithms}
                        selectedAlgorithm={selectedAlgorithm}
                        onAlgorithmChange={setSelectedAlgorithm}
                    />

                    <MultiSelectClassesBox
                        selectedKeys={selectedClasses}
                        onSelectionChange={setSelectedClasses}
                    />

                    <SelectTeamBox
                        selectedTeamId={selectedTeamId}
                        onTeamChange={setSelectedTeamId}
                    />


                    <MinConfidenceInput
                        value={minConfidence}
                        onChange={(confValue) => {
                            setMinConfidence(confValue)
                        }}
                    />
                </div>

                <div className="flex flex-wrap gap-4 justify-end">
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
                    >
                        {loading ? "Detecting..." : "Detect"}
                    </Button>

                </div>
            </div>

            <section className="mt-4 grid grid-cols-1 lg:grid-cols-[13fr_7fr] gap-4 w-full items-start">
                <ImageDisplayBox
                    imageUrl={imageUrl}
                    detections={detections}
                    area={area}
                    onImageLoad={(width, height) =>
                        setImageSize({
                            width,
                            height,
                        })
                    }
                />

                <TextResultDisplay
                    type="Image"
                    detections={detections}
                    area={area}
                    imageWidth={imageSize.width}
                    imageHeight={imageSize.height}
                />

            </section>

            <FullScreenModal
                isOpen={isAreaOpen}
                onClose={() => setIsAreaOpen(false)}
            >
                <DrawAreaModal
                    imageUrl={imageUrl}
                    area={area}
                    onSave={(newArea) => {
                        setArea(newArea)
                        setIsAreaOpen(false)
                        setDetections([])
                        setTrackedDetections(new Map())
                    }}
                />
            </FullScreenModal>
        </>
    )
}