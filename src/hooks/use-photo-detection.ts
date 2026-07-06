import { detectImage } from "@/services/detect"
import { Detection, Area, AlgorithmObj } from "@/types"
import { cocoClassesItems } from "@/utils/coco-classes"
import { useEffect, useState } from "react"
import type { Selection } from "react-aria-components"

function cropImage(file: File, area: Area): Promise<File> {
    return new Promise((resolve, reject) => {

        const img = new Image()

        img.onload = () => {

            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")
            if (!ctx) return reject("No context")

            const { naturalWidth, naturalHeight } = img

            const x = Math.min(area.x1, area.x2) * naturalWidth
            const y = Math.min(area.y1, area.y2) * naturalHeight
            const w = Math.abs(area.x2 - area.x1) * naturalWidth
            const h = Math.abs(area.y2 - area.y1) * naturalHeight

            canvas.width = w
            canvas.height = h

            ctx.drawImage(
                img,
                x, y, w, h,
                0, 0, w, h
            )

            canvas.toBlob((blob) => {
                if (!blob) return reject("No blob")

                const croppedFile = new File([blob], file.name, {
                    type: "image/jpeg",
                })

                resolve(croppedFile)
            }, "image/jpeg")
        }

        img.onerror = reject
        img.src = URL.createObjectURL(file)
    })
}



export function usePhotoDetection() {
    const [file, setFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const [area, setArea] = useState<Area | null>(null)
    const [detections, setDetections] = useState<Detection[]>([])
    const [loading, setLoading] = useState(false)

    const [minConfidence, setMinConfidence] = useState<number>(80)

    const [selectedClasses, setSelectedClasses] = useState<Selection>("all")

    const [selectedAlgorithm, setSelectedAlgorithm] = useState<string | null>(null)

    const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null)

    useEffect(() => {
        if (!file) return

        setDetections([])

        const url = URL.createObjectURL(file)
        setImageUrl(url)

        return () => {
            URL.revokeObjectURL(url)
        }
    }, [file])


    const detect = async () => {
        if (!file) return

        setLoading(true)

        try {
            let fileToSend = file

            if (area) {
                fileToSend = await cropImage(file, area)
            }

            const formData = new FormData()
            formData.append("image", fileToSend)

            Array.from(selectedClasses as Set<number>).forEach((id) => {
                formData.append("chosen_class_id", String(id))
            })

            if (selectedAlgorithm) {
                formData.append("algorithm", selectedAlgorithm)
            }

            if (selectedTeamId) {
                formData.append("chosen_team_id", selectedTeamId)
            }

            if (minConfidence !== null) {
                formData.append("conf_threshold", String(minConfidence / 100))
            }

            const data = await detectImage(formData)

            setDetections(data?.detections ?? [])
        } finally {
            setLoading(false)
        }
    }


    return {
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
    }
}