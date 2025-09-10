import { Toaster } from "sonner";

import { toast } from "sonner"

import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/context";
import { AccountSwitcher } from "../components/navigation/user-list";
import { Blocks, Bug, Building2, ChevronDown, ChevronUp, ClipboardEdit, File, FlaskConical, GraduationCap, Info, LayoutDashboard, Mail, PanelRightClose, PanelRightOpen, PieChart, Play, SlidersHorizontal, Terminal, UserPlus, Users, Weight } from "lucide-react";

import { useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { ApacheViewDashboard } from "../components/dashboard/apache-view-dashboard";
import { useModal } from "../components/hooks/use-modal-store";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "../components/ui/sidebar";
import { AppSidebarAdmin } from "../components/app-sidebar-admin";
import { SidebarRight } from "../components/sidebar-right";
import { Separator } from "../components/ui/separator";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "../components/ui/breadcrumb";
import React from "react";
import { Mobile } from "../components/mobile";
interface MailProps {

  defaultLayout: number[] | undefined
  defaultCollapsed?: boolean
  navCollapsedSize: number
  children: React.ReactNode
}

export default function AdminLayout({

  defaultLayout = [265, 440, 655],
  defaultCollapsed = true,
  navCollapsedSize,
  children
}: MailProps) {

  const { isCollapsed, setIsCollapsed, permission, setIsCollapsedRight, isCollapsedRight, pesquisadoresSelecionados, urlGeralAdm } = useContext(UserContext)


  //permissoes


  const has_atualizar_apache_hop = permission.some(
    (perm) => perm.permission === 'atualizar_apache_hop'
  );





  const location = useLocation()
  const [isOpenConsole, setIsOpenConsole] = useState(false)

  const { onOpen } = useModal()

  useEffect(() => {
    if (location.pathname == '/dashboard/relatar-problema') {
      onOpen('relatar-problema')
    } else if (location.pathname == '/dashboard/pesquisadores-selecionados') {
      onOpen('pesquisadores-selecionados')
    }
  }, [location]);

  //apache

  const handleSubmit = async () => {

    const data = [
      {
        state: true
      }
    ]

    let urlProgram = urlGeralAdm + 's/hop'
    const fetchData = async () => {
      try {
        const response = await fetch(urlProgram, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {

          toast("Apache hop iniciado", {
            description: "Atualizando dados dos pesquisadores",
            action: {
              label: "Fechar",
              onClick: () => { console.log("Undo"); }
            },
          });

        } else if (response.status === 423) {
          toast("O Apache hop já está rodando, tente novamente mais tarde", {
            description: "Em processo de atualização dos dados dos pesquisadores",
            action: {
              label: "Fechar",
              onClick: () => { console.log("Undo"); }
            },
          });
        } else {
          toast("Erro ao iniciar o Apache Hop", {
            description: "Tente novamente mais tarde",
            action: {
              label: "Fechar",
              onClick: () => { console.log("Undo"); }
            },
          });
        }

      } catch (err) {
        console.log(err);
      }
    }

    fetchData();
  };

  const router = useLocation();

  // Função para formatar o texto dos segmentos
  const formatSegment = (segment) => {
    return segment
      .replace(/-/g, ' ') // Substitui hífens por espaços
      .replace(/_/g, ' ') // Substitui underscores por espaços
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Função para criar os itens do breadcrumb
  const createBreadcrumbItems = (pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean);

    if (pathSegments.length === 0) {
      return [{ label: 'Página Inicial', href: '/', isLast: true }];
    }

    const items = [
      { label: 'Página Inicial', href: '/', isLast: false }
    ];

    pathSegments.forEach((segment, index) => {
      const href = `/${pathSegments.slice(0, index + 1).join('/')}`;
      const isLast = index === pathSegments.length - 1;

      items.push({
        label: formatSegment(segment),
        href,
        isLast
      });
    });

    return items;
  };

  const breadcrumbItems = createBreadcrumbItems(router.pathname);


  return (
    <div>

      <SidebarProvider className="    " defaultOpen={true} open={isCollapsed} onOpenChange={() => setIsCollapsed((prev) => !prev)} >

        <AppSidebarAdmin />



        <SidebarInset className="" props2={isCollapsedRight ? ('') : (<SidebarRight />)}>
          <main className="h-full flex flex-col flex-1 ">
            {/* Assuming Header is another component */}

            <div className="flex p-8 pt-8 pb-2 h-[68px] items-center justify-between top-0 sticky z-[3] supports-[backdrop-filter]:bg-neutral-50/60 supports-[backdrop-filter]:dark:bg-neutral-900/60 backdrop-blur ">
              <div className="flex pb-0 items-center gap-2">
                <SidebarTrigger />
                <Separator orientation="vertical" className="mr-2 h-4" />

                <Breadcrumb>
                  <BreadcrumbList>
                    {breadcrumbItems.map((item, index) => (
                      <React.Fragment key={`breadcrumb-${index}`}>
                        <BreadcrumbItem className="hidden md:block">
                          {item.isLast ? (
                            <span className="text-foreground font-medium capitalize">
                              {item.label}
                            </span>
                          ) : (
                            <BreadcrumbLink
                              to={item.href}
                              className="capitalize text-muted-foreground hover:text-foreground transition-colors"
                            >
                              {item.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>

                        {!item.isLast && (
                          <BreadcrumbSeparator className="hidden md:block" />
                        )}
                      </React.Fragment>
                    ))}
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              <div className="flex items-center gap-2">
                <Button variant={'outline'} size={'icon'} className="w-8 h-8" onClick={() => setIsCollapsedRight(!isCollapsedRight)}>
                  {isCollapsedRight ? (<PanelRightOpen size={16} />) : (<PanelRightClose size={16} />)}
                </Button>

              </div>
            </div>

            <div className={`h-full ${(location.pathname == '/dashboard/administrativo' && has_atualizar_apache_hop) && ('pb-[40px]')}`}>
              {children}


            </div>
          </main>

        </SidebarInset>

        <Toaster richColors />
        <Mobile />

      </SidebarProvider  >
    </div>
  );
};
