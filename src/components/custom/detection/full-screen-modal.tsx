"use client"

import { X } from "lucide-react"
import { useEffect } from "react"
import { createPortal } from "react-dom"

interface FullScreenModalProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export function FullScreenModal({ isOpen, onClose, children }: FullScreenModalProps) {
    useEffect(() => {
        if (!isOpen) return

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                onClose()
            }
        }

        window.addEventListener("keydown", handleEscape)

        return () => {
            window.removeEventListener("keydown", handleEscape)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-primary/80 flex items-center justify-center"
        // onClick={onClose}
        >
            <div
                className="relative w-full h-full flex items-center justify-center"
                // onClick={(e) => e.stopPropagation()}
            >
                {children}

                <button
                    className="absolute top-2 right-2 p-2 rounded-md bg-primary hover:bg-brand-primary transition cursor-pointer"
                    onClick={onClose}
                >
                    <X size={18} />
                </button>
            </div>
        </div>,
        document.body
    )
}