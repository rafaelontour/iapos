import {  AreaChart,    ArrowLeftToLine,    ArrowRightToLine,    Book,    Briefcase,    Code,    Copyright,    File,    Globe,  GraduationCap,  MapPinIcon, PencilLine, Plus, SquareArrowOutUpRight, SquareMenu, Star, User,  Users } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Books, Eye, EyeSlash, Quotes, StripeLogo, Trash } from "phosphor-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "sonner"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/context";
import { useModal } from "../../hooks/use-modal-store";
import { DataTableModal } from "../../componentsModal/data-table";

import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";

import { Label } from "../../ui/label";

import { Input } from "../../ui/input";
import { v4 as uuidv4 } from 'uuid';
import { columnsStudent } from "../../componentsModal/columns-student-program";

import { Helmet } from "react-helmet";
import { DocentesGraduate } from "../components/docentes-graduate";
import { DiscentesGraduate } from "../components/discentes-graduate";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Keepo } from "./keepo";
import { InfiniteMovingProductions } from "../../ui/infinite-moving-productions";
import { Total } from "../../graduate-program/homepage-program";

interface Patrimonio {
  graduate_program_id: string
  menu_state:boolean
  code: string
  name: string
  area: string
  modality: string
  type: string
  rating: string
  institution_id: string
  description?: string
  url_image: string
  city:string
  created_at?:string
  visible: boolean
  updated_at?:string
  qtd_discente:string
  qtd_colaborador:string
  qtd_permanente:string
  site:string 
  acronym:string 
  onMenuState:(newResearcher: boolean) => void;
  }

  export interface PesquisadorProps {
    lattes_id: string
    name: string
    type_: string
    graduate_program_id: string
    years: Array<number>
  }
  
  export interface PesquisadorProps2 {
    name: string
    lattes_id: string
    researcher_id: string
    institution_id: string
  }
  

