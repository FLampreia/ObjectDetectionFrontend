import type { ReactNode } from "react";

export function MobileRowDetails({ items }: { items: { label: string; value: ReactNode }[] }) {
    return (
        <details className="mt-2 text-xs md:hidden">
            <summary className="w-fit cursor-pointer rounded py-2 font-medium text-secondary focus-visible:outline-2 focus-visible:outline-brand">
                Details
            </summary>
            <dl className="mt-1 space-y-2 whitespace-normal">
                {items.map(({ label, value }) => (
                    <div key={label}>
                        <dt className="text-quaternary">{label}</dt>
                        <dd className="break-all text-secondary">{value}</dd>
                    </div>
                ))}
            </dl>
        </details>
    );
}
