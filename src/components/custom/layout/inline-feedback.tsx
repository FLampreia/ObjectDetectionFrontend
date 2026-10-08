import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { cx } from "@/utils/cx";

export function InlineFeedback({ children, tone = "error" }: { children: ReactNode; tone?: "error" | "success" }) {
    const Icon = tone === "error" ? AlertCircle : CheckCircle2;

    return (
        <div
            role={tone === "error" ? "alert" : "status"}
            className={cx(
                "flex items-start gap-2.5 rounded-lg border p-3 text-sm leading-6",
                tone === "error"
                    ? "border-error_subtle bg-error-primary text-error-primary"
                    : "border-secondary bg-secondary text-success-primary",
            )}
        >
            <Icon aria-hidden="true" className="mt-0.5 size-5 shrink-0" />
            <span>{children}</span>
        </div>
    );
}
