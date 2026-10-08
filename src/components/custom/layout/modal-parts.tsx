"use client";

import type { ReactNode } from "react";
import { X } from "lucide-react";
import { Heading } from "react-aria-components";
import { ButtonUtility } from "@/components/base/buttons/button-utility";
import { cx } from "@/utils/cx";

type ModalHeaderProps = {
    title: string;
    description: string;
    descriptionId: string;
    icon: ReactNode;
    onClose: () => void;
    isDisabled?: boolean;
    destructive?: boolean;
};

export function ModalHeader({
    title,
    description,
    descriptionId,
    icon,
    onClose,
    isDisabled,
    destructive,
}: ModalHeaderProps) {
    return (
        <div>
            <div className="flex items-start justify-between gap-4">
                <div
                    aria-hidden="true"
                    className={cx(
                        "flex size-12 items-center justify-center rounded-xl [&>svg]:size-6",
                        destructive
                            ? "bg-error-primary text-error-primary ring-1 ring-error_subtle ring-inset"
                            : "bg-brand-solid text-white shadow-xs",
                    )}
                >
                    {icon}
                </div>
                <ButtonUtility color="tertiary" size="sm" icon={X} tooltip="Close" isDisabled={isDisabled} onClick={onClose} />
            </div>
            <Heading slot="title" className="mt-5 text-xl font-semibold tracking-tight text-primary">
                {title}
            </Heading>
            <p id={descriptionId} className="mt-2 text-sm leading-6 text-tertiary">{description}</p>
        </div>
    );
}

export function ModalActions({ children }: { children: ReactNode }) {
    return (
        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-secondary pt-5 sm:flex-row [&>*]:w-full sm:[&>*]:flex-1">
            {children}
        </div>
    );
}
