import { Link, useLocation, useNavigate } from "react-router-dom";

import { useContext } from "react";

import { cn } from "../../lib"
import * as React from "react"


import {
  NavigationMenuLink,
} from "../../components/ui/navigation-menu"

import { UserContext } from "../../context/context";

import { useTheme } from "next-themes"

import { useModal } from "../hooks/use-modal-store";
import { LogoIapos } from "../svg/LogoIapos";
import { LogoIaposWhite } from "../svg/LogoIaposWhite";

import { Badge } from "../ui/badge";
import { ModeToggle } from "../mode-toggle";
import { Separator } from "../ui/separator";
import { Menubar, MenubarMenu, MenubarTrigger } from "../ui/menubar";
import { Button } from "../ui/button";
import { UserCircleGear, UserPlus } from "phosphor-react";
import { LayoutDashboard, LogInIcon } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";

export function Header() {
  const { loggedIn, role, setItensSelecionados, version, searchType, maria, user, permission } = useContext(UserContext)

  const { theme, setTheme } = useTheme()

  const navigate = useNavigate()

  const handleClick = () => {
    navigate('/')
    setItensSelecionados([])
  }

  const location = useLocation();
  const isVisible = location.pathname != '/' && location.pathname != '/resultados' && location.pathname != '/marIA' && location.pathname != '/pos-graduacao'

  return (
    <div className={'top-0 w-full'}>
      <header className={`h-[40px] px-4 md:mb-2 flex justify-between bg-neutral-50 dark:bg-neutral-900 md:bg-neutral-100 md:dark:bg-black  gap-2 items-center w-full relative`}>
        <div className="flex gap-2">

          <div className="flex w-full md:gap-3 gap-1 items-center md:h-full md:justify-center">

              <Link to={"/"} className="w-[80px]">
                <img src="../../assets/iapos.png" className="" alt="Logo Iapos" />
              </Link>

            <Separator orientation="vertical" className="mx-2 md:mx-0 h-6 bg-slate-300" />

            <div className="min-w-max">
              <Link to={"https://www.senaicimatec.com.br"} target="_blank" className="whitespace-nowrap ">
                <img src="../../assets/logo_cimatec.png" className="h-6" alt="Logo Cimatec" />
              </Link>
            </div>

            <span className="absolute right-2 md:relative md:ml-3 md:mb-[1px]">{(role != '' && role != 'Visitante') && (<Badge className="  " variant={'outline'} >{role}</Badge>)}</span>
          </div>

        </div>

        <div className="hidden md:flex gap-3 items-center">
            {!loggedIn && (
              <Link to={'/signIn'}>
                <Button variant='ghost' size="sm" className="h-8 px-2" >
                  <LogInIcon className="h-4 w-4" />
                  Fazer login
                </Button></Link>
            )}
            {!loggedIn && (
              <Link to={'/signUp'}>
                <Button size="sm" className="h-8 px-2">
                  <UserPlus className="h-4 w-4" />
                  Criar conta
                </Button></Link>
            )}
          </div>

          {
            !loggedIn && (
              <div className="md:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size="icon" className="h-8 w-8" >
                      <UserCircleGear className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-5">
                    <DropdownMenuItem>
                      <Link className="flex gap-2 items-center" to={'/signIn'}>
                        <UserPlus className="h-4 w-4" />
                        <p>Criar conta</p>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link className="flex gap-2 items-center" to={'/signUp'}>
                        <LogInIcon className="h-4 w-4" />
                        <p>Fazer login</p>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

            )
          }

          <div className="hidden md:flex md:gap-2">
            <div>
              {(loggedIn && permission.length > 0) && (
                <Link to={'/dashboard'}>
                  <Button variant='outline' size="sm" className="h-8 px-2" >
                    <LayoutDashboard className="h-4 w-4" />
                    Console
                  </Button></Link>
              )}
            </div>
          </div>

        <div className="w-full flex items-center justify-end md:justify-end gap-1">
          <div className="hidden md:flex md:gap-2">

            <Menubar>
              <MenubarMenu>
                <Link to="/">
                  <MenubarTrigger className="hover:cursor-pointer">Pesquisar</MenubarTrigger>
                </Link>
              </MenubarMenu>

              <MenubarMenu>
                <Link to="/indicadores">
                  <MenubarTrigger className="hover:cursor-pointer">Indicadores</MenubarTrigger>
                </Link>
              </MenubarMenu>

              <MenubarMenu>
                <Link to="/pos-graduacao">
                  <MenubarTrigger className="hover:cursor-pointer">Pós Graduação</MenubarTrigger>
                </Link>
              </MenubarMenu>

              <MenubarMenu>
                <Link to="https://simcc.uesc.br/incite/industria4/" target="_blank">
                  <MenubarTrigger className="text-white hover:cursor-pointer rounded-md bg-[#559FB8] hover:bg-[#1B1B1C]">Incite Indústria 4.0</MenubarTrigger>
                </Link>
              </MenubarMenu>
            </Menubar>
      
            <div className="flex items-center gap-2"> 
              <ModeToggle />
            </div>
          </div>
        </div>
      </header>
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"