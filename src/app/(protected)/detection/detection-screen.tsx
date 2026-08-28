"use client"

import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group"
import { Film, ImagePlus, Tv } from "lucide-react";
import { useState } from "react";
import { PhotoDetectionSection } from "./photo-detection-section";
import { VideoDetectionSection } from "./video-detection-section";
import { StreamDetectionSection } from "./stream-detection-section";

export default function DetectionScreen() {
    const [selectedDetectionTab, setSelectedDetectionTab] = useState("photo");


    return (
        <main className="flex-1 max-w-6xl mx-auto w-full flex-col justify-between">

            <h1 className="text-3xl font-bold mb-8 pt-8">Detect & Track</h1>

            <ButtonGroup
                selectedKeys={[selectedDetectionTab]}
                onSelectionChange={(keys) =>
                    setSelectedDetectionTab(Array.from(keys)[0] as string)
                }
                className="pb-4"
            >
                <ButtonGroupItem
                    id="photo"
                    iconLeading={<ImagePlus />}
                >
                    Photo
                </ButtonGroupItem>

                <ButtonGroupItem
                    id="video"
                    iconLeading={<Film />}
                >
                    Video
                </ButtonGroupItem>

                <ButtonGroupItem
                    id="stream"
                    iconLeading={<Tv />}
                >
                    Stream
                </ButtonGroupItem>

            </ButtonGroup>

            <section className="p-6 bg-primary pt-4 shadow-xs ring-secondary ring-inset lg:rounded-xl lg:ring-1 ">
                {
                    selectedDetectionTab === "photo" ? (
                        <PhotoDetectionSection />
                    ) : selectedDetectionTab === "video" ? (
                        <VideoDetectionSection />
                    ): (
                        <StreamDetectionSection />
                    )}

                
            </section>

        </main>
    )
}