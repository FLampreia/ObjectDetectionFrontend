"use client"

import { FileUp } from "lucide-react"

export function EmptyFile() {

    return (
        <div className="flex flex-col items-center">
            <FileUp size={40} className="mb-3 opacity-70" />
            <span className="text-sm font-medium">
                Upload file
            </span>
        </div>
    )
}