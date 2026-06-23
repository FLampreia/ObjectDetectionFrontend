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

export function PhotoDetectionSection() {
    const {
        file,
        setFile,
        imageUrl,
        detections,
        detect,
        loading,
        selectedClasses,
        setSelectedClasses,
    } = usePhotoDetection()

    const [isAreaOpen, setIsAreaOpen] = useState(false)
    const [area, setArea] = useState<Area | null>(null)

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center justify-center">

                <div className="flex-1">
                    <FileUploadInput
                        type="photo"
                        onFileSelect={(file) => {
                            setFile(file)
                        }}
                    />
                </div>

                <div className="flex-1">
                    <MultiSelectClassesBox
                        selectedKeys={selectedClasses}
                        onSelectionChange={setSelectedClasses}
                    />
                </div>

                <div className="flex-1">
                    <SelectTeamBox />
                </div>

                <div className="flex gap-4">
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
                        isDisabled={!file || loading}
                    >
                        {loading ? "Detecting..." : "Detect"}
                    </Button>
                </div>
            </div>

            <section className="mt-4 grid grid-cols-1 lg:grid-cols-[13fr_7fr] gap-4 w-full items-start">
                <ImageDisplayBox imageUrl={imageUrl} detections={detections} />

                <TextResultDisplay detections={detections} />

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
                    }}
                />
            </FullScreenModal>
        </>
    )
}