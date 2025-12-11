import * as React from "react"
import {
  AArrowUp,
  Book,
  BookOpenText,
  Braces,
  Briefcase,
  Code,
  Copyright,
  File,
  Files,
  FilesIcon,
  FolderKanban,
  GraduationCap,
  InfoIcon,
  LibraryBigIcon,
  Lock,
  Palette,
  Receipt,
  Settings,
  SquareLibrary,
  SquarePlay,
  Ticket,
  UserRoundSearchIcon,
  Users,
} from "lucide-react"
import { Student, DotsThree, PaperPlane, PaperPlaneRight } from "phosphor-react"
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
import { useModal } from "./hooks/use-modal-store"

export function AppSidebarDocs({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
        title: "API",
        url: "/",
        icon: Settings,
        isActive: true,
        items: [

          {
            title: "Produções",
            url: "/api-docs/producoes",
            icon: SquareLibrary
          },
          {
            title: "Pesquisadores",
            url: "/api-docs/pesquisadores",
            icon: Users
          },
          {
            title: "Bolsistas CNPq",
            url: "/api-docs/bolsistas-cnpq",
            icon: UserRoundSearchIcon
          },
          {
            title: "Artigos",
            url: "/api-docs/artigos-infos",
            icon: File
          },
          {
            title: "Livros",
            url: "/api-docs/livros",
            icon: Book
          },
          {
            title: "Capítulos de Livros",
            url: "/api-docs/capitulos-livros",
            icon: LibraryBigIcon
          },
          {
            title: "Patentes",
            url: "/api-docs/patentes",
            icon: Copyright
          },
          {
            title: "Softwares",
            url: "/api-docs/softwares",
            icon: Code
          },
          {
            title: "Relatório Técnico",
            url: "/api-docs/relatorio-tecnico",
            icon: Files
          },
          {
            title: "Texto em revista",
            url: "/api-docs/texto-revista",
            icon: BookOpenText
          },
          {
            title: "Trabalho em Evento",
            url: "/api-docs/trabalho-evento",
            icon: Briefcase
          },
          {
            title: "Revistas",
            url: "/api-docs/revistas",
            icon: BookOpenText
          },
          {
            title: "Projeto de Pesquisa",
            url: "/api-docs/projeto-pesquisa",
            icon: FolderKanban
          },
          {
            title: "Marca",
            url: "/api-docs/marca",
            icon: Receipt
          },
          {
            title: "Orientações",
            url: "/api-docs/orientacoes",
            icon: GraduationCap
          },
          {
            title: "Part. em Eventos",
            url: "/api-docs/participacoes-eventos",
            icon: Ticket
          },

        ],
      },


    ],
    projects: [
      {
        name: "Informações",
        url: "/informacoes",
        icon: InfoIcon,
      },
      {
        name: "Termos de uso",
        url: "/termos-uso",
        icon: File,
      },
      {
        name: "Politica de privacidade",
        url: "/politica-privacidade",
        icon: Lock,
      },
      {
        name: "Modelos documentos",
        url: "/modelos-documentos",
        icon: FilesIcon,
      },
      {
        name: "Vídeos de apresentação",
        url: "/videos",
        icon: SquarePlay,
      },
      {
        name: "Apresentação API",
        url: "/api-docs",
        icon: Braces,
      },
      {
        name: "Dicionário de cores",
        url: "/dicionario-cores",
        icon: Palette,
      },
      {
        name: "Índice pesquisador",
        url: "/indice-pesquisador",
        icon: AArrowUp
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
