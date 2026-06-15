import { BarChartSquare02, Camera01, Calendar, CheckDone01, ChevronRight, File05, PieChart03, Rows01, Users01 } from "@untitledui/icons";
import type { NavItemType } from "@/components/application/app-navigation/config";
import { SidebarNavigationSectionsSubheadings } from "../application/app-navigation/sidebar-navegation/sidebar-sections-subheadings";
import { Avatar } from "@/components/base/avatar/avatar";
import { Badge } from "@/components/base/badges/badges";
import { usePathname } from "next/navigation";
import { User } from "@/types";
 

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
    // {
    //     label: "Untitled UI",
    //     items: [
    //         {
    //             label: "Reporting",
    //             href: "#",
    //             icon: PieChart03,
    //         },
    //         {
    //             label: "Tasks",
    //             href: "#",
    //             icon: CheckDone01,
    //             badge: (
    //                 <Badge size="sm" type="modern">
    //                     8
    //                 </Badge>
    //             ),
    //         },
    //         {
    //             label: "Users",
    //             href: "#",
    //             icon: Users01,
    //         },
    //     ],
    // },
    {
        label: "Your teams",
        items: [
            {
                label: "Catalog",
                href: "#",
                icon: () => <Avatar src="https://www.untitledui.com/logos/images/Catalog.jpg" className="mr-2 size-5" />,
                badge: (
                    <div className="flex items-center gap-3">
                        <Badge size="sm" type="modern">
                            ⌘1
                        </Badge>
                        <ChevronRight size={16} className="text-fg-quaternary" />
                    </div>
                ),
            },
            {
                label: "Warpspeed",
                href: "#",
                icon: () => <Avatar src="https://www.untitledui.com/logos/images/Warpspeed.jpg" className="mr-2 size-5" />,
                badge: (
                    <div className="flex items-center gap-3">
                        <Badge size="sm" type="modern">
                            ⌘2
                        </Badge>
                        <ChevronRight size={16} className="text-fg-quaternary" />
                    </div>
                ),
            },
            {
                label: "Boltshift",
                href: "#",
                icon: () => <Avatar src="https://www.untitledui.com/logos/images/Boltshift.jpg" className="mr-2 size-5" />,
                badge: (
                    <div className="flex items-center gap-3">
                        <Badge size="sm" type="modern">
                            ⌘3
                        </Badge>
                        <ChevronRight size={16} className="text-fg-quaternary" />
                    </div>
                ),
            },
            {
                label: "Sisyphus",
                href: "#",
                icon: () => <Avatar src="https://www.untitledui.com/logos/images/Sisyphus.jpg" className="mr-2 size-5" />,
                badge: (
                    <div className="flex items-center gap-3">
                        <Badge size="sm" type="modern">
                            ⌘4
                        </Badge>
                        <ChevronRight size={16} className="text-fg-quaternary" />
                    </div>
                ),
            },
        ],
    },
];

export const Sidebar = ({ user }: { user: User }) => {
    const pathname = usePathname();
    
    return (
        <SidebarNavigationSectionsSubheadings
            activeUrl={pathname}
            items={navItemsWithSectionsSubheadings}
            user={user}
        />
    );
};


// // Sidebar.tsx corrigida para mobile fechar corretamente

// import {
//     LayoutDashboard as Dash,
//     Video,
//     ClipboardClock,
//     Users,
//     X,
// } from "lucide-react";

// import { MenuItem } from "@/components/custom/menuitem";
// import { useAuth } from "@/hooks/useAuth";
// import AppTitle from "@/components/custom/textTitles";
// import { UserCard } from "@/components/custom/userCard";
// import { useState } from "react";
// import { UserDropdown } from "@/components/custom/userDropdown";

// interface SidebarProps {
//     mobile?: boolean;
//     onClose?: () => void;
// }

// export function Sidebar({
//     mobile = false,
//     onClose,
// }: SidebarProps) {
//     const { user } = useAuth();
//     const [open, setOpen] = useState(false);

//     const toggle = () => setOpen((v) => !v);

//     const closeDropdown = () => setOpen(false);

//     const handleCloseSidebar = () => {
//         closeDropdown();
//         onClose?.();
//     };


//             {/* User */}
//             <div className="p-4 border-t border-blue-900 relative">
//                 {user && (
//                     <div
//                         onClick={toggle}
//                         className="cursor-pointer"
//                     >
//                         <UserCard user={user} />
//                     </div>
//                 )}

//                 {open && (
//                     <UserDropdown
//                         onClose={handleCloseSidebar}
//                         placement="top"
//                     />
//                 )}
//             </div>
//         </aside>
//     );
// }