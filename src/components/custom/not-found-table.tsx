"use client"
import { Plus, } from "@untitledui/icons";
import { EmptyState } from "@/components/application/empty-state/empty-state";
import { Button } from "@/components/base/buttons/button";

interface Props {
    type: string;
}

export function NotFoundTable({ type }: Props) {
    return (
        <div className="flex items-center justify-center overflow-hidden px-8 py-20">
            <EmptyState size="sm">
                <EmptyState.Header pattern="none">
                    <EmptyState.FeaturedIcon color="gray" theme="modern-neue" />
                </EmptyState.Header>

                <EmptyState.Content>
                    <EmptyState.Title>No {type}s found</EmptyState.Title>
                    <EmptyState.Description>
                        Your search did not match any {type}. Please try again or create a new {type}.
                    </EmptyState.Description>
                </EmptyState.Content>

            </EmptyState>
        </div>
    )
}