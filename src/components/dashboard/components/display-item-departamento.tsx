import {  AreaChart,  ArrowLeftToLine,  ArrowRightToLine,  ChevronsUpDown, Globe, Hash, Mail, PencilLine, Phone, Plus, SquareArrowOutUpRight,SquareMenu,User } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import {  MagnifyingGlass, Trash } from "phosphor-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "sonner"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/context";
import { useModal } from "../../hooks/use-modal-store";
import { DataTableModal } from "../../componentsModal/data-table";

import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";

import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { LinhaTempoDisciplinas } from "./linha-tempo-disciplinas";
import { PainelDisciplinas } from "./painel-disciplinas";
import { columnsDepartament } from "../../componentsModal/columns-researchers-departament";
import { DocentesDepartamentoDisplay } from "./docentes-departamento";



interface YearSemester {
  year:string
  semester:string
}

interface Patrimonio {
  dep_id:string
  org_cod: string
  dep_nom: string
  dep_des: string
  dep_email: string
  dep_site: string
  dep_tel: string
  img_data:string
  dep_sigla: string
   onMenuState:(newResearcher: boolean) => void;
   menu_state:boolean
  }

  export interface PesquisadorProps {
    lattes_id: string
    name: string
    researcher_id: string
    dep_id: string
  }
  
  export interface PesquisadorProps2 {
    name: string
    lattes_id: string
    researcher_id: string
    institution_id: string
  }

  function generateYearSemesterArray(startYear: number, startSemester: number, endYear: number, endSemester: number): YearSemester[] {
    const result: YearSemester[] = [];
    for (let year = startYear; year <= endYear; year++) {
      for (let semester = 1; semester <= 2; semester++) {
        if (year === endYear && semester > endSemester) break;
        result.push({ year: year.toString(), semester: semester.toString() });
      }
    }
    return result;
  }
  
  
  
  

