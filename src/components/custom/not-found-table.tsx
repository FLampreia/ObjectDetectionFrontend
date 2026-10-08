import { Search } from "lucide-react";

type Props = { type: string };

export function NotFoundTable({ type }: Props) {
    return (
        <div className="flex flex-col items-center justify-center gap-4 px-5 py-12 text-center sm:py-16">
            <div aria-hidden="true" className="flex size-12 items-center justify-center rounded-xl border border-secondary bg-secondary">
                <Search className="size-6 text-tertiary" />
            </div>
            <div className="max-w-sm">
                <h3 className="text-md font-semibold text-primary">No {type}s found</h3>
                <p className="mt-2 text-sm leading-6 text-tertiary">
                    There are no {type}s to show. If you are using filters, try adjusting or clearing them.
                </p>
            </div>
        </div>
    );
}
