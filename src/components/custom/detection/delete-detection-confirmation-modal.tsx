"use client";

import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { Trash2, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { deleteDetections } from "@/services/detections";
import { Heading } from "react-aria-components";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    detection_id: string | string[];
    onDeleted?: () => void;
};

export function DeleteDetectionConfirmationModal({ isOpen, onOpenChange, detection_id, onDeleted }: Props) {
    const queryClient = useQueryClient();
    const deletingRef = useRef(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const descriptionId = useId();
    const warningId = useId();
    const detectionCount = Array.isArray(detection_id) ? new Set(detection_id).size : detection_id ? 1 : 0;
    const isSingleDetection = detectionCount === 1;

    async function handleDeleteDetection() {
        if (deletingRef.current || detectionCount === 0) return;

        deletingRef.current = true;
        setIsDeleting(true);
        setError(null);

        try {
            const ids = Array.isArray(detection_id) ? [...new Set(detection_id)] : [detection_id];
            await deleteDetections(ids);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Unable to delete detections. Please try again.");
            deletingRef.current = false;
            setIsDeleting(false);
            return;
        }

        // Refresh both personal/team lists and dashboard totals after deletion.
        void queryClient.invalidateQueries({ queryKey: ["detections"] });
        void queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
        deletingRef.current = false;
        setIsDeleting(false);
        onOpenChange(false);
        onDeleted?.();
    }

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={(open) => {
                if (!deletingRef.current) {
                    setError(null);
                    onOpenChange(open);
                }
            }}
            isDismissable={!isDeleting}
            isKeyboardDismissDisabled={isDeleting}
        >
            <Modal className="w-full max-w-md">
                <Dialog className="p-5 sm:p-6" aria-describedby={`${descriptionId} ${warningId}`}>

                    <div className="flex items-start justify-between gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-error-primary ring-1 ring-error_subtle ring-inset">
                            <Trash2 aria-hidden="true" className="size-6 text-error-primary" />
                        </div>
                        <ButtonUtility
                            size="sm"
                            color="tertiary"
                            icon={X}
                            tooltip="Close"
                            isDisabled={isDeleting}
                            onClick={() => onOpenChange(false)}
                        />
                    </div>

                    <Heading slot="title" className="mt-5 text-xl font-semibold text-primary">
                        {isSingleDetection ? "Delete detection" : "Delete detections"}
                    </Heading>

                    <p id={descriptionId} className="mt-2 text-sm leading-6 text-tertiary">
                        {isSingleDetection
                            ? "Are you sure you want to delete this detection?"
                            : `Are you sure you want to delete ${detectionCount} selected detections?`}
                    </p>

                    <div id={warningId} className="mt-5 rounded-lg border border-error_subtle bg-error-primary px-4 py-3">

                        <p className="text-sm font-semibold text-error-primary">This action cannot be undone.</p>

                        <p className="mt-1 text-sm leading-5 text-secondary">
                            {isSingleDetection
                                ? "The detection and its associated objects will be permanently deleted."
                                : "The selected detections and their associated objects will be permanently deleted."}
                        </p>
                    </div>

                    {error && (
                        <p role="alert" className="mt-4 rounded-lg border border-error_subtle bg-error-primary p-3 text-sm text-error-primary">
                            {error}
                        </p>
                    )}
                    <p role="status" className="sr-only">{isDeleting ? "Deleting detections. Please wait." : ""}</p>

                    <div className="mt-6 flex flex-col-reverse gap-3 border-t border-secondary pt-5 sm:flex-row">
                        <Button
                            color="secondary"
                            size="md"
                            className="w-full sm:flex-1"
                            autoFocus
                            isDisabled={isDeleting}
                            onPress={() => onOpenChange(false)}
                        >
                            Cancel
                        </Button>
                        
                        <Button
                            color="primary-destructive"
                            size="md"
                            className="w-full sm:flex-1"
                            isDisabled={isDeleting || detectionCount === 0}
                            isLoading={isDeleting}
                            showTextWhileLoading
                            onPress={handleDeleteDetection}
                        >
                            {isDeleting ? "Deleting…" : isSingleDetection ? "Delete detection" : `Delete ${detectionCount} detections`}
                        </Button>
                    </div>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
