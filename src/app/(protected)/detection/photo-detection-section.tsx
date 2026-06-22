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

    return (
        <>
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center">

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
            <section className="mt-4 flex justify-center">
                <ImageDisplayBox imageUrl={imageUrl} detections={detections} />
            </section>
        </>
    )
}