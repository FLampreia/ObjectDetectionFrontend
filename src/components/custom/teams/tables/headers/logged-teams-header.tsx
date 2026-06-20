"use client";

import { Input } from "@/components/base/input/input";
import { SearchLg } from "@untitledui/icons";
import { CreateTeamModal } from "../../modals/create-team-modal";

type Props = {
    search: string;
    setSearch: (value: string) => void;
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    error: string | null;
};

export function LoggedTeamsHeader({
    search,
    setSearch,
    isOpen,
    setIsOpen,
}: Props) {
    return (
        <div className="flex shrink-0 items-center gap-3 max-md:w-full">
            <Input
                className="min-w-0 max-md:flex-1 md:w-70"
                size="md"
                aria-label="Search"
                placeholder="Search"
                icon={SearchLg}
                value={search}
                onChange={setSearch}
            />

            <CreateTeamModal
                isOpen={isOpen}
                onOpenChange={setIsOpen}
            />
        </div>
    );
}