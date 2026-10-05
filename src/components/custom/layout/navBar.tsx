import { BarChartSquare02, Camera01, File05, Users01 } from "@untitledui/icons";
import { SidebarNavigationSectionsSubheadings, type NavSectionType } from "../../application/app-navigation/sidebar-navegation/sidebar-sections-subheadings";
import { Avatar } from "@/components/base/avatar/avatar";
import { Button } from "@/components/base/buttons/button";
import { Star } from "lucide-react";
import { usePathname } from "next/navigation";
import type { User } from "@/types";
import { useTeams } from "@/hooks/use-team";



export const Sidebar = ({ user }: { user: User }) => {
    const pathname = usePathname();

    const { allLoggedTeams: allTeams, loading, error } = useTeams();

    const favoriteTeamsSection: NavSectionType = {

        label: "Favorite teams",
        emptyState: loading ? (
            <p role="status" className="text-sm text-tertiary">Loading teams…</p>
        ) : error ? (
            <p className="text-sm text-tertiary">Unable to load favorite teams.</p>
        ) : (
            <div className="flex items-start gap-2.5">
                <Star size={16} aria-hidden="true" className="mt-0.5 shrink-0 text-quaternary" />
                <div className="min-w-0">
                    <p className="text-sm font-medium text-secondary">No favorite teams yet</p>
                    <p className="mt-1 text-xs text-tertiary">Star a team to keep it here for quick access.</p>
                    <Button href="/team" color="link-color" size="sm" className="mt-2">Manage teams</Button>
                </div>
            </div>
        ),
        items: allTeams
            .filter((team) => team.is_favorite)
            .map((team) => ({
                label: team.name,
                href: `/team/${team.id}`,
                icon: () => (
                    <div className="flex items-center justify-center w-5 h-5 mr-2">
                        <Avatar
                            size="xs"
                            initials={team.name[0].toUpperCase()}
                        />
                    </div>
                ),
            })),
    };

    const navItemsWithSectionsSubheadings: NavSectionType[] = [
        {
            label: "General",
            items: [
                {
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: BarChartSquare02,
                },
                {
                    label: "Detection",
                    href: "/detection",
                    icon: Camera01,
                },
                {
                    label: "History",
                    href: "/history",
                    icon: File05,
                },
                {
                    label: "Teams",
                    href: "/team",
                    icon: Users01,
                },
            ],
        },
        favoriteTeamsSection,
    ];


    return (
        <SidebarNavigationSectionsSubheadings
            activeUrl={pathname}
            items={navItemsWithSectionsSubheadings}
            user={user}
        />
    );
};
