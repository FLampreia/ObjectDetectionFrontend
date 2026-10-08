"use client";

import type { ReactNode } from "react";
import { MobileNavigationHeader } from "../base-components/mobile-header";
import { NavAccountCard } from "../base-components/nav-account-card";
import { NavItemBase } from "../base-components/nav-item";
import type { NavItemType } from "../config";
import type { User } from "@/types";
import { NavigationBrand } from "@/components/custom/layout/navigation-brand";

export type NavSectionType = {
    label: string;
    items: NavItemType[];
    emptyState?: ReactNode;
};

interface SidebarNavigationSectionsSubheadingsProps {
    /** URL of the currently active item. */
    activeUrl?: string;
    /** List of items to display. */
    items: NavSectionType[];
    /** Object User to display on user card */
    user: User;
}

export const SidebarNavigationSectionsSubheadings = ({ activeUrl = "/", items, user }: SidebarNavigationSectionsSubheadingsProps) => {
    const MAIN_SIDEBAR_WIDTH = 276;

    const content = (
        <aside
            style={
                {
                    "--width": `${MAIN_SIDEBAR_WIDTH}px`,
                } as React.CSSProperties
            }
            className="flex h-full w-full max-w-full flex-col overflow-hidden bg-primary shadow-sm ring-primary ring-inset lg:w-(--width) lg:rounded-2xl lg:ring-1"
        >
            <div className="shrink-0 border-b border-secondary px-5 py-6">
                <NavigationBrand />
            </div>

            <nav aria-label="Main navigation" className="min-h-0 flex-1 overflow-y-auto px-3 py-5">
                <ul className="space-y-5">
                    {items.map((group) => (
                        <li key={group.label} className="border-t border-secondary pt-5 first:border-t-0 first:pt-0">
                            <div className="px-3 pb-3">
                                <p className="text-xs font-semibold tracking-wider text-tertiary uppercase">{group.label}</p>
                            </div>
                            <ul className="space-y-1">
                                {group.items.length === 0 && group.emptyState && (
                                    <li className="mx-1 rounded-xl border border-secondary bg-secondary px-3 py-4">{group.emptyState}</li>
                                )}
                                {group.items.map((item) => (
                                    <li key={item.href ?? item.label}>
                                        <NavItemBase icon={item.icon} href={item.href} badge={item.badge} type="link" current={item.href === activeUrl}>
                                            {item.label}
                                        </NavItemBase>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="shrink-0 border-t border-secondary p-3">
                <NavAccountCard user={user} />
            </div>
        </aside>
    );

    return (
        <>
            {/* Mobile header navigation */}
            <MobileNavigationHeader>{content}</MobileNavigationHeader>

            {/* Desktop sidebar navigation */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:py-2 lg:pl-1">{content}</div>

            {/* Placeholder to take up physical space because the real sidebar has `fixed` position. */}
            <div
                style={{
                    paddingLeft: MAIN_SIDEBAR_WIDTH + 4,
                }}
                className="invisible hidden lg:sticky lg:top-0 lg:bottom-0 lg:left-0 lg:block"
            />
        </>
    );
};
