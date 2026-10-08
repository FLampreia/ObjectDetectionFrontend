import { FileUp, Radio } from "lucide-react";

export function EmptyFile({ source = "file" }: { source?: "file" | "stream" }) {
    const Icon = source === "stream" ? Radio : FileUp;
    return (
        <div className="flex flex-col items-center gap-3 px-5 py-8 text-center">
            <div aria-hidden="true" className="flex size-12 items-center justify-center rounded-xl border border-secondary bg-secondary">
                <Icon className="size-6 text-tertiary" />
            </div>
            <p className="text-sm font-semibold text-primary">{source === "stream" ? "No stream connected" : "No file selected"}</p>
            <p className="max-w-xs text-sm leading-6 text-tertiary">
                {source === "stream" ? "Connect a live stream to preview it and start detecting objects." : "Upload a file to preview it and start detecting objects."}
            </p>
        </div>
    );
}
