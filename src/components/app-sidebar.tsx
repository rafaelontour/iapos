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

  const data = {
    user: {
      name: user?.display_name || '',
      email: user?.email || '',
      avatar: user?.photo_url || '',
    },

    navMain: [
      {
        title: "Ferramentas",
        url: "/",
        icon: Wrench,
        isActive: true,
        items: [
          {
            title: "Indicadores",
            url: "/indicadores",
            icon: BarChartBig
          },

          {
            title: "Mapa de palavras",
            url: "/mapa-palavras",
            icon: List
          },
          {
            title: "Listagens",
            url: "/listagens",
            icon: Download
          },

          ...(!version
            ? [
              {
                title: "Provimento de cargo",
                url: "/provimento-cargo",
                icon: CalendarSearch
              },
            ]
            : []),


          {
            title: "Dados",
            url: "/paines-dados-externos",
            icon: Link2
          },
        ],
      },
      {
        title: "Páginas",
        url: "/",
        icon: PanelsTopLeft,
        isActive: true,
        items: [
          ...(version
            ? [
              {
                title: "Departamentos",
                url: "/departamentos",
                icon: Building2
              },
            ]
            : []),
          {
            title: "Pós-graduações",
            url: "/pos-graduacao",
            icon: GraduationCap
          },
          {
            title: "Grupos de pesquisa",
            url: "/grupos-pesquisa",
            icon: Blocks
          },

          ...(!version
            ? [
              {
                title: "INCITE's",
                url: "/incites",
                icon: Boxes
              },
            ]
            : []),
        ],
      },

      {
        title: "Outros",
        url: "/",
        icon: DotsThree,
        isActive: true,
        items: [
          {
            title: "Selecionados",
            icon: UserPlus,
            onClick: () => onOpen('pesquisadores-selecionados'), // Chama a função onOpen() ao clicar
          },
          {
            title: "Relatar problema",
            icon: Bug,
            onClick: () => onOpen('relatar-problema'), // Chama a função onOpen() ao clicar
          },
        ],
      },
    ],

    projects: [
      {
        name: "Página Inicial",
        url: "/",
        icon: Home,
      },
      {
        name: "Pesquisar",
        url: "/resultados",
        icon: SearchCheck,
      },
      {
        name: "Pesquisar com IA",
        url: "/resultados-ia",
        icon: Sparkles,
      },

    ],
  }

  return (
    <Sidebar collapsible='icon' className="border-0" {...props}>
      <SidebarHeader>
        <AccountSwitcher />
      </SidebarHeader>
      <SidebarContent >
        <NavProjects projects={data.projects} />
        <NavMain items={data.navMain} />

      </SidebarContent>
      <SidebarFooter>
        {loggedIn && (
          <NavUser user={data.user} />
        )}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
