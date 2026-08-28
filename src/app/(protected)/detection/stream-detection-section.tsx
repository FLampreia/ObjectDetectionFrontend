import { Button } from "@/components/base/buttons/button"
import { AlgorithmSelect } from "@/components/custom/detection/algorithm-select"
import { MinConfidenceInput } from "@/components/custom/detection/min-confidence-input"
import { MultiSelectClassesBox } from "@/components/custom/detection/multi-select-class-box"
import { SelectTeamBox } from "@/components/custom/detection/select-team-box"
import { Camera01 } from "@untitledui/icons"
import { PenLine } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { useAlgorithms } from "@/hooks/use-algorithms"
import { useFileDetection } from "@/hooks/use-file-detection"
import { TextResultDisplay } from "./text-results-display"
import { FullScreenModal } from "@/components/custom/detection/full-screen-modal"
import { DrawArea } from "./draw-area"
import { Select } from "@/components/base/select/select"
import { Input } from "@/components/base/input/input"
import { StreamDisplayBox } from "./stream-display-box"
import { Key } from "react-aria-components"

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
    const [areaImageUrl, setAreaImageUrl] = useState<string | null>(null)

    const [inputType, setInputType] =
        useState<StreamInputType>("url")

    const [cameraId, setCameraId] = useState<string | null>(null)
    const [streamUrl, setStreamUrl] = useState("")
    const [connectedUrl, setConnectedUrl] = useState("")
    const [isConnecting, setIsConnecting] = useState(false)

    const videoRef = useRef<HTMLVideoElement | null>(null);

    const [cameraStream, setCameraStream] =
        useState<MediaStream | null>(null)

    const [cameras, setCameras] =
        useState<MediaDeviceInfo[]>([])

    const [videoInfo, setVideoInfo] = useState({
        width: 0,
        height: 0,
    })

    const [videoDuration, setVideoDuration] = useState(0)
    const [videoCurrentTime, setVideoCurrentTime] = useState(0)

    // Get available cameras
    useEffect(() => {
        if (inputType !== "camera") return

        async function getCameras() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                })

                stream.getTracks().forEach(track => track.stop())

                const devices =
                    await navigator.mediaDevices.enumerateDevices()

                const videoDevices = devices.filter(
                    device => device.kind === "videoinput"
                )

                setCameras(videoDevices)

                if (
                    videoDevices.length > 0 &&
                    !cameraId
                ) {
                    setCameraId(videoDevices[0].deviceId)
                }

            } catch (error) {
                console.error(
                    "Failed to access cameras:",
                    error
                )

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

        if (inputType === "camera" && !cameraId) {
            return
        }

        if (inputType === "url" && !connectedUrl.trim()) {
            return
        }

        const video = videoRef.current

        if (!video) {
            return
        }

        await detectStream(video)
    }

    const handleInputTypeChange = (key: Key | null) => {
        if (key !== "camera" && key !== "url") {
            return
        }

        if (key === "url" && cameraStream) {
            cameraStream
                .getTracks()
                .forEach(track => track.stop())

            setCameraStream(null)
            setCameraId(null)
        }

        setInputType(key)
    }

    const canDetect =
        !loading &&
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
            <div className="flex flex-col gap-4">

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">

                    {/* Input type */}

                    <Select
                        isRequired
                        size="md"
                        label="1. Select the Input"
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
                        <div className="flex items-end gap-2">
                            <Input
                                isRequired
                                label="Stream URL"
                                type="url"
                                value={streamUrl}
                                onChange={setStreamUrl}
                                placeholder="rtsp://..."
                                className="flex-1"
                            />

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
                        </div>
                    )}

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
                        onChange={confValue => {
                            setMinConfidence(confValue)
                        }}
                    />
                </div>

                <div className="flex flex-wrap gap-4 justify-end">

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
                        isDisabled={loading || !cameraStream}
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
            </div >

            <section className="mt-4 grid grid-cols-1 lg:grid-cols-[13fr_7fr] gap-4 w-full items-start">

                <StreamDisplayBox
                    videoRef={videoRef}
                    videoStream={cameraStream}
                    streamUrl={inputType === "url" ? connectedUrl : ""}
                    area={area}
                    detections={detections}
                    loading={loading}
                    onImageLoad={(width, height) =>
                        setVideoInfo({
                            width,
                            height,
                        })
                    }
                />

                <TextResultDisplay
                    type="Stream"
                    detections={detections}
                    trackedDetections={trackedDetections}
                    area={area}
                    imageWidth={videoInfo.width}
                    imageHeight={videoInfo.height}
                    videoCurrentTime={videoCurrentTime}
                />
            </section>

            <FullScreenModal
                isOpen={isAreaOpen}
                onClose={() => {
                    setIsAreaOpen(false)
                    setAreaImageUrl(null)
                }}
            >
                <DrawArea
                    imageUrl={areaImageUrl}
                    onSave={area => {
                        setArea(area)
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