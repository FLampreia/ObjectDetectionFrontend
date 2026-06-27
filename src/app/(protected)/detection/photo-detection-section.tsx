"use client"

import { FileUploadInput } from "@/components/custom/file-upload-input"
import { MultiSelectClassesBox } from "@/components/custom/multi-select-class-box"
import { useEffect, useState } from "react"
import { ImageDisplayBox } from "./image-display-box"
import { Button } from "@/components/base/buttons/button"
import { PenLine } from "lucide-react"
import { SelectTeamBox } from "@/components/custom/select-team-box"
import { Camera01 } from "@untitledui/icons"
import { usePhotoDetection } from "@/hooks/use-photo-detection"
import { TextResultDisplay } from "./text-results-display"
import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { DrawArea } from "./draw-area"
import { Area } from "@/types"
import { AlgorithmSelect } from "@/components/custom/algorithm-select"
import { MinConfidenceInput } from "@/components/custom/min-confidence-input"
import { useAlgorithms } from "@/hooks/use-algorithms"

export function PhotoDetectionSection() {
    const {
        file,
        setFile,
        imageUrl,
        detections,
        setDetections,
        detect,
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
    } = usePhotoDetection()

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
                        onFileSelect={(file) => {
                            setFile(file)
                            setArea(null)
                            setDetections([])
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
                        onClick={detect}
                        isDisabled={!file || loading || !selectedAlgorithm}
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
                <DrawArea
                    imageUrl={imageUrl}
                    onSave={(area) => {
                        setArea(area)
                        setIsAreaOpen(false)
                        setDetections([])
                    }}
                />
            </FullScreenModal>
        </>
    )
}