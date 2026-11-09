"use client";

import Image from "next/image";
import {
    Activity,
    ArrowRight,
    Check,
    Cpu,
    FileBarChart,
    Filter,
    ImagePlus,
    Map,
    ScanLine,
    Users,
    Video,
} from "lucide-react";
import Header from "@/components/custom/layout/header";
import FeatureCard from "@/components/custom/welcome/featureCard";
import { Button } from "@/components/base/buttons/button";
import { useAuth } from "@/hooks/use-auth";
import detectionPreview from "../../public/images/detections_test_image.png";

const features = [
    {
        title: "Your model, your choice",
        desc: "Choose from the available YOLO models to suit your detection task.",
        icon: Cpu,
    },
    {
        title: "Focus on what matters",
        desc: "Filter object classes and count only the objects you need.",
        icon: Filter,
    },
    {
        title: "Photos, videos & streams",
        desc: "Analyze a single image, a recorded video or a live stream.",
        icon: Video,
    },
    {
        title: "Visual detection results",
        desc: "Inspect detected objects, confidence scores and tracking results.",
        icon: Activity,
    },
    {
        title: "Custom counting zones",
        desc: "Define an area of interest to focus detection on part of the frame.",
        icon: Map,
    },
    {
        title: "Work together",
        desc: "Organize your teams and share detection results with team members.",
        icon: Users,
    },
];

const steps = [
    {
        title: "Choose a model",
        desc: "Select a model and adjust the confidence threshold.",
        icon: Cpu,
    },
    {
        title: "Set your focus",
        desc: "Choose object classes and an optional detection area.",
        icon: Filter,
    },
    {
        title: "Add your source",
        desc: "Upload a photo or video, or connect a live stream.",
        icon: ImagePlus,
    },
    {
        title: "Explore the results",
        desc: "Review detections and export reports for your records.",
        icon: FileBarChart,
    },
];

export const WelcomeScreen = () => {
    const { user } = useAuth();
    const destination = user ? "/dashboard" : "/auth";
    const actionLabel = user ? "Open dashboard" : "Get started";

    return (
        <div className="min-h-screen text-primary">
            <Header />

            <main className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                <section aria-labelledby="welcome-title" className="grid items-center gap-12 py-12 sm:py-16 lg:grid-cols-2 lg:gap-14 lg:py-24">
                    <div>
                        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full bg-brand-solid px-4 py-2 text-sm font-semibold text-white shadow-xs">
                            <ScanLine aria-hidden="true" className="size-5 shrink-0" />
                            Object detection & tracking
                        </div>

                        <h1 id="welcome-title" className="max-w-xl text-display-md font-semibold tracking-tight text-primary sm:text-display-lg xl:text-display-xl">
                            Turn visual data into <span className="text-brand-secondary">clear insights.</span>
                        </h1>
                        <p className="mt-6 max-w-lg text-md leading-7 text-tertiary sm:text-lg">
                            Detect, track and count objects in photos, videos and live streams.
                            Keep your results organized and share them with your team.
                        </p>

                        <div className="mt-8 flex flex-wrap gap-3">
                            <Button href={destination} size="xl" iconTrailing={ArrowRight}>
                                {actionLabel}
                            </Button>
                            <Button href="#workflow" size="xl" color="secondary">
                                How it works
                            </Button>
                        </div>

                        <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm text-tertiary">
                            {["Flexible YOLO models", "Custom object filters", "Exportable reports"].map((label) => (
                                <li key={label} className="flex items-center gap-2">
                                    <Check aria-hidden="true" className="size-4 text-brand-secondary" />
                                    {label}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <figure id="demo" className="min-w-0 scroll-mt-28 overflow-hidden rounded-2xl border border-primary bg-primary shadow-xl">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary px-5 py-4">
                            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                                <ScanLine aria-hidden="true" className="size-4 text-brand-secondary" />
                                Detection preview
                            </div>
                            <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary">Example result</span>
                        </div>

                        <Image
                            src={detectionPreview}
                            alt="Example of object detection on a city street, with boxes identifying people, vehicles and traffic lights."
                            sizes="(max-width: 1023px) calc(100vw - 48px), 560px"
                            preload
                            className="h-auto w-full"
                        />

                        <figcaption className="border-t border-secondary px-5 py-4 text-sm leading-6 text-tertiary">
                            See what was detected, where it appears and how objects are classified.
                        </figcaption>
                    </figure>
                </section>

                <section id="features" aria-labelledby="features-title" className="scroll-mt-28 border-t-2 border-primary py-12 sm:py-16">
                    <div className="mb-8 max-w-2xl">
                        <p className="text-sm font-semibold text-brand-secondary">Built around your workflow</p>
                        <h2 id="features-title" className="mt-2 text-display-xs font-semibold tracking-tight text-primary sm:text-display-sm">
                            From detection to understanding.
                        </h2>
                        <p className="mt-3 text-md leading-7 text-tertiary">
                            The tools to configure your analysis, inspect results and collaborate in one place.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {features.map((feature) => <FeatureCard key={feature.title} {...feature} />)}
                    </div>
                </section>

                <section id="workflow" aria-labelledby="workflow-title" className="scroll-mt-28 border-t-2 border-primary py-12 sm:py-16">
                    <div className="mb-8 max-w-2xl">
                        <p className="text-sm font-semibold text-brand-secondary">How it works</p>
                        <h2 id="workflow-title" className="mt-2 text-display-xs font-semibold tracking-tight text-primary sm:text-display-sm">
                            A clear path from source to results.
                        </h2>
                        <p className="mt-3 text-md leading-7 text-tertiary">
                            Configure your detection and start exploring in four steps.
                        </p>
                    </div>

                    <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {steps.map(({ title, desc, icon: Icon }, index) => (
                            <li key={title} className="rounded-xl border border-secondary bg-primary p-5 shadow-xs">
                                <div className="mb-6 flex items-center justify-between">
                                    <span className="flex size-9 items-center justify-center rounded-lg bg-brand-solid text-sm font-semibold text-white">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                    <Icon aria-hidden="true" className="size-5 text-tertiary" />
                                </div>
                                <h3 className="text-md font-semibold text-primary">{title}</h3>
                                <p className="mt-2 text-sm leading-6 text-tertiary">{desc}</p>
                            </li>
                        ))}
                    </ol>
                </section>

                <section aria-labelledby="get-started-title" className="mb-12 flex flex-col gap-6 rounded-2xl border border-brand/30 bg-primary p-6 shadow-xs sm:p-8 lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start gap-4">
                        <div className="hidden size-12 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-white sm:flex">
                            <ScanLine aria-hidden="true" className="size-6" />
                        </div>
                        <div>
                            <h2 id="get-started-title" className="text-xl font-semibold text-primary">Ready to explore your visual data?</h2>
                            <p className="mt-2 text-sm leading-6 text-tertiary">Start a detection and keep your results, teams and reports together.</p>
                        </div>
                    </div>
                    <Button href={destination} size="lg" iconTrailing={ArrowRight} className="w-full sm:w-auto lg:shrink-0">
                        {actionLabel}
                    </Button>
                </section>
            </main>

            <footer className="border-t border-primary bg-primary">
                <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-tertiary sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
                    <p>ObjectDetection {new Date().getFullYear()}</p>
                    <p>Developed by Francisco Lampreia</p>
                </div>
            </footer>
        </div>
    );
};
