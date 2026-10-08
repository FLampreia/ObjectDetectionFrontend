import type { ReactNode } from "react";
import { NotFoundTable } from "@/components/custom/not-found-table";
import { InlineFeedback } from "./inline-feedback";
import { Loading } from "./loading";

type Props = {
    isLoading?: boolean;
    error?: string | null;
    isEmpty: boolean;
    type: string;
    children: ReactNode;
};

export function TableState({ isLoading, error, isEmpty, type, children }: Props) {
    if (isLoading) return <Loading details={`load your ${type}s`} />;
    if (error) return <div className="p-5"><InlineFeedback>{error}</InlineFeedback></div>;
    if (isEmpty) return <NotFoundTable type={type} />;
    return children;
}
