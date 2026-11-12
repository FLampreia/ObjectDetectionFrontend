"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ScanLine } from "lucide-react";
import detectionPreview1 from "../../../../public/images/pessoas1.png";
import detectionPreview2 from "../../../../public/images/vaca1.png";
import detectionPreview3 from "../../../../public/images/carros1.png";

const images = [
  {
    src: detectionPreview1,
    title: "People detection",
    description: "People identified in a city square, with a bounding box around each detection.",
    alt: "Example of object detection on a city square, with labeled people.",
  },
  {
    src: detectionPreview2,
    title: "Cattle detection",
    description: "Cows identified in a field, showing how object detection can support livestock monitoring.",
    alt: "Example of object detection field with labeled cows.",
  },
    {
    src: detectionPreview3,
    title: "Detection within a selected area",
    description: "People and vehicles identified on a city street within a defined area of analysis.",
    alt: "Example of object detection with a defined area on a city street, with labeled people and vehicles .",
  },
];

const slides = [...images, images[0]];

type ExampleCarouselProps = {
  id?: string;
  className?: string;
  intervalMs?: number;
  sizes?: string;
  preload?: boolean;
};

export default function ExampleCarousel({
  id,
  className = "",
  intervalMs = 5000,
  sizes = "(max-width: 1023px) calc(100vw - 48px), 560px",
  preload = false,
}: ExampleCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [timerCycle, setTimerCycle] = useState(0);
  const prefersReducedMotion = useReducedMotion();
  const durationMs = Math.max(intervalMs, 1000);
  const selectedIndex = activeIndex % images.length;

  useEffect(() => {
    if (prefersReducedMotion) return;

    const timeout = window.setTimeout(() => {
      setIsResetting(false);
      setActiveIndex((current) => Math.min(current + 1, images.length));
      setTimerCycle((current) => current + 1);
    }, durationMs);

    return () => window.clearTimeout(timeout);
  }, [durationMs, prefersReducedMotion, timerCycle]);

  const selectImage = (index: number) => {
    setIsResetting(false);
    setActiveIndex(index);
    setTimerCycle((current) => current + 1);
  };

  return (
    <figure id={id} className={`min-w-0 scroll-mt-28 overflow-hidden rounded-2xl border border-primary bg-primary shadow-xl ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-secondary px-5 py-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-primary">
          <ScanLine aria-hidden="true" className="size-4 shrink-0 text-brand-secondary" />
          {images[selectedIndex].title}
        </div>
        <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary">Example result</span>
      </div>
      <div className="relative w-full overflow-hidden">
        <div
          className={`flex w-full ease-in-out ${isResetting || prefersReducedMotion ? "transition-none" : "transition-transform duration-500"}`}
          style={{ transform: `translateX(-${activeIndex * 100}%)` }}
          onTransitionEnd={(event) => {
            if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
            if (activeIndex === images.length) {
              setIsResetting(true);
              setActiveIndex(0);
            }
          }}
        >
          {slides.map((image, index) => (
            <div
              key={`${image.src.src}-${index}`}
              className="relative w-full shrink-0"
              style={{ aspectRatio: `${detectionPreview1.width} / ${detectionPreview1.height}` }}
              aria-hidden={index !== activeIndex}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes={sizes}
                preload={preload && index === 0}
                loading={preload && index === 0 ? undefined : "eager"}
                className="object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute inset-x-0 bottom-2 flex justify-center">
          <div className="flex flex-col items-center rounded-full bg-black/55 px-2 py-1 shadow-sm backdrop-blur-sm">
            <div role="group" aria-label="Choose a preview image" className="flex items-center">
              {images.map((image, index) => (
                <button
                  key={image.src.src}
                  type="button"
                  aria-label={`Show image ${index + 1} of ${images.length}`}
                  aria-pressed={selectedIndex === index}
                  onClick={() => selectImage(index)}
                  className="flex size-6 cursor-pointer items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <span
                    className={`size-1.5 rounded-full transition-colors motion-reduce:transition-none ${selectedIndex === index ? "bg-white" : "bg-white/40 hover:bg-white/75"}`}
                  />
                </button>
              ))}
            </div>
            {!prefersReducedMotion && (
              <div aria-hidden="true" className="h-0.5 w-12 overflow-hidden rounded-full bg-white/25">
                <motion.div
                  key={`${timerCycle}-${durationMs}`}
                  className="h-full origin-left rounded-full bg-white"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: durationMs / 1000, ease: "linear" }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <figcaption className="border-t border-secondary px-5 py-4 text-sm leading-6 text-tertiary">
        <p className="line-clamp-2 h-12">{images[selectedIndex].description}</p>
      </figcaption>
    </figure>
  );
}