export function DisplayItem(props:Patrimonio) {
    const qualisColor = {
        'MESTRADO': 'bg-blue-200',
        'DOUTORADO': 'bg-blue-800',
      };
    

 
      const [visibleProgram, setVisibleProgram] = useState(false);
      const { urlGeralAdm, user } = useContext(UserContext);
      const { onOpen, isOpen, type:typeModal } = useModal();

      const [isVisible, setIsVisible] = useState(props.visible)

      useEffect(() => {
        setIsVisible(props.visible);
      
    //    setTab('all')

        }, [urlGeralAdm, props.graduate_program_id, props.visible]);

      
      const handleVisibleProgram = (id: string) => {

        const urlVisibleProgram = urlGeralAdm  + `GraduateProgramRest/Update?graduate_program_id=${id}`
        const fetchData = async () => {
         
          try {
            const response = await fetch(urlVisibleProgram, {
              mode: 'cors',
              method: 'POST',
              headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '3600',
                'Content-Type': 'text/plain'
              }
            });
            if (response.ok) {
              setIsVisible(!isVisible);
              setVisibleProgram(!visibleProgram)
              toast("Visibilidade alterada", {
                description: "Operação realizada com sucesso!",
                action: {
                  label: "Fechar",
                  onClick: () => console.log("Undo"),
                },
              })
            } 
      
          
          } catch (err) {
            toast("Erro ao mudar visibilidade", {
              description: "Tente novamente",
              action: {
                label: "Fechar",
                onClick: () => console.log("Undo"),
              },
            })
          } 
        };
        fetchData();

      };


    



      const [tab, setTab] = useState('all')

     
       //listar todos os pesquisadores popover
    



    //student 



    const {version, urlGeral} = useContext(UserContext)

    const [totalProducao, setTotalProducao] = useState<Total[]>([]);

    const urlTotalProgram = `${urlGeral}graduate_program_production?graduate_program_id=${props.graduate_program_id}&year=1900`;
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(urlTotalProgram, {
            mode: "cors",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET",
              "Access-Control-Allow-Headers": "Content-Type",
              "Access-Control-Max-Age": "3600",
              "Content-Type": "text/plain",
            },
          });
          const data = await response.json();
          if (data) {
            setTotalProducao(data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }, [urlTotalProgram]);

    const producoes = [
      {
        name: "Artigos",
        icon: File, // Certifique-se de que Quotes é um componente ou valor válido
        number: totalProducao.slice(0, 1)[0]?.article, // Corrigido para acessar o primeiro item e a propriedade `article`
      },
      {
        name: "Livros",
        icon: Book, // Certifique-se de que Quotes é um componente ou valor válido
        number: totalProducao.slice(0, 1)[0]?.book, // Corrigido para acessar o primeiro item e a propriedade `article`
      },
      {
        name: "Capítulos de livro",
        icon: Books, // Certifique-se de que Quotes é um componente ou valor válido
        number: totalProducao.slice(0, 1)[0]?.book_chapter, // Corrigido para acessar o primeiro item e a propriedade `article`
      },
      {
        name: "Patentes",
        icon: Copyright, // Certifique-se de que Quotes é um componente ou valor válido
        number: totalProducao.slice(0, 1)[0]?.patent, // Corrigido para acessar o primeiro item e a propriedade `article`
      },
      {
        name: "Marcas",
        icon: StripeLogo, // Certifique-se de que Quotes é um componente ou valor válido
        number: totalProducao.slice(0, 1)[0]?.brand, // Corrigido para acessar o primeiro item e a propriedade `article`
      },
      {
        name: "Softwares",
        icon: Code, // Certifique-se de que Quotes é um componente ou valor válido
        number: totalProducao.slice(0, 1)[0]?.software, // Corrigido para acessar o primeiro item e a propriedade `article`
      },
      {
        name: "Trabalhos em eventos",
        icon: Briefcase, // Certifique-se de que Quotes é um componente ou valor válido
        number: totalProducao.slice(0, 1)[0]?.work_in_event, // Corrigido para acessar o primeiro item e a propriedade `article`
      },
      {
        name: "Bolsistas CNPq",
        icon: Copyright, // Certifique-se de que Quotes é um componente ou valor válido
        number: totalProducao.slice(0, 1)[0]?.subsidy, // Corrigido para acessar o primeiro item e a propriedade `article`
      }
  
    ];

    useEffect(() => {
  

      setTab('all')

      }, [urlGeralAdm, props.graduate_program_id]);

    return(
<Tabs  defaultValue={tab} value={tab}>
<Helmet>
  <title>{props.name ? `${props.name} | ${version ? 'Conectee': 'Simcc'}` : `${version ? 'Conectee': 'Simcc'} | ${version ? 'Escola de Engenharia UFMG': 'SECTI-BA'}`}</title>
  <meta
    name="description"
    content={props.name ? `${props.name} | ${version ? 'Conectee': 'Simcc'}` : `${version ? 'Conectee': 'Simcc'} | ${version ? 'Escola de Engenharia UFMG': 'SECTI-BA'}`}
  />
  <meta name="robots" content="index, follow" />
</Helmet>

      <div className="flex border dark:border-neutral-800 flex-col sticky top-[68px] z-[3] rounded-lg bg-white dark:bg-black">
      <div className="flex items-center p-2 justify-between">
        <div className="flex items-center gap-2">

         <Tooltip>
         <TooltipTrigger asChild>
           <Button variant="ghost" size="icon"  onClick={() => props.onMenuState(!props.menu_state)} >
           {props.menu_state ? (<ArrowLeftToLine size={16}/>):(<ArrowRightToLine size={16}/>)}
           </Button>
         </TooltipTrigger>
         <TooltipContent>{!props.menu_state ? ('Mostrar menu'):('Fechar menu')}</TooltipContent>
       </Tooltip>
 

        <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon"  onClick={() =>handleVisibleProgram(props.graduate_program_id)} >
              {isVisible ? (<EyeSlash size={16}/>):(<Eye size={16}/>)}
                <span className="sr-only">Arquivar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Mudar visibilidade</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon"  onClick={() => onOpen('edit-graduate-program', {
            graduate_program_id:props.graduate_program_id,
            code:props.code,
            name:props.name,
            area:props.area,
            modality:props.modality,
            type:props.type,
            rating:props.rating,
            institution_id:props.institution_id,
            description:props.description,
            url_image:props.url_image,
            city:props.city,
            visible:String(props.visible),
            site:props.site,
            acronym:props.acronym
            
            })} >
              <PencilLine size={16}/>
                <span className="sr-only">Arquivar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/pos-graduacao?graduate_program_id=${props.graduate_program_id}`} target="_blank">
              <Button variant="ghost" size="icon"   >
              <SquareArrowOutUpRight size={16}/>
                <span className="sr-only">Arquivar</span>
              </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>Visualizar página</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
             <Link to={''}>
             <Button variant="ghost" size="icon"  >
              <AreaChart size={16}/>
                <span className="sr-only">Arquivar</span>
              </Button>
             </Link>
            </TooltipTrigger>
            <TooltipContent>Indicadores</TooltipContent>
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">

        <TabsList >
              <TabsTrigger value="all" onClick={() => setTab('all')} className="text-zinc-600 dark:text-zinc-200">Visão geral</TabsTrigger>
                <TabsTrigger value="unread" onClick={() => setTab('unread')} className="text-zinc-600 dark:text-zinc-200">Docentes</TabsTrigger>
                <TabsTrigger value="movimentacao-bens" onClick={() => setTab('movimentacao-bens')} className="text-zinc-600 dark:text-zinc-200">Discentes</TabsTrigger>
                </TabsList>

                <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => onOpen('confirm-delete-pos-graduate-program', {id_delete:props.graduate_program_id , name:props.name})}  variant='destructive' size="icon"   >
             <Trash size={16}/>
                <span className="sr-only">Arquivar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deletar programa</TooltipContent>
          </Tooltip>
        </div>
        </div>
     

        </div>
      <div className="h-full mt-8 border sticky top-[156px]   rounded-lg   dark:border-neutral-800" >
        

        <TabsContent value="all" className="mt-0">

<div className="p-8 pt-0">
<div className="flex justify-between items-center py-12">
        <div className="flex flex-col items-start md:flex-row gap-6 -mt-4">
          <Avatar className="cursor-pointer rounded-lg  h-24 w-24">
            <AvatarImage className={'rounded-md h-24 w-24'} src={``} />
            <AvatarFallback className="flex items-center justify-center"><GraduationCap size={24} /></AvatarFallback>
          </Avatar>

          <div>
            <p className="max-w-[750px] mb-2 text-lg font-light text-foreground">
              <div className="flex flex-wrap gap-4 ">
                <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Users size={12} />{props.type}</div>
                <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center capitalize"><MapPinIcon size={12} />{props.city}</div>
                {props.rating != '' && (
                  <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Star size={12} />{props.rating}</div>
                )}

<div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center capitalize">{props.code != '' ? (props.code):('Sem código')}</div>
              </div>
            </p>

            <h1 className="text-2xl max-w-[800px] font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
              {props.name}
            </h1>
          </div>
        </div>
      </div>

     <div className="mb-8 grid grid-cols-1">
     <InfiniteMovingProductions
              items={producoes} // Formata cada item como um objeto
              direction="left"
              speed='normal'
              pauseOnHover={false}
              className="custom-class"
            />
     </div>

      <Keepo id={props.graduate_program_id} name={props.name} type="graduate_program"/>
</div>
            
        </TabsContent>

        <TabsContent value="unread" className="mt-0 pb-6">
      <div className="overflow-y-auto ">
      <DocentesGraduate graduate_program_id={props.graduate_program_id}/>
      </div>
        </TabsContent>

        <TabsContent value="movimentacao-bens" className="mt-0">
      <div className="overflow-y-auto ">
        <DiscentesGraduate graduate_program_id={props.graduate_program_id}/>
      </div>
        </TabsContent>
       
        </div>
        </Tabs>
    )
}