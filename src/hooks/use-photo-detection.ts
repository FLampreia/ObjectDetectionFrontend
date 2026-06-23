import { detectImage } from "@/services/detect"
import { Detection } from "@/types"
import { useEffect, useState } from "react"
import type { Selection } from "react-aria-components"

export function usePhotoDetection() {
    const [file, setFile] = useState<File | null>(null)
    const [imageUrl, setImageUrl] = useState<string | null>(null)

    const [detections, setDetections] = useState<Detection[]>([])
    const [loading, setLoading] = useState(false)

    const [selectedClasses, setSelectedClasses] = useState<Selection>(new Set())


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
            const formData = new FormData()
            formData.append("image", file)

            Array.from(selectedClasses as Set<number>).forEach((id) => {
                formData.append("chosen_class_id", String(id))
            })

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
        detect,
        loading,

        selectedClasses,
        setSelectedClasses,
    }
}