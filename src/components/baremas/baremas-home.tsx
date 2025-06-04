import { useContext, useEffect, useState } from "react";

import { Button } from "../ui/button";


type Research = {
    A1: string,
    A2: string,
    A3: string,
    A4: string,
    B1: string,
    B2: string,
    B3: string,
    B4: string,
    C: string,
    SQ: string,
    book: string,
    book_chapter: string,
    brand: string,
    event_organization: string,
    d_in_progress: string,
    d_completed: string,
    e_in_progress: string,
    e_completed: string,
    g_in_progress: string,
    g_completed: string,
    pgss_in_progress: string,
    pgss_completed: string,
    ic_in_progress: string,
    ic_completed: string,
    m_in_progress: string,
    m_completed: string,
    participation_event: string,
    patent: string,
    researcher: string,
    software: string,
    work_in_event: string,

    id: string
    name: string,
    university: string,
    lattes_id: string,
    city: string,
    area: string,
    graduation: string,
    researcher_id: string
}


interface PesquisadoresSelecionados {
    id: string,
    name: string,
    university: string,
    lattes_id: string,
    city: string,
    area: string,
    graduation: string,
}


import { ChevronLeft, ChevronsUpDown, MoreHorizontal, Plus } from "lucide-react";
import { UserContext } from "../../context/context";
import { PesquisadorItemBarema } from "./pesquisdor-item-barema";

interface GroupedCriteria {
    [key: string]: JSX.Element[];
}

interface Firebase {
    id: string
    name: string
    createdAt: string
    userId: string
    pesquisadores: PesquisadoresSelecionados[]
    grupos: Grupo[]

    anoArtigo: string
    anoWorkInEvent: string
    anoLivro: string
    anoCapLivro: string
    anoPatente: string
    anoMarca: string
    anoSoftware: string
    anoResourceProgess: string
    anoResourceCompleted: string
    anoParticipacao: string
    [`Document ID`]: string

}

interface SomaTotalPorGrupoEPesquisador {
    [grupoId: string]: {
        titulo: string;
        pesquisadores: { id: string; name: string; total: number }[];

    } | { [pesquisadorId: string]: string };
}

type PesquisadorUpdate = {
    total: number,
    id: string,
    name: string
    id_criterio: number
}

interface Categoria {
    id_criterio: number;
    criterio: string;
    pontos: string,
    pontuacao_max: string,
    id_grupo: string,
    pesquisadores: PesquisadorUpdate[]
}

interface Grupo {
    id: string;
    titulo: string;
    descricao: string;
    categorias: Categoria[];
    quantidade_max_pontos: number;
    // outras propriedades do grupo
}

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../ui/tabs"


import { GraficoBarema } from "./grafico-barema";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useModalDashboard } from "../hooks/use-modal-dashboard";
import { ProcurarBaremas } from "./procurar-barema-public";
import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home";
import { Helmet } from "react-helmet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenuLabel } from "../ui/dropdown-menu";
import { number, string } from "prop-types";
import { useQuery } from "../dashboard/builder-page/tabelas/tabela-artigos";
import { CriarBarema } from "./criar-barema";


export function BaremasHome() {

    //firebase submit

    const history = useNavigate();

    const navigate = useNavigate();
    const location = useLocation();
  
  
   

    const [tab, setTab] = useState('all')

    const { version } = useContext(UserContext)

    const queryUrl = useQuery();
    const type_search = queryUrl.get('barema_id');
  
    let baremaSelecionado = type_search || ''

    const handleVoltar = () => {

        const currentPath = location.pathname;
        const hasQueryParams = location.search.length > 0;
        
        if (hasQueryParams) {
          // Se tem query parameters, remove apenas eles
          navigate(currentPath);
        } else {
          // Se não tem query parameters, remove o último segmento do path
          const pathSegments = currentPath.split('/').filter(segment => segment !== '');
          
          if (pathSegments.length > 1) {
            pathSegments.pop();
            const previousPath = '/' + pathSegments.join('/');
            navigate(previousPath);
          } else {
            // Se estiver na raiz ou com apenas um segmento, vai para raiz
            navigate('/');
          }
        }
      };

    return (
        <>
         {baremaSelecionado.length == 0 ? (
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 ">
                <Helmet>
                <title>Baremas | Módulo administrativo | {version ? ('Conectee') : ('Simcc')} </title>
                <meta name="description" content={`Baremas | Módulo administrativo | ${version ? ('Conectee') : ('Simcc')}`} />
                <meta name="robots" content="index, follow" />
            </Helmet>
                        <div className="w-full  gap-4">
                            <div className="flex items-center gap-4">

                                <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7">
                                    <ChevronLeft className="h-4 w-4" />
                                    <span className="sr-only">Voltar</span>
                                </Button>

                                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                                    Baremas de avaliação
                                </h1>

                                <div className="hidden items-center gap-2 md:ml-auto md:flex">
                                
                                    <Button size="sm" onClick={() => setTab('new')}><Plus size={16} />Adicionar barema</Button>
                                </div>
                            </div>
                        </div>

                      
                       

                  
                </main>
         ):(
            <CriarBarema/>
         )}
        
      
                
       
        </>
    )
}