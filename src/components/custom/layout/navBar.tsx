import { BarChartSquare02, Camera01, Calendar, CheckDone01, ChevronRight, File05, PieChart03, Rows01, Users01 } from "@untitledui/icons";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSectionsSubheadings } from "../../application/app-navigation/sidebar-navegation/sidebar-sections-subheadings";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { usePathname } from "next/navigation";
import { User } from "@/types";
import { useTeams } from "@/hooks/use-team";



export const Sidebar = ({ user }: { user: User }) => {
    const pathname = usePathname();

    const { allTeams } = useTeams();

    const favoriteTeamsSection = {

        label: "Favorite teams",
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

    const navItemsWithSectionsSubheadings: Array<{ label: string; items: NavItemType[] }> = [
        {
            label: "General",
            items: [
                {
                    label: "Dashboard",
                    href: "/dashboard",
                    icon: BarChartSquare02,
                },
                {
                    label: "Detections",
                    href: "/detect",
                    icon: Camera01,
                },
                {
                    label: "History",
                    href: "/documents",
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