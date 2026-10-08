"use client";

import { useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Dialog, Modal, ModalOverlay } from "@/components/application/modals/modal";
import { Button } from "@/components/base/buttons/button";
import { Input } from "@/components/base/input/input";
import { InlineFeedback } from "@/components/custom/layout/inline-feedback";
import { ModalActions, ModalHeader } from "@/components/custom/layout/modal-parts";

type Props = {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description: string;
    icon: ReactNode;
    label: string;
    placeholder: string;
    type?: "text" | "email";
    initialValue?: string;
    actionLabel: string;
    onSubmit: (value: string) => Promise<unknown>;
};

export function TeamFormModal({
    isOpen,
    onOpenChange,
    title,
    description,
    icon,
    label,
    placeholder,
    type = "text",
    initialValue = "",
    actionLabel,
    onSubmit,
}: Props) {
    const descriptionId = useId();
    const submittingRef = useRef(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function close(open: boolean) {
        if (submittingRef.current) return;
        setError(null);
        onOpenChange(open);
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (submittingRef.current) return;
        const form = event.currentTarget;
        const value = String(new FormData(form).get("value") ?? "").trim();
        if (!value) return;

        submittingRef.current = true;
        setIsSubmitting(true);
        setError(null);
        try {
            await onSubmit(value);
            form.reset();
            onOpenChange(false);
        } catch (error: unknown) {
            setError(error instanceof Error ? error.message : "Unable to complete this action. Please try again.");
        } finally {
            submittingRef.current = false;
            setIsSubmitting(false);
        }
    }

    return (
        <ModalOverlay
            isOpen={isOpen}
            onOpenChange={close}
            isDismissable={!isSubmitting}
            isKeyboardDismissDisabled={isSubmitting}
        >
            <Modal className="w-full max-w-md">
                <Dialog className="p-5 sm:p-6" aria-describedby={descriptionId}>
                    <ModalHeader
                        title={title}
                        description={description}
                        descriptionId={descriptionId}
                        icon={icon}
                        onClose={() => close(false)}
                        isDisabled={isSubmitting}
                    />
                    <form onSubmit={handleSubmit} aria-busy={isSubmitting} className="mt-6">
                        <Input
                            name="value"
                            label={label}
                            placeholder={placeholder}
                            type={type}
                            defaultValue={initialValue}
                            isRequired
                            isDisabled={isSubmitting}
                            onChange={() => setError(null)}
                        />
                        {error && (
                            <div className="mt-4"><InlineFeedback>{error}</InlineFeedback></div>
                        )}
                        <ModalActions>
                            <Button type="button" size="md" color="secondary" isDisabled={isSubmitting} onPress={() => close(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" size="md" isDisabled={isSubmitting} isLoading={isSubmitting} showTextWhileLoading>
                                {isSubmitting ? "Saving…" : actionLabel}
                            </Button>
                        </ModalActions>
                    </form>
                </Dialog>
            </Modal>
        </ModalOverlay>
    );
}
