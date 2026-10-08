import { Button } from "@/components/base/buttons/button"
import { AlgorithmSelect } from "@/components/custom/detection/algorithm-select"
import { FileUploadInput } from "@/components/custom/detection/file-upload-input"
import { MinConfidenceInput } from "@/components/custom/detection/min-confidence-input"
import { MultiSelectClassesBox } from "@/components/custom/detection/multi-select-class-box"
import { SelectTeamBox } from "@/components/custom/detection/select-team-box"
import { Camera01 } from "@untitledui/icons"
import { Film, PenLine, SlidersHorizontal } from "lucide-react"
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
        drawingColors,
        setDrawingColors,

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
            <section aria-labelledby="video-configuration-title" className="overflow-hidden rounded-xl border border-secondary bg-primary">
                <div className="flex items-start gap-3 border-b border-secondary bg-secondary px-5 py-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-secondary bg-primary text-brand-secondary">
                        <SlidersHorizontal className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 id="video-configuration-title" className="text-sm font-semibold text-primary">Video configuration</h2>
                        <p className="mt-1 text-sm text-tertiary">Upload a video and choose how to detect and track its objects.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 p-5 sm:grid-cols-2 xl:grid-cols-6">
                    <div className="min-w-0 xl:col-span-2">
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
                        isLoading={loading}
                        showTextWhileLoading
                    >
                        {loading ? "Detecting..." : "Detect"}
                    </Button>

                </div>
            </section>

            <div className="mt-6 flex w-full flex-col gap-6">
                <section aria-labelledby="video-preview-title" className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h2 id="video-preview-title" className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <Film className="size-4 text-tertiary" aria-hidden="true" />
                            Video preview
                        </h2>
                        {file && <p className="min-w-0 break-all text-sm text-tertiary">{file.name}</p>}
                    </div>
                    <VideoDisplayBox
                        colors={drawingColors}
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
                </section>

                <TextResultDisplay
                    layout="expanded"
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

            </div>

            <FullScreenModal
                isOpen={isAreaOpen}
                onClose={() => setIsAreaOpen(false)}
            >
                <DrawAreaModal
                    colors={drawingColors}
                    imageUrl={imageUrl}
                    area={area}
                    line={line}
                    onSave={(newArea, newLine, colors) => {
                        setArea(newArea)
                        setLine(newLine)
                        setDrawingColors(colors)
                        setIsAreaOpen(false)
                        setDetections([])
                        setTrackedDetections(new Map())
                    }}
                />
            </FullScreenModal>
        </>
    )
}
