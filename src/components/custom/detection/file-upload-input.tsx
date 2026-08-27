import { useState } from "react";
import React from "react";
import { InputFile } from "@/components/base/input/input-file";

interface Props {
    size?: "sm" | "md" | "lg";
    type: string;
    accepted: string;
    onFileSelect?: (file: File) => Promise<void> | void;

}

export const FileUploadInput = ({ size = "sm", type, accepted, onFileSelect }: Props) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = async (files: FileList | null) => {
        if (!files || files.length === 0) return;

        const file = files[0];
        setIsLoading(true);

        try {
            await onFileSelect?.(file);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <InputFile
            isRequired
            size={size}
            label={`1. Upload ${type}`}
            hint={accepted}
            onChange={handleChange}
            isLoading={isLoading}
        />
    );
};