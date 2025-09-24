import * as React from "react"
import {
    AArrowUp,
    AudioWaveform,
    BarChartBig,
    Blocks,
    BookOpen,
    Bot,
    Boxes,
    Bug,
    Building2,
    CalendarSearch,
    Command,
    Download,
    Frame,
    GalleryVerticalEnd,
    GraduationCap,
    Home,
    Info,
    Link2,
    List,
    Map,
    PanelsTopLeft,
    PieChart,
    SearchCheck,
    Settings2,
    Sparkles,
    SquareTerminal,
    UserPlus,
    Wrench,
} from "lucide-react"

import { NavMain } from "./nav-main"
import { NavProjects } from "./nav-projects"
import { NavUser } from "./nav-user"
import { TeamSwitcher } from "./team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "./ui/sidebar"
import { UserContext } from "../context/context"
import { useContext } from "react";
import { AccountSwitcher } from "./navigation/user-list"
import { DotsThree } from "phosphor-react"
import { useModal } from "./hooks/use-modal-store"
// This is sample data.

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { urlGeral, user, version, loggedIn } = useContext(UserContext)
    const { onOpen } = useModal()

    return <div />
}
