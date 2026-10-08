import type { ReactNode } from "react";

type PageHeaderProps = {
    title: string;
    description: string;
    icon: ReactNode;
    actions?: ReactNode;
};

export function PageHeader({ title, description, icon, actions }: PageHeaderProps) {
    return (
        <header className="mb-6 flex flex-col gap-5 border-b-2 border-primary pt-6 pb-6 sm:mb-8 sm:pt-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-start gap-3 sm:gap-4">
                <div
                    aria-hidden="true"
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-solid text-white shadow-xs ring-1 ring-white/15 ring-inset sm:size-12 [&>svg]:size-6 [&>svg]:text-white"
                >
                    {icon}
                </div>

                <div className="min-w-0">
                    <h1 className="text-display-xs font-semibold tracking-tight text-primary sm:text-display-sm">
                        {title}
                    </h1>
                    <p className="mt-1 text-sm leading-6 text-tertiary">
                        {description}
                    </p>
                </div>
            </div>

            {actions && (
                <div className="flex max-w-full shrink-0 flex-wrap items-center gap-3 lg:justify-end">
                    {actions}
                </div>
            )}
        </header>
    );
}
