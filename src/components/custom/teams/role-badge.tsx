"use client"

import { Crown, Star } from "lucide-react";
import { Trash01, Edit01, X, User01, List } from "@untitledui/icons";
import { BadgeWithIcon } from "@/components/base/badges/badges";

type Props = {
    role: string;
};

export function RoleBadge({ role }: Props) {
    const config = {
        owner: { color: "blue", icon: Crown },
        member: { color: "gray", icon: User01 },
    } as const;

    const fallback = { color: "error", icon: X };

    const { color, icon } = config[role as keyof typeof config] ?? fallback;

    return (
        <BadgeWithIcon size="sm" color={color} iconLeading={icon} className="capitalize">
            {role}
        </BadgeWithIcon>
    );

}