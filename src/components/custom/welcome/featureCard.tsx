import type { LucideIcon } from "lucide-react";

type Props = {
    title: string;
    desc: string;
    icon: LucideIcon;
};

export default function FeatureCard({ title, desc, icon: Icon }: Props) {
    return (
        <article className="h-full rounded-xl border border-secondary bg-primary p-6 shadow-xs transition-colors hover:border-brand">
            
            <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-brand-solid text-white shadow-xs">
                <Icon aria-hidden="true" className="size-5" />
            </div>

            <h3 className="text-md font-semibold text-primary">{title}</h3>
            
            <p className="mt-2 text-sm leading-6 text-tertiary">{desc}</p>
        </article>
    );
}
