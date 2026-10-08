"use client"

import { ButtonGroup, ButtonGroupItem } from "@/components/base/button-group/button-group"
import { Film, ImagePlus, Tv } from "lucide-react";
import { PageHeader } from "@/components/custom/layout/page-header";
import { useState } from "react";
import { PhotoDetectionSection } from "./photo-detection-section";
import { VideoDetectionSection } from "./video-detection-section";
import { StreamDetectionSection } from "./stream-detection-section";
import { Camera01 } from "@untitledui/icons";

export default function DetectionScreen() {
    const [selectedDetectionTab, setSelectedDetectionTab] = useState<"photo" | "video" | "stream">("photo");

    return (
        <main className="flex-1 max-w-7xl mx-auto w-full flex-col justify-between">

            <PageHeader
                title="Detect, Track & Count"
                description="Detect, track and count objects in photos, videos and live streams."
                icon={<Camera01 />}
                actions={
                    <ButtonGroup
                        disallowEmptySelection
                        selectedKeys={[selectedDetectionTab]}
                        onSelectionChange={(keys) => {
                            const selectedTab = Array.from(keys)[0];

                            if (selectedTab === "photo" || selectedTab === "video" || selectedTab === "stream") {
                                setSelectedDetectionTab(selectedTab);
                            }
                        }}
                        className="max-w-full"
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
                }
            />

            <section className="rounded-xl border border-secondary bg-primary p-5 shadow-xs sm:p-6">
                {
                    selectedDetectionTab === "photo" ? (
                        <PhotoDetectionSection />
                    ) : selectedDetectionTab === "video" ? (
                        <VideoDetectionSection />
                    ) : (
                        <StreamDetectionSection />
                    )}


            </section>

        </main>
    )
}
