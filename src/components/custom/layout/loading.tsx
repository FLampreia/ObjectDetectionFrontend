import { Loader2 } from "lucide-react";
import { cx } from "@/utils/cx";

export const Loading = ({ details, fullPage = false }: { details: string; fullPage?: boolean }) => (
    <section
        role="status"
        className={cx("flex flex-col items-center justify-center gap-4 px-5 py-12 text-center", fullPage ? "min-h-screen" : "min-h-64")}
    >
        <div aria-hidden="true" className="flex size-12 items-center justify-center rounded-xl bg-brand-solid text-white shadow-xs">
            <Loader2 className="size-6 animate-spin" />
        </div>
        <div>
            <p className="text-md font-semibold text-primary">Loading…</p>
            <p className="mt-2 text-sm leading-6 text-tertiary">Please wait while we {details}.</p>
        </div>
    </section>
);