export function DisplayItemDepartamento(props:Patrimonio) {

      const { urlGeralAdm } = useContext(UserContext);
      const { onOpen, isOpen, type:typeModal } = useModal();

    
    


      const [researcher, setResearcher] = useState<PesquisadorProps[]>([]);

      const urlGetResearcher = `${urlGeralAdm}departamentos/researcher?dep_id=${props.dep_id}`;

      const fetchDataAll = async () => {
        try {
          const response = await fetch(urlGetResearcher, {
            mode: "cors",
            method: 'GET',
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
            // Certifique-se de que cada researcher tenha o graduate_program_id correto
            const researchersWithGraduateProgramId = data.map((researcher: PesquisadorProps) => ({
              ...researcher,
              dep_id: props.dep_id,
            }));
            setResearcher(researchersWithGraduateProgramId);
          }
        } catch (err) {
          console.log(err);
        }
      }

console.log(researcher)
console.log(urlGetResearcher)

      const [tab, setTab] = useState('all')

      const [input, setInput] = useState('')

    
  


       //listar todos os pesquisadores popover
       const [pesquisadoreSelecionado, setPesquisadorSelecionado] = useState<PesquisadorProps2 | undefined>();


    const [researcherSearch, setResearcherSearch] = useState<PesquisadorProps2[]>([]);
  
    const urlGetResearcherSearch = urlGeralAdm + `ResearcherRest/Query?institution_id=&name=&count= `;
  
    console.log(urlGetResearcherSearch)
    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(urlGetResearcherSearch, {
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
            setResearcherSearch(data);
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();

     
    }, [urlGetResearcherSearch, props.dep_id]);

    const [openPopo2, setOpenPopo2] = useState(false)

    const normalizeString = (str:any) => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
    };
    
    const filteredList = researcherSearch.filter((framework) =>
      normalizeString(framework.name).includes(normalizeString(input))
    );
const handleSubmit = async () => {
     
  
      try {
        const data = [
          {
            dep_id: props.dep_id,
            researcher_id:pesquisadoreSelecionado?.researcher_id
            }
        ]
  

  
        let urlProgram = urlGeralAdm + 'ResearcherRest/departament'
  
  
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
             
              toast("Dados enviados com sucesso", {
                  description: "Pesquisador adicionado no programa de pós-graduação",
                  action: {
                    label: "Fechar",
                    onClick: () => console.log("Undo"),
                  },
                })
  
                fetchDataAll()
                setPesquisadorSelecionado(undefined);
             
            } else {
              console.error('Erro ao enviar dados para o servidor.');
              toast("Tente novamente!", {
                  description: "Erro ao cadastrar pesquisador ao programa",
                  action: {
                    label: "Fechar",
                    onClick: () => console.log("Undo"),
                  },
                })
            }
            
          } catch (err) {
            console.log(err);
          } 
        };
        fetchData();
  
  
        
      } catch (error) {
          toast("Erro ao processar requisição", {
              description: "Tente novamente!",
              action: {
                label: "Fechar",
                onClick: () => console.log("Undo"),
              },
            })
      }
    };


    //
    const [yearDocentes, setYearDocentes] = useState<YearSemester[]>([]);

    let urlYearDocentes = urlGeralAdm + `departamentos/disciplinas/semestres?dep_id=${props.dep_id}`

    console.log(urlYearDocentes)

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(urlYearDocentes , {
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
              setYearDocentes(data)
          }
        } catch (err) {
          console.log(err);
        }
      };
      fetchData()

    }, [urlYearDocentes]);

    const currentYear = new Date().getFullYear();
    const currentSemester = new Date().getMonth() < 6 ? 1 : 2;
  
    const yearSemesterArray = generateYearSemesterArray(2010, 1, currentYear, currentSemester);
  
    const items = yearSemesterArray.map(item => ({
      ...item,
      selected: yearDocentes.some(docente => docente.year === item.year && docente.semester === item.semester)
    }));


  
    useEffect(() => {
  
      fetchDataAll()
      setTab('all')

      }, [urlGeralAdm, props.dep_id]);

      useEffect(() => {
        if (typeModal === 'confirm-delete-researcher-departament'  && !isOpen) {
          fetchDataAll()
        } 
    
        fetchDataAll()
      }, [isOpen, typeModal]);


    return(
      <Tabs defaultValue={tab} value={tab} className="h-full" >
        <div className="flex border dark:border-neutral-800 flex-col sticky top-[68px] z-[3] rounded-lg bg-white dark:bg-black">
      <div className="flex items-center p-2  justify-between">
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
              <Button variant="ghost" size="icon"  onClick={() => onOpen('edit-departamento', {
          dep_id:props.dep_id,
          org_cod:props.org_cod,
          dep_nom:props.dep_nom,
          dep_des:props.dep_des,
          dep_email:props.dep_email,
          dep_site:props.dep_site,
          dep_tel:props.dep_tel,
          img_data:props.img_data,
          dep_sigla:props.dep_sigla
            
            })} >
              <PencilLine size={16}/>
               
              </Button>
            </TooltipTrigger>
            <TooltipContent>Editar</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Link to={`/departamentos?dep_id=${props.dep_id}`} target="_blank">
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
                <TabsTrigger value="tec" onClick={() => setTab('tec')} className="text-zinc-600 dark:text-zinc-200">Técnicos</TabsTrigger>
                <TabsTrigger value="dis" onClick={() => setTab('dis')} className="text-zinc-600 dark:text-zinc-200">Disciplinas</TabsTrigger>
                </TabsList>

                <Tooltip>
            <TooltipTrigger asChild>
              <Button onClick={() => onOpen('confirm-delete-departamento', {id_delete:props.dep_id , name:props.dep_nom})}  variant='destructive' size="icon"   >
             <Trash size={16}/>
                <span className="sr-only">Arquivar</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Deletar programa</TooltipContent>
          </Tooltip>
        </div>
        </div>
        

        <div >

      
        </div>
        </div>

        <div className="h-ful mt-8 border sticky top-[156px]   rounded-lg   dark:border-neutral-800" >
       <TabsContent value="all" className="mt-0">
          <div className="md:p-8 p-4 ">
          <h1 className=" max-w-[700px] text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]  md:block mb-3 ">
          {props.dep_sigla} - {props.dep_nom}
        </h1>

        <div className="flex flex-wrap gap-4 mb-4 md:mb-8 ">
  <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Hash size={12}/>CÓDIGO: {props.org_cod}</div>
  <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Hash size={12}/>{props.dep_sigla}</div>
  </div>

  <div className=" py-0 md:py-0">
        <div className="mb-4 md:mb-8">
            <div
                    className={`h-3 w-full rounded-t-md dark:border-neutral-800 border border-neutral-200 border-b-0 bg-[#719CB8]  `}
                  ></div>
  
              <Alert
                        className="p-0 rounded-t-none"  x-chunk="dashboard-05-chunk-4"
                      >
  
  <CardHeader className="flex flex-row items-start bg-neutral-100 dark:bg-neutral-800">
              <div className="flex items-center justify-between w-full">
                <CardTitle className="group flex items-center w-fit gap-2 text-lg">
                  <div className="w-fit">Informações</div>
              
                </CardTitle>
<div className="flex gap-4 items-center justify-end flex-wrap ">
<div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Mail size={16}/> {props.dep_email}</div>


<Link to={props.dep_site} target="_blank"><div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Globe size={16}/> {props.dep_site}</div></Link>
<div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Phone size={16}/> {props.dep_tel}</div>

</div>
              </div>
              <div className="ml-auto flex items-center gap-1">
               
               
              </div>
              
            </CardHeader>

            <CardContent className="p-6 text-sm">
              {props.dep_des}
            </CardContent>
          </Alert>
            </div>

        </div>

        </div>

        
              
            
        </TabsContent>

        <TabsContent value="unread" className="mt-0">
        <div className="  ">
          <DocentesDepartamentoDisplay  graduate_program_id={props.dep_id}/>
        </div>
       
        </TabsContent>

        <TabsContent value="dis" className="mt-0 p-4 md:p-8">
        
        <div className="grid grid-cols-1">
                 <LinhaTempoDisciplinas items={items} depId={props.dep_id} />
                 </div>

                 <PainelDisciplinas dep_id={props.dep_id}/>
     
        </TabsContent>
       </div>
        </Tabs>
    )
}