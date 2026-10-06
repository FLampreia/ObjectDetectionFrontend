import { Button } from "@/components/base/buttons/button"
import { AlgorithmSelect } from "@/components/custom/detection/algorithm-select"
import { FileUploadInput } from "@/components/custom/detection/file-upload-input"
import { MinConfidenceInput } from "@/components/custom/detection/min-confidence-input"
import { MultiSelectClassesBox } from "@/components/custom/detection/multi-select-class-box"
import { SelectTeamBox } from "@/components/custom/detection/select-team-box"
import { Camera01 } from "@untitledui/icons"
import { PenLine } from "lucide-react"
import { useRef, useState } from "react"
import { useAlgorithms } from "@/hooks/use-algorithms"
import { useFileDetection } from "@/hooks/use-file-detection"
import { TextResultDisplay } from "./text-results-display"
import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { DrawAreaModal } from "./draw-area-modal"
import { VideoDisplayBox } from "./video-display-box"

export function VideoDetectionSection() {
    const {
        file,
        setFile,
        imageUrl,
        setImageUrl,
        detections,
        setDetections,
        trackedDetections,
        setTrackedDetections,
        detectVideo,
        loading,
        selectedClasses,
        setSelectedClasses,

        area,
        setArea,
        line,
        setLine,

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

    const [videoUrl, setVideoUrl] = useState<string | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [videoInfo, setVideoInfo] = useState({
        width: 0,
        height: 0
    })

    const [videoDuration, setVideoDuration] = useState(0)
    const [videoCurrentTime, setVideoCurrentTime] = useState(0)

    async function extractFirstFrame(videoUrl: string): Promise<string> {
        return new Promise((resolve, reject) => {
            const video = document.createElement("video")

            video.src = videoUrl
            video.muted = true
            video.playsInline = true
            video.crossOrigin = "anonymous"

            video.onloadeddata = () => {
                video.currentTime = 0
            }

            video.onseeked = () => {
                const canvas = document.createElement("canvas")
                canvas.width = video.videoWidth
                canvas.height = video.videoHeight

                const ctx = canvas.getContext("2d")

                if (!ctx) {
                    reject("Unable to get canvas context")
                    return
                }

                ctx.drawImage(video, 0, 0)

                resolve(canvas.toDataURL("image/png"))
            }

            video.onerror = reject
        })
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">


                    <FileUploadInput
                        type="video"
                        accepted="MP4, MKV"
                        onFileSelect={async (file) => {
                            if (videoUrl) {
                                URL.revokeObjectURL(videoUrl)
                            }

                            const url = URL.createObjectURL(file)

                            setFile(file)
                            setVideoUrl(url)

                            const firstFrame = await extractFirstFrame(url)
                            setImageUrl(firstFrame)

                            setArea(null)
                            setLine(null)
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
                        onClick={async () => {
                            if (!videoRef.current) return
                            
                            // Reset video
                            videoRef.current.pause()

                            if (videoRef.current.currentTime !== 0) {
                                videoRef.current.currentTime = 0

                                await new Promise<void>((resolve) => {
                                    const video = videoRef.current!

                                    const handleSeeked = () => {
                                        video.removeEventListener("seeked", handleSeeked)
                                        resolve()
                                    }

                                    video.addEventListener("seeked", handleSeeked)
                                })
                            }

                            detectVideo(videoRef.current)
                        }}
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
                <VideoDisplayBox
                    videoRef={videoRef}
                    videoUrl={videoUrl}
                    area={area}
                    line={line}
                    detections={detections}
                    onImageLoad={(width, height) =>
                        setVideoInfo({
                            width,
                            height,
                        })
                    }
                    onDurationChange={setVideoDuration}
                    onCurrentTimeChange={setVideoCurrentTime}
                    loading={loading}
                />

                <TextResultDisplay
                    type="Video"
                    detections={detections}
                    trackedDetections={trackedDetections}
                    area={area}
                    line={line}
                    imageWidth={videoInfo.width}
                    imageHeight={videoInfo.height}
                    videoCurrentTime={videoCurrentTime}
                    videoDuration={videoDuration}
                />

            </section>

            <FullScreenModal
                isOpen={isAreaOpen}
                onClose={() => setIsAreaOpen(false)}
            >
                <DrawAreaModal
                    imageUrl={imageUrl}
                    area={area}
                    line={line}
                    onSave={(newArea, newLine) => {
                        setArea(newArea)
                        setLine(newLine)
                        setIsAreaOpen(false)
                        setDetections([])
                        setTrackedDetections(new Map())
                    }}
                />
            </FullScreenModal>
        </>
    )
}
