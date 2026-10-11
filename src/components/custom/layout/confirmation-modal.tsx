"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { InlineFeedback } from "./inline-feedback";
import { ModalActions, ModalHeader } from "./modal-parts";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    icon: ReactNode;
    warning: string;
    warningTitle?: string;
    actionLabel: string;
    isDisabled?: boolean;
    onConfirm: () => Promise<unknown>;
    onConfirmed?: () => void;
};

export function ConfirmationModal({
    isOpen,
    onOpenChange,
    title,
    description,
    icon,
    warning,
    warningTitle = "This action cannot be undone.",
    actionLabel,
    isDisabled,
    onConfirm,
    onConfirmed,
}: Props) {
    const descriptionId = useId();
    const warningId = useId();
    const submittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function close(open: boolean) {
        if (submittingRef.current) return;
        setError(null);
        onOpenChange(open);
    }

    async function confirm() {
        if (submittingRef.current || isDisabled) return;
        submittingRef.current = true;
        setIsSubmitting(true);
        setError(null);
        try {
            await onConfirm();
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Unable to complete this action. Please try again.");
            submittingRef.current = false;
            setIsSubmitting(false);
            return;
        }
        submittingRef.current = false;
        setIsSubmitting(false);
        onOpenChange(false);
        onConfirmed?.();
    }

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={close}
            isDismissable={!isSubmitting}
            isKeyboardDismissDisabled={isSubmitting}
        >
            <Modal className="w-full max-w-md">
                <Dialog className="p-5 sm:p-6" aria-describedby={`${descriptionId} ${warningId}`}>
                    <ModalHeader
                        title={title}
                        description={description}
                        descriptionId={descriptionId}
                        icon={icon}
                        destructive
                        onClose={() => close(false)}
                        isDisabled={isSubmitting}
                    />
                    <div id={warningId} className="mt-5 rounded-lg border border-error_subtle bg-error-primary px-4 py-3">
                        <p className="text-sm font-semibold text-error-primary">{warningTitle}</p>
                        <p className="mt-1 text-sm leading-6 text-secondary">{warning}</p>
                    </div>
                    {error && (
                        <div className="mt-4"><InlineFeedback>{error}</InlineFeedback></div>
                    )}
                    <p role="status" className="sr-only">{isSubmitting ? "Processing. Please wait." : ""}</p>
                    <ModalActions>
                        <Button size="md" color="secondary" autoFocus isDisabled={isSubmitting} onPress={() => close(false)}>
                            Cancel
                        </Button>
                        <Button
                            size="md"
                            color="primary-destructive"
                            isDisabled={isDisabled || isSubmitting}
                            isLoading={isSubmitting}
                            showTextWhileLoading
                            onPress={confirm}
                        >
                            {isSubmitting ? "Processing…" : error ? "Try again" : actionLabel}
                        </Button>
                    </ModalActions>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
