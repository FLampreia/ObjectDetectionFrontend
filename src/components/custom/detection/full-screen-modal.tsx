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
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose()
        }
        document.addEventListener("keydown", handleKeyDown)
        return () => {
            document.body.style.overflow = previousOverflow
            document.removeEventListener("keydown", handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return createPortal(
        <div
            className="fixed inset-0 z-50 bg-primary/80 flex items-center justify-center"
        >
            <div className="relative w-full h-full flex items-center justify-center">
                
                {children}

                <button
                    type="button"
                    aria-label="Close maximized image"
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
