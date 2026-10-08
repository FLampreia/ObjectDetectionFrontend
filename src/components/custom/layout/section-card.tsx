import { useId, type ReactNode } from "react";
import { cx } from "@/utils/cx";

type SectionCardProps = {
    title: string;
    description: string;
    icon: ReactNode;
    children: ReactNode;
    destructive?: boolean;
    className?: string;
    contentClassName?: string;
};

export function SectionCard({ title, description, icon, children, destructive, className, contentClassName }: SectionCardProps) {
    const titleId = useId();

    return (
        <section
            aria-labelledby={titleId}
            className={cx("overflow-hidden rounded-xl border bg-primary shadow-xs", destructive ? "border-error_subtle" : "border-secondary", className)}
        >
            <div className="flex items-start gap-3 border-b border-secondary p-5 sm:p-6">
                <div
                    aria-hidden="true"
                    className={cx(
                        "flex size-10 shrink-0 items-center justify-center rounded-xl [&>svg]:size-5",
                        destructive ? "bg-error-primary text-error-primary" : "bg-brand-solid text-white",
                    )}
                >
                    {icon}
                </div>
                <div>
                    <h2 id={titleId} className="text-md font-semibold text-primary">{title}</h2>
                    <p className="mt-1 text-sm leading-6 text-tertiary">{description}</p>
                </div>
            </div>
            <div className={cx("p-5 sm:p-6", contentClassName)}>{children}</div>
        </section>
    );
}
