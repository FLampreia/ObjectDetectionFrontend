import { ScanLine } from "lucide-react";
import { Link } from "react-aria-components";

export function NavigationBrand() {
    return (
        <Link
            href="/dashboard"
            aria-label="ObjectDetection dashboard"
            className="flex min-w-0 items-center gap-3 rounded-lg outline-focus-ring focus-visible:outline-2 focus-visible:outline-offset-4"
        >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-white shadow-xs">
                <ScanLine aria-hidden="true" className="size-5" />
            </span>

            <span className="min-w-0">
                <span className="block text-md font-semibold tracking-tight text-primary">ObjectDetection</span>
                <span className="block text-xs text-tertiary">Detect. Track. Count.</span>
            </span>
        </Link>
    );
}
