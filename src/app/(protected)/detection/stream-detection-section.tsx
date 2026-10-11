import { Button } from "@/components/base/buttons/button"
import { AlgorithmSelect } from "@/components/custom/detection/algorithm-select"
import { MinConfidenceInput } from "@/components/custom/detection/min-confidence-input"
import { MultiSelectClassesBox } from "@/components/custom/detection/multi-select-class-box"
import { SelectTeamBox } from "@/components/custom/detection/select-team-box"
import { Camera01 } from "@untitledui/icons"
import { PenLine, SlidersHorizontal, Tv } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAlgorithms } from "@/hooks/use-algorithms"
import { useFileDetection } from "@/hooks/use-file-detection"
import { TextResultDisplay } from "./text-results-display"
import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { DrawAreaModal } from "./draw-area-modal"
import { Select } from "@/components/base/select/select"
import { Input } from "@/components/base/input/input"
import { StreamDisplayBox } from "./stream-display-box"
import { Key } from "react-aria-components"
import { InlineFeedback } from "@/components/custom/layout/inline-feedback"

type StreamInputType = "camera" | "url"

export function StreamDetectionSection() {
    const {
        detections,
        setDetections,
        trackedDetections,
        setTrackedDetections,
        detectStream,
        stopStreamDetection,
        loading,
        detectionError,
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
    const [areaImageUrl, setAreaImageUrl] = useState<string | null>(null)

    const [inputType, setInputType] =
        useState<StreamInputType>("url")

    const [cameraId, setCameraId] = useState<string | null>(null)
    const [streamUrl, setStreamUrl] = useState("")
    const [connectedUrl, setConnectedUrl] = useState("")
    const [isConnecting, setIsConnecting] = useState(false)
    const [videoReady, setVideoReady] = useState(false)

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [cameraStream, setCameraStream] =
        useState<MediaStream | null>(null)

    const [cameras, setCameras] =
        useState<MediaDeviceInfo[]>([])

    const [videoInfo, setVideoInfo] = useState({
        width: 0,
        height: 0,
    })

    // Get available cameras
    useEffect(() => {
        if (inputType !== "camera") return

        async function getCameras() {
            try {
                const devices = await navigator.mediaDevices.enumerateDevices()

                const videoDevices = devices.filter(
                    device => device.kind === "videoinput"
                )

                setCameras(videoDevices)

                if (videoDevices.length > 0 && !cameraId) {
                    setCameraId(videoDevices[0].deviceId)
                }
            } catch (error) {
                console.error("Failed to enumerate cameras:", error)
                setCameras([])
                setCameraId(null)
            }
        }

        getCameras()
    }, [inputType])

    const captureCurrentFrame = () => {
        const video = videoRef.current

        if (!video || video.videoWidth === 0 || video.videoHeight === 0) {
            return null
        }

        const canvas = document.createElement("canvas")

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        const ctx = canvas.getContext("2d")

        if (!ctx) {
            return null
        }

        ctx.drawImage(
            video,
            0,
            0,
            video.videoWidth,
            video.videoHeight
        )

        return canvas.toDataURL("image/jpeg", 0.95)
    }

    const startCamera = async (deviceId: string) => {
        try {
            if (cameraStream) {
                cameraStream
                    .getTracks()
                    .forEach(track => track.stop())
            }

            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        deviceId: {
                            exact: deviceId,
                        },
                    },
                    audio: false,
                })

            setCameraStream(stream)

        } catch (error) {
            console.error(
                "Failed to start camera:",
                error
            )
        }
    }

    const handleDetect = async () => {
        if (!selectedAlgorithm) return

        if (inputType === "camera" && !cameraId) return
        if (inputType === "url" && !connectedUrl.trim()) return

        const video = videoRef.current

        if (!video) {
            console.error("Video element is not available")
            return
        }

        console.log("Starting detection:", {
            inputType,
            src: video.src,
            currentSrc: video.currentSrc,
            videoWidth: video.videoWidth,
            videoHeight: video.videoHeight,
            readyState: video.readyState,
        })

        await detectStream(video)
    }

    const handleInputTypeChange = (key: Key | null) => {
        if (key !== "camera" && key !== "url") {
            return
        }

        // URL -> Camera
        if (key === "camera") {
            if (connectedUrl) {
                setConnectedUrl("")
            }

            setVideoReady(false)
        }

        // Camera -> URL
        if (key === "url") {
            if (cameraStream) {
                cameraStream
                    .getTracks()
                    .forEach(track => track.stop())

                setCameraStream(null)
            }

            setCameraId(null)
            setVideoReady(false)
        }

        setInputType(key)
    }

    const canDetect =
        !loading &&
        videoReady &&
        !!selectedAlgorithm &&
        (
            inputType === "camera"
                ? !!cameraId
                : !!connectedUrl.trim()
        ) &&
        (
            selectedClasses === "all" ||
            (
                selectedClasses instanceof Set &&
                selectedClasses.size > 0
            )
        )

    return (
        <>
            {detectionError && <InlineFeedback>{detectionError}</InlineFeedback>}
            <section aria-labelledby="stream-configuration-title" className="overflow-hidden rounded-xl border border-secondary bg-primary">
                <div className="flex items-start gap-3 border-b border-secondary bg-secondary px-5 py-4">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-secondary bg-primary text-brand-secondary">
                        <SlidersHorizontal className="size-4" aria-hidden="true" />
                    </div>
                    <div>
                        <h2 id="stream-configuration-title" className="text-sm font-semibold text-primary">Stream configuration</h2>
                        <p className="mt-1 text-sm text-tertiary">Connect a camera or stream and choose how to detect its objects.</p>
                    </div>
                </div>
                <div className="grid grid-cols-1 items-start gap-x-6 gap-y-5 p-5 sm:grid-cols-2 xl:grid-cols-6">

                    {/* Input type */}

                    <div className="min-w-0 xl:col-span-2">
                        <Select
                            isRequired
                            size="md"
                            label="1. Select the Input Type"
                            placeholder="Select an input"
                            value={inputType}
                            onChange={handleInputTypeChange}
                        >

                            <Select.Item id="url">
                                URL
                            </Select.Item>

                            <Select.Item id="camera">
                                Camera
                            </Select.Item>


                        </Select>
                    </div>

                    <div className="min-w-0 sm:col-span-2 xl:col-span-4">
                        {/* Camera */}
                        {inputType === "camera" && (
                            <Select
                                isRequired
                                size="md"
                                label="Select the Camera"
                                placeholder="Select a camera"
                                key={cameraId ?? undefined}
                                onChange={key => {
                                    if (!key) {
                                        setCameraId(null)
                                        return
                                    }

                                    const deviceId = String(key)

                                    setCameraId(deviceId)
                                    startCamera(deviceId)
                                }}
                            >
                                {cameras.map(camera => (
                                    <Select.Item
                                        key={camera.deviceId}
                                        id={camera.deviceId}
                                    >
                                        {camera.label ||
                                            `Camera ${camera.deviceId.slice(0, 5)}`}
                                    </Select.Item>
                                ))}
                            </Select>
                        )}

                        {/* URL */}
                        {inputType === "url" && (
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                                <Input
                                    isRequired
                                    label="Stream URL"
                                    type="url"
                                    value={streamUrl}
                                    onChange={setStreamUrl}
                                    placeholder="rtsp://..."
                                    className="min-w-0 flex-1"
                                    isDisabled={!!connectedUrl}
                                />

                                {connectedUrl ? (
                                    <Button
                                        size="md"
                                        color="secondary"
                                        onClick={() => {
                                            setConnectedUrl("")
                                            setVideoReady(false)
                                        }}
                                    >
                                        Disconnect
                                    </Button>
                                ) : (
                                    <Button
                                        size="md"
                                        color="secondary"
                                        isDisabled={!streamUrl.trim() || isConnecting}
                                        onClick={() => {
                                            setConnectedUrl(streamUrl.trim())
                                        }}
                                    >
                                        {isConnecting ? "Connecting..." : "Connect"}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                    <div className="min-w-0 xl:col-span-3">
                        <AlgorithmSelect
                            algorithms={algorithms}
                            selectedAlgorithm={selectedAlgorithm}
                            onAlgorithmChange={setSelectedAlgorithm}
                        />
                    </div>
                    <div className="min-w-0 xl:col-span-3">
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
                            onChange={confValue => {
                                setMinConfidence(confValue)
                            }}
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-end gap-3 border-t border-secondary px-5 py-4">

                    <Button
                        iconLeading={<PenLine />}
                        color="secondary"
                        onClick={() => {
                            const frame = captureCurrentFrame()

                            if (!frame) {
                                return
                            }

                            setAreaImageUrl(frame)
                            setIsAreaOpen(true)
                        }}
                        isDisabled={loading || !videoReady}
                    >
                        Define Area
                    </Button>

                    {loading ? (
                        <Button
                            color="secondary"
                            onClick={stopStreamDetection}
                        >
                            Stop Detection
                        </Button>
                    ) : (
                        <Button
                            iconLeading={<Camera01 />}
                            onClick={handleDetect}
                            isDisabled={!canDetect}
                        >
                            Start Detection
                        </Button>
                    )}
                </div>
            </section>

            <div className="mt-6 flex w-full flex-col gap-6">
                <section aria-labelledby="stream-preview-title" className="min-w-0">
                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h2 id="stream-preview-title" className="flex items-center gap-2 text-sm font-semibold text-primary">
                            <Tv className="size-4 text-tertiary" aria-hidden="true" />
                            Live preview
                        </h2>
                        <p role="status" className="text-sm text-tertiary">
                            {loading ? "Detection running" : videoReady ? "Ready to detect" : "Connect a source to get started"}
                        </p>
                    </div>
                    <StreamDisplayBox
                        colors={drawingColors}
                        videoRef={videoRef}
                        videoStream={cameraStream}
                        streamUrl={inputType === "url" ? connectedUrl : ""}
                        area={area}
                        line={line}
                        detections={detections}
                        loading={loading}
                        onVideoReady={setVideoReady}
                        onImageLoad={(width, height) =>
                            setVideoInfo({
                                width,
                                height,
                            })
                        }
                    />
                </section>

                <TextResultDisplay
                    layout="expanded"
                    type="Stream"
                    detections={detections}
                    trackedDetections={trackedDetections}
                    area={area}
                    line={line}
                    imageWidth={videoInfo.width}
                    imageHeight={videoInfo.height}
                />
            </div>

            <FullScreenModal
                isOpen={isAreaOpen}
                onClose={() => {
                    setIsAreaOpen(false)
                    setAreaImageUrl(null)
                }}
            >
                <DrawAreaModal
                    colors={drawingColors}
                    imageUrl={areaImageUrl}
                    area={area}
                    line={line}
                    onSave={(newArea, newLine, colors) => {
                        setArea(newArea)
                        setLine(newLine)
                        setDrawingColors(colors)
                        setIsAreaOpen(false)
                        setAreaImageUrl(null)
                        setDetections([])
                        setTrackedDetections(new Map())
                    }}
                />
            </FullScreenModal>
        </>
    )
}
