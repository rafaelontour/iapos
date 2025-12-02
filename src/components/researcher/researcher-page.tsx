import { ArrowLeftFromLine, ArrowRightFromLine, BookOpen, BookOpenText, Briefcase, Check, ChevronLeft, Download, File, Files, FolderKanban, Minus, MoreHorizontal, OctagonAlert, Plus, Stamp, Ticket, TrendingUp, Waypoints, X } from "lucide-react";
import { FileCsv, Quotes, ShareNetwork, Student } from "phosphor-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../hooks/use-modal-store";
import { Helmet } from "react-helmet";
import html2pdf from 'html2pdf.js';
import { DrawerHeader } from "../../components/ui/drawer"
import { Button } from "../ui/button";
import { useEffect, useMemo, useState, useContext } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet"
import { InformationResearcher } from "../popup/information-researcher";
import { UserContext } from "../../context/context";
import QRCode from "react-qr-code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { BracketsCurly, Buildings, CalendarBlank } from "phosphor-react";
import { NuvemPalavras } from "../popup/nuvem-palavras";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { TotalViewResearcher } from "../popup/total-view-researcher";
import { InformacoesGeraisResearcher } from "../popup/informacoes-gerais-researcher";
import { ArticlesResearcherPopUp } from "../popup/articles-researcher";
import { BooksResearcherPopUp } from "../popup/book-researcher";
import { ProducaoTecnicaResearcherPopUp } from "../popup/producao-tecnica-researcher";
import { OrientacoesResearcherPopUp } from "../popup/orientacoes-researcher";
import { RelatorioTecnicoResearcherPopUp } from "../popup/relatorio-tecnico-researcher";
import { SpeakerResearcherPopUp } from "../popup/speaker-researcher";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Copy } from "lucide-react";
import { toast } from "sonner"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { TimeLineResearcher } from "./timeline-researcher";
import { DialogHeader } from "../ui/dialog";
import { FilterYearTimeLine } from "../popup/filters-year-timeline";
import { Skeleton } from "../ui/skeleton";
import { ResearcherIndicators } from "./researcher-indicators";
import { AlertDescription, AlertTitle } from "../ui/alert";
import { ResearchProject } from "../popup/research-project";
import { RelevanceProduction } from "../popup/relevance-production"; // Mantido import, embora não usado explicitamente no snippet original, pode ser dependência indireta
import { TextoRevista } from "../popup/texto-revista";
import { WorkEvent } from "../popup/trabalho-evento";
import { CargosFuncoes } from "../popup/cargos-funcoes";
import { Coautores } from "../popup/coautores";
import { getInstitutionImage } from "../homepage/categorias/institutions-home/institution-image";

// --- INTERFACES ---

export interface Research {
    among: number,
    articles: number,
    book: number,
    book_chapters: number,
    id: string,
    status: boolean
    institution_id: string
    name: string,
    university: string,
    lattes_id: string,
    area: string,
    lattes_10_id: string,
    abstract: string,
    city: string,
    orcid: string,
    image: string
    graduation: string,
    patent: string,
    software: string,
    brand: string,
    lattes_update: Date,
    entradanaufmg: Date
    genero: string
    h_index: string,
    relevance_score: string,
    works_count: string,
    cited_by_count: string,
    i10_index: string,
    scopus: string,
    openalex: string,
    classification: string
    subsidy: Bolsistas[]
    graduate_programs: GraduatePrograms[]
    departments: Departments[]
    research_groups: ResearchGroups[]
    relevance_itens: number
    cargo: string
    clas: string
    classe: string
    rt: string
    situacao: string
    year_filter: string
}

interface Bolsistas {
    aid_quantity: string
    call_title: string
    funding_program_name: string
    modality_code: string
    category_level_code: string
    institute_name: string
    modality_name: string
    scholarship_quantity: string
}

interface GraduatePrograms {
    graduate_program_id: string
    name: string
}

interface Departments {
    dep_des: string
    dep_email: string
    dep_nom: string
    dep_id: string
    dep_sigla: string
    dep_site: string
    dep_tel: string
    img_data: string
}

interface ResearchGroups {
    area: string
    group_id: string
    name: string
}

// --- FUNÇÕES AUXILIARES (PURE FUNCTIONS) ---

const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

function parseTerms(formatted: string): { term: string }[] {
    let result: { term: string }[] = [];
    let temp = '';
    let inGroup = false;

    for (let i = 0; i < formatted.length; i++) {
        const char = formatted[i];

        if (char === '(') {
            inGroup = true;
            if (temp.trim()) {
                result.push({ term: temp.trim() + '|' });
                temp = '';
            }
        } else if (char === ')') {
            inGroup = false;
            if (temp.trim()) {
                result.push({ term: temp.trim() + ';' });
                temp = '';
            }
        } else if (char === '|' && !inGroup) {
            if (temp.trim()) {
                result.push({ term: temp.trim() + '|' });
                temp = '';
            }
        } else {
            temp += char;
        }
    }

    if (temp.trim()) {
        result.push({ term: temp.trim() });
    }

    return result.map(item => {
        if (item.term.endsWith('|') || item.term.endsWith(';')) {
            item.term = item.term.slice(0, -1);
        }
        return item;
    });
}

const convertJsonToCsv = (json: any[]): string => {
    if (!json || json.length === 0) return '';
    const items = json;
    const replacer = (_: string, value: any) => (value === null ? '' : value);
    const header = Object.keys(items[0]);
    const csv = [
        '\uFEFF' + header.join(';'),
        ...items.map((item) =>
            header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(';')
        )
    ].join('\r\n');

    return csv;
};

function generateNameVariations(name: string): string[] {
    const parts = name.toUpperCase().split(' ');
    const lastName = parts[parts.length - 1];
    const initials = parts.map(part => part[0]).join('. ');
    const initialsWithDots = initials.replace(/ /g, '.');
    const firstAndMiddleNames = parts.slice(0, -1).join(' ');
    const variations = [
        `${lastName.toUpperCase()}, ${initials.toUpperCase()}`,
        `${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}, ${initials.toUpperCase()}`,
        `${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}, ${initialsWithDots.toUpperCase()}`,
        `${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}, ${firstAndMiddleNames.charAt(0).toUpperCase() + firstAndMiddleNames.slice(1).toLowerCase()} ${initials.toUpperCase()}`,
        `${lastName.toUpperCase()}, ${firstAndMiddleNames.charAt(0).toUpperCase()}`,
        `${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}, ${firstAndMiddleNames.charAt(0).toUpperCase() + firstAndMiddleNames.slice(1).toLowerCase()}`,
        `${lastName.toUpperCase()}, ${firstAndMiddleNames.toUpperCase()}`,
        `${lastName.toUpperCase()}, ${firstAndMiddleNames.charAt(0).toUpperCase() + firstAndMiddleNames.slice(1).toLowerCase()} ${initialsWithDots.toUpperCase()}`,
        `${parts[parts.length - 2].toUpperCase()} ${lastName.toUpperCase()}, ${firstAndMiddleNames.toUpperCase()}`,
        `${lastName.toUpperCase()}, ${initials.charAt(0).toUpperCase()}`,
        `${lastName.toUpperCase()}, ${name.toUpperCase()}`,
        `${lastName.toUpperCase()}, ${firstAndMiddleNames.charAt(0).toUpperCase() + firstAndMiddleNames.slice(1).toLowerCase()} ${initials.toUpperCase()}`,
        `${initials.charAt(0).toUpperCase()}. ${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}, ${initials.toUpperCase()}`,
        `${initialsWithDots.toUpperCase()} ${lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()}`,
        `${initialsWithDots.toUpperCase()} ${lastName.toUpperCase()}`
    ];

    return variations;
}

// --- COMPONENTE PRINCIPAL ---

export function ResearcherPage() {
    const { urlGeral, user, itemsSelecionados, setSearchType, setValoresSelecionadosExport, setItensSelecionadosPopUp, searchType, valoresSelecionadosExport, setPesquisadoresSelecionados, pesquisadoresSelecionados, setItensSelecionados, permission } = useContext(UserContext);
    const history = useNavigate();
    const queryUrl = useQuery();
    const { onClose, isOpen } = useModal();

    const type_search = queryUrl.get('type_search');
    const terms = queryUrl.get('terms');

    const researcher_name = queryUrl.get('researcher_name');
    const lattes_id = queryUrl.get('lattes_id');

    const [researcher, setResearcher] = useState<Research[]>([]);
    const [loading, isLoading] = useState(false);
    const [filters, setFilters] = useState<{ year: number[], qualis: string[] }[]>([]);
    const [open, setOpen] = useState(false);
    const [variations, setVariations] = useState<string[]>([]);
    const [value, setValue] = useState('articles');
    const [jsonData, setJsonData] = useState<any[]>([]);
    const [tab, setTab] = useState('all');
    const [isOpenSheet, setIsOpenSheet] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);

    const handleVoltar = () => {
        history(-1);
    }

    const handleResearcherUpdate = (newResearcherData: any) => {
        setFilters(newResearcherData);
    };

    // Effects
    useEffect(() => {
        if (terms) {
            const parsedTerms = parseTerms(String(terms));
            setItensSelecionados(parsedTerms);
        }
    }, []);

    useEffect(() => {
        setSearchType(String(type_search || ''));
        setValoresSelecionadosExport(terms || '')
    }, []);

    useMemo(() => {
        setItensSelecionadosPopUp(itemsSelecionados)
    }, [itemsSelecionados]);

    useMemo(() => {
        setOpen(false)
        setItensSelecionadosPopUp(itemsSelecionados)

        if (researcher_name != undefined) {
            setVariations(generateNameVariations(researcher_name))
        }
    }, [isOpen]);


    let urlTermPesquisadores: string;

    if (researcher_name) {
        urlTermPesquisadores = `${urlGeral}researcherName?name=${researcher_name}`;
    } else if (lattes_id) {
        urlTermPesquisadores = `${urlGeral}researcherName?lattes_id=${lattes_id}`;
    }

    useMemo(() => {
        const fetchData = async () => {
            try {
                isLoading(true)
                const response = await fetch(urlTermPesquisadores, {
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
                    setResearcher(data);
                    isLoading(false)
                    console.log(researcher)
                }
                if (data.length == 0 && isOpen) {
                    onClose()
                    toast("Pesquisador(a) ainda não cerregado na base", {
                        description: "Tente novamente mais tarde",
                        action: {
                            label: "Fechar",
                            onClick: () => console.log("Undo"),
                        },
                    });
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [urlTermPesquisadores]);

    useEffect(() => {
        if (searchType == 'article' || searchType == 'name' || searchType == 'abstract' || searchType == 'area') {
            setValue('article')
        } else if (searchType == 'book') {
            setValue('book')
        } else if (searchType == 'patent') {
            setValue('producao-tecnica')
        } else if (searchType == 'patente') {
            setValue('producao-tecnica')
        } else if (searchType == 'speaker') {
            setValue('speaker')
        }
    }, [isOpen]);

    let urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=${terms}&researcher_id=${(researcher.slice(0, 1).map((props) => (props.id)))}&type=ARTICLE&qualis=&year=1900`;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(urlPublicacoesPorPesquisador, {
                    mode: 'cors',
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'GET',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Max-Age': '3600',
                        'Content-Type': 'text/plain'
                    }
                });
                const data = await response.json();
                if (data) {
                    setJsonData(data)
                }
            } catch (err) {
                console.log(err);
            }
        };
        fetchData();
    }, [urlPublicacoesPorPesquisador]);

    const has_visualizar_indices_pesquisador = permission.some(
        (perm) => perm.permission === 'visualizar_indices_pesquisador'
    );

    useEffect(() => {
        if (!has_visualizar_indices_pesquisador) {
            setTab('all')
        }
    }, [permission]);

    const handleDownloadJson = async () => {
        try {
            const csvData = convertJsonToCsv(jsonData);
            const blob = new Blob([csvData], { type: 'text/csv;charset=windows-1252;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.download = `dados.csv`;
            link.href = url;
            link.click();
        } catch (error) {
            console.error(error);
        }
    };

    const hasBaremaAvaliacao = permission.some(
        (perm) => perm.permission === 'criar_barema_avaliacao'
    );

    useEffect(() => {
        const fetchImage = async () => {
            if (researcher.length > 0) {
                const url = await getInstitutionImage(researcher[0].institution_id);
                setImageUrl(url);
            }
        };
        fetchImage();
    }, [researcher]);

    const yearString = filters.length > 0 ? filters[0].year.join(';') : '';

    return (
        <html className="w-full grid grid-cols-1">
            <Helmet>
                <title>{researcher_name} | Iapos</title>
                <meta name="description" content={`${researcher_name} | Iapos`} />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <main className="flex flex-1 flex-col  p-4 md:p-8 ">
                <Tabs defaultValue={tab} value={tab} className="h-full grid grid-cols-1" >
                    <div className="w-full  gap-4 m pb-0 md:pb-0 grid grid-cols-1">
                        <div className="flex items-center gap-4">

                            <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7">
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Voltar</span>
                            </Button>

                            <div className="flex gap-3  items-center">
                                <TabsList>
                                    <TabsTrigger value="all" onClick={() => setTab('all')}>Visão geral</TabsTrigger>
                                    <TabsTrigger disabled={!has_visualizar_indices_pesquisador} value="indicators" onClick={() => setTab('indicators')}>Indicadores de produção</TabsTrigger>
                                    {(researcher.length > 0 && (user?.display_name == researcher[0].name)) && (
                                        <TabsTrigger value="indicators" onClick={() => setTab('provimento')}>Provimento de cargo</TabsTrigger>
                                    )}
                                </TabsList>
                            </div>

                            {/* Actions Component extracted */}
                            <ResearcherActions
                                researcher={researcher}
                                isOpenSheet={isOpenSheet}
                                setIsOpenSheet={setIsOpenSheet}
                                yearString={yearString}
                                handleResearcherUpdate={handleResearcherUpdate}
                                hasBaremaAvaliacao={hasBaremaAvaliacao}
                                pesquisadoresSelecionados={pesquisadoresSelecionados}
                                setPesquisadoresSelecionados={setPesquisadoresSelecionados}
                                handleDownloadJson={handleDownloadJson}
                                open={open}
                                setOpen={setOpen}
                                urlGeral={urlGeral}
                                searchType={searchType}
                                valoresSelecionadosExport={valoresSelecionadosExport}
                            />
                        </div>
                    </div>

                    <TabsContent value="all" className="">

                        <ProfileHeader researcher={researcher} urlGeral={urlGeral} imageUrl={imageUrl} />

                        <div className=" ">
                            {researcher.length == 0 ? (
                                <div>
                                    <div className=" w-full flex-col flex items-center justify-center">
                                        <Skeleton className="w-28 h-28 rounded-md mb-4 md:mb-4"></Skeleton>
                                        <Skeleton className="w-full max-w-[400px] h-8 rounded-md mb-4 md:mb-8"></Skeleton>
                                    </div>
                                    <Skeleton className="w-full h-[150px] rounded-md"></Skeleton>

                                    <div className="flex md:gap-8 gap-4 md:flex-row flex-col md:mt-8 mt-4">
                                        <Skeleton className="w-full flex flex-1 h-[600px] rounded-md "></Skeleton>
                                        <Skeleton className="md:w-[350px] h-[600px] rounded-md"></Skeleton>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1   " >
                                    <DrawerHeader className="p-0 grid grid-cols-1  ">
                                        {researcher.slice(0, 1).map((user) => {
                                            return (
                                                <div className="w-fit">
                                                    <InformationResearcher
                                                        {...user} // Pass all user props
                                                        openAPI={open}
                                                    />
                                                </div>
                                            )
                                        })}

                                        {user?.lattes_id == researcher[0].lattes_id && (
                                            <div className="bg-red-50 mb-6 flex gap-3 dark:bg-red-200/20 w-full p-8 rounded-md">
                                                <div>  <OctagonAlert size={24} /></div>
                                                <div>
                                                    <AlertTitle className="whitespace-normal">Dados da publicações</AlertTitle>
                                                    <AlertDescription className="whitespace-normal">
                                                        A plataforma gerencia publicações extraídas do currículo Lattes, associando o Qualis da revista conforme registrado na Plataforma Sucupira, além de integrar dados da base Journal Citation Reports (JCR) e do banco de dados Open Alex. Caso o artigo seja classificado como Qualis "Sem Qualificação" (SQ), recomendamos verificar o cadastro do nome da revista na plataforma Lattes.
                                                    </AlertDescription>
                                                </div></div>
                                        )}

                                        <div className="grid grid-cols-1">
                                            <div className="flex gap-6 xl:flex-row flex-col-reverse">

                                                {/* Tabs Sections extracted */}
                                                <PublicationsTabs
                                                    researcher={researcher}
                                                    value={value}
                                                    setValue={setValue}
                                                />

                                                {/* Sidebar Masonry extracted */}
                                                <SidebarMasonry
                                                    researcher={researcher}
                                                    variations={variations}
                                                />

                                            </div>
                                        </div>
                                    </DrawerHeader>
                                </div>
                            )}
                        </div>
                    </TabsContent>

                    <TabsContent value="indicators">
                        {researcher.slice(0, 1).map((user) => (
                            <ResearcherIndicators
                                {...user}
                                year_filter={yearString}
                                status={false}
                                institution_id={""}
                                genero={""}
                                classification={""}
                                relevance_itens={0}
                            />
                        ))}
                    </TabsContent>
                </Tabs>
            </main>
        </html>
    )
}


// --- COMPONENTES FILHOS (SUB-COMPONENTS) ---

function TimelineSheet({ isOpenSheet, setIsOpenSheet, researcher, yearString, handleResearcherUpdate }: any) {
    const [expand, setExpand] = useState(false)

    const handleDownload = () => {
        const element = document.getElementById('content-to-pdf');
        if (element) {
            const options = {
                filename: 'linha_tempo.pdf',
                html2canvas: {
                    scale: 2,
                    useCORS: true,
                    logging: true
                },
                jsPDF: {
                    unit: 'mm',
                    format: 'a4',
                    orientation: 'portrait'
                },
                pagebreak: {
                    mode: ['avoid-all', 'css', 'legacy']
                }
            };

            html2pdf()
                .from(element)
                .set(options)
                .save();
        }
    };

    return (
        <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
            <SheetTrigger>
                <Button onClick={() => setExpand(false)} className="h-8" size={'sm'}><TrendingUp size={16} />Linha do tempo</Button>
            </SheetTrigger>
            <SheetContent className={`p-0 dark:bg-neutral-900 w-screen dark:border-gray-600 ${expand ? ('md:min-w-[80vw]') : ('md:min-w-[50vw]')}`}>
                <DialogHeader className="h-[50px] justify-center px-4 border-b">
                    <div className="flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="hidden lg:flex h-8 w-8" onClick={() => setExpand(!expand)} variant={'outline'} size={'icon'}>{expand ? (<ArrowRightFromLine size={16} />) : (<ArrowLeftFromLine size={16} />)}</Button>
                                    </TooltipTrigger>
                                    <TooltipContent> {expand ? ('Recolher') : ('Expandir')}</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>

                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button className="h-8 w-8" variant={'outline'} onClick={() => setIsOpenSheet(false)} size={'icon'}><X size={16} /></Button>
                                    </TooltipTrigger>
                                    <TooltipContent> Fechar</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                        <div className="hidden md:flex md:justify-end">
                            <div className="flex items-center justify-end gap-3 ml-auto">
                                <Button onClick={handleDownload} className="ml-auto relative h-8 px-2">
                                    <Download size={16} /> Baixar linha do tempo
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 pb-0">
                    <p className="max-w-[750px] mb-2 text-lg font-light text-foreground">
                        Trajetória do(a) pesquisador(a)
                    </p>
                    <h1 className="max-w-[500px] text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
                        Linha do tempo
                    </h1>
                    <div className="my-6 border-b dark:border-b-neutral-800"></div>
                    <FilterYearTimeLine onFilterUpdate={handleResearcherUpdate} />
                </div>

                {researcher.slice(0, 1).map((user: any) => {
                    return (
                        <div >
                            <TimeLineResearcher
                                {...user}
                                year_filter={yearString}
                                status={false}
                                institution_id={""}
                                genero={""}
                                classification={""}
                                relevance_itens={0}
                            />
                        </div>
                    )
                })}
            </SheetContent>
        </Sheet>
    )
}

function ResearcherActions({ researcher, isOpenSheet, setIsOpenSheet, yearString, handleResearcherUpdate, hasBaremaAvaliacao, pesquisadoresSelecionados, setPesquisadoresSelecionados, handleDownloadJson, open, setOpen, urlGeral, searchType, valoresSelecionadosExport }: any) {
    const currentUrl = window.location.origin

    return (
        <div className="flex gap-2 items-center md:ml-auto">
            {researcher.slice(0, 1).map((props: any) => {
                let urlShare = `${currentUrl}/researcher?researcher_name=${props.name}&search_type=${searchType}&terms=${valoresSelecionadosExport}`

                if (searchType == 'name') {
                    urlShare = `${currentUrl}/researcher?researcher_name=${props.name}&search_type=${searchType}&terms=`
                }
                const payment = props.lattes_id

                const currentDate = new Date();
                const lattesUpdate = String(props.lattes_update).split('/');
                const lattesMonth = parseInt(lattesUpdate[1]);
                const lattesYear = parseInt(lattesUpdate[2]);

                const monthDifference = (currentDate.getFullYear() - lattesYear) * 12 + (currentDate.getMonth() + 1 - lattesMonth);

                const isOutdated = monthDifference > 3;
                const isOutdated6 = monthDifference > 6;

                return (
                    <div className="hidden items-center gap-2  md:flex">
                        <div className={`border hidden dark:border-neutral-800 w-fit py-2 px-4 text-gray-400 rounded-md text-xs font-bold lg:flex gap-1 items-center ${isOutdated6 ? ('bg-red-500 text-white border-none') : isOutdated ? ('bg-yellow-600 text-white border-none') : ('')}`}> <CalendarBlank size={16} /> Atualização do Lattes: {String(props.lattes_update)}</div>

                        {researcher.slice(0, 1).map((user: any) => {
                            return (
                                <div className={`hidden text-[0.5rem] py-2 px-4 border dark:border-neutral-800 w-fit rounded-md  font-bold gap-1 items-center md:text-xs md:py-2 md:px-4  lg:flex text-white border-none ${user.status ? ('bg-green-500 ') : ('bg-red-500')} `}>
                                    {user.status ? (<Check size={16} />) : (<Minus size={16} />)} {user.status ? ('Ativo') : ('Inativo')}
                                </div>
                            )
                        })}

                        <div className="flex gap-3 items-center">
                            <TimelineSheet
                                isOpenSheet={isOpenSheet}
                                setIsOpenSheet={setIsOpenSheet}
                                researcher={researcher}
                                yearString={yearString}
                                handleResearcherUpdate={handleResearcherUpdate}
                            />

                            {hasBaremaAvaliacao && (
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant={'default'}
                                                onClick={() => {
                                                    if (pesquisadoresSelecionados.some((pesquisador: any) => pesquisador.name === props.name)) {
                                                        setPesquisadoresSelecionados((prev: any[]) => prev.filter(pesquisador => pesquisador.name !== props.name));
                                                    } else {
                                                        setPesquisadoresSelecionados((prev: any[]) => [
                                                            ...prev,
                                                            {
                                                                id: props.id,
                                                                name: props.name,
                                                                university: props.university,
                                                                lattes_id: props.lattes_id,
                                                                city: props.city,
                                                                area: props.area,
                                                                graduation: props.graduation,
                                                            }
                                                        ]);
                                                    }
                                                }}
                                                className={`h-8 w-8 p-0 text-white dark:text-white ${pesquisadoresSelecionados.some((pesquisador: any) => pesquisador.name === props.name) && 'bg-red-500 hover:bg-red-600 text-white'}`}
                                            >
                                                {pesquisadoresSelecionados.some((pesquisador: any) => pesquisador.name === props.name) ? (
                                                    <X size={16} className="" />
                                                ) : (
                                                    <Plus size={16} className="" />
                                                )}
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent> {pesquisadoresSelecionados.some((pesquisador: any) => pesquisador.name === props.name) ? (
                                            'Remover pesquisador(a) do barema'
                                        ) : (
                                            'Adicionar pesquisador(a) ao barema'
                                        )}</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )}

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                    <DropdownMenuItem className="flex items-center gap-3"
                                        onClick={() => {
                                            navigator.clipboard.writeText(payment)
                                            toast("Operação realizada", {
                                                description: "Lattes ID copiado para área de transferência",
                                                action: {
                                                    label: "Fechar",
                                                    onClick: () => console.log("Undo"),
                                                },
                                            })
                                        }}
                                    ><Copy className="h-4 w-4" />
                                        Copiar Lattes ID
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className="flex items-center gap-3" onClick={() => handleDownloadJson()}><FileCsv className="h-4 w-4" />CSV dos artigos</DropdownMenuItem>

                                    <Link to={`${urlGeral}dictionary.pdf`}>
                                        <DropdownMenuItem className="flex items-center gap-3" ><File className="h-4 w-4" />Dicionário de dados</DropdownMenuItem></Link>

                                    <DropdownMenuItem className="flex items-center gap-3" onClick={() => setOpen(!open)} ><BracketsCurly className="h-4 w-4" />API da consulta</DropdownMenuItem>

                                    <DropdownMenuItem className="flex items-center gap-3"
                                        onClick={() => {
                                            navigator.clipboard.writeText(urlShare)
                                            toast("Operação realizada", {
                                                description: "Link copiado para área de transferência",
                                                action: {
                                                    label: "Fechar",
                                                    onClick: () => console.log("Undo"),
                                                },
                                            })
                                        }}
                                    ><ShareNetwork className="h-4 w-4" />
                                        Copiar link para compartilhar

                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex justify-center py-4">
                                        <QRCode size={200} className={'bg-transparent'} value={urlShare} />
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

function ProfileHeader({ researcher, urlGeral, imageUrl }: any) {
    return (
        <>
            {researcher.slice(0, 1).map((user: any) => {
                return (
                    <div className="w-full flex justify-center ">
                        <div className="bg-cover bg-center bg-no-repeat h-28 w-28  rounded-2xl mb-3 border-4 border-white dark:border-neutral-950    " style={{ backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${user.id}) ` }}></div>
                    </div>
                )
            })}

            {researcher.slice(0, 1).map((props: any) => {
                return (
                    <div className="flex items-center flex-col  relative">
                        <h4 className="text-3xl font-medium px-8 text-center mb-2">{props.name}</h4>
                        <div className="flex text-gray-500 items-center gap-2 mb-2">
                            {!imageUrl ? (
                                <Buildings size={16} className="" />
                            ) : (
                                <img src={imageUrl || ''} alt="" className="h-6" />
                            )}
                            <p className="text-md  ">{props.university}</p>
                        </div>
                    </div>
                )
            })}
        </>
    )
}

function PublicationsTabs({ researcher, value, setValue }: any) {
    return (
        <div className="grid grid-cols-1">
            <div className="w-full flex-1 flex">
                <Tabs defaultValue="articles" value={value} className="flex-1 flex flex-col w-full">
                    {researcher.slice(0, 1).map(() => (
                        <div className="grid grid-cols-1 w-full">
                            <ScrollArea className="mb-4">
                                <TabsList className="mb-4 flex h-auto w-full">
                                    <TabsTrigger value="article" onClick={() => setValue('article')} className="flex gap-2 items-center">
                                        <Quotes size={16} className="" />Artigos
                                    </TabsTrigger>
                                    <TabsTrigger value="book" onClick={() => setValue('book')} className="flex gap-2 items-center">
                                        <BookOpen size={16} className="" />Livros e capítulos
                                    </TabsTrigger>
                                    <TabsTrigger value="producao-tecnica" onClick={() => setValue('producao-tecnica')} className="flex gap-2 items-center">
                                        <Stamp size={16} className="" />Produção técnica
                                    </TabsTrigger>
                                    <TabsTrigger value="relatorio-tecnico" onClick={() => setValue('relatorio-tecnico')} className="flex gap-2 items-center">
                                        <Files size={16} className="" />Relatório técnico
                                    </TabsTrigger>
                                    <TabsTrigger value="orientacoes" onClick={() => setValue('orientacoes')} className="flex gap-2 items-center">
                                        <Student size={16} className="" />Orientações
                                    </TabsTrigger>
                                    <TabsTrigger value="speaker" onClick={() => setValue('speaker')} className="flex gap-2 items-center">
                                        <Ticket size={16} className="" />Participação em eventos
                                    </TabsTrigger>
                                    <TabsTrigger value="research-project" onClick={() => setValue('research-project')} className="flex gap-2 items-center">
                                        <FolderKanban size={16} className="" />Projetos de pesquisa
                                    </TabsTrigger>
                                    <TabsTrigger value="texto-revista" onClick={() => setValue('texto-revista')} className="flex gap-2 items-center">
                                        <BookOpenText size={16} className="" />Textos em revista
                                    </TabsTrigger>
                                    <TabsTrigger value="trabalho-evento" onClick={() => setValue('trabalho-evento')} className="flex gap-2 items-center">
                                        <Briefcase size={16} className="" />Trabalhos em evento
                                    </TabsTrigger>
                                    <TabsTrigger value="cargos" onClick={() => setValue('cargos')} className="flex gap-2 items-center">
                                        <Waypoints size={16} className="" />Cargos e funções
                                    </TabsTrigger>
                                </TabsList>
                                <ScrollBar orientation="horizontal" />
                            </ScrollArea>
                        </div>
                    ))}
                    <TabsContent value="article">
                        {researcher.slice(0, 1).map((user: any) => (<ArticlesResearcherPopUp name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="book">
                        {researcher.slice(0, 1).map((user: any) => (<BooksResearcherPopUp name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="producao-tecnica">
                        {researcher.slice(0, 1).map((user: any) => (<ProducaoTecnicaResearcherPopUp name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="relatorio-tecnico">
                        {researcher.slice(0, 1).map((user: any) => (<RelatorioTecnicoResearcherPopUp name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="orientacoes">
                        {researcher.slice(0, 1).map((user: any) => (<OrientacoesResearcherPopUp name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="speaker">
                        {researcher.slice(0, 1).map((user: any) => (<SpeakerResearcherPopUp name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="research-project">
                        {researcher.slice(0, 1).map((user: any) => (<ResearchProject name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="texto-revista">
                        {researcher.slice(0, 1).map((user: any) => (<TextoRevista name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="trabalho-evento">
                        {researcher.slice(0, 1).map((user: any) => (<WorkEvent name={String(user.id)} />))}
                    </TabsContent>
                    <TabsContent value="cargos">
                        {researcher.slice(0, 1).map((user: any) => (<CargosFuncoes name={String(user.id)} />))}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function SidebarMasonry({ researcher, variations }: any) {
    return (
        <div className="xl:w-[350px] min-w-[350px]  w-full grid grid-cols-1">
            <ResponsiveMasonry
                columnsCountBreakPoints={{
                    350: 1,
                    750: 1,
                    900: 1,
                    1200: 1
                }}
            >
                <Masonry gutter="24px">
                    {researcher.slice(0, 1).map((user: any) => (
                        <InformacoesGeraisResearcher
                            h_index={user.h_index}
                            relevance_score={user.relevance_score}
                            works_count={user.works_count}
                            cited_by_count={user.cited_by_count}
                            i10_index={user.i10_index}
                            scopus={user.scopus}
                            orcid={user.orcid}
                            openalex={user.openalex}
                            subsidy={user.subsidy}
                            graduate_programs={user.graduate_programs}
                            departments={user.departments}
                            classification={user.classification}
                            cargo={user.cargo}
                            clas={user.clas}
                            classe={user.classe}
                            rt={user.rt}
                            situacao={user.situacao}
                            data_atualizacao_lattes={String(user.lattes_update)}
                            research_groups={user.research_groups}
                            among={0}
                            articles={0}
                            institution_id={""}
                            book={0}
                            book_chapters={0}
                            id={""}
                            name={""}
                            university={""}
                            lattes_id={""}
                            area={""}
                            lattes_10_id={""}
                            abstract={""}
                            city={""}
                            image={""}
                            graduation={""}
                            patent={""}
                            software={""}
                            brand={""}
                            ind_prod={""}
                            status={false}
                            lattes_update={user.lattes_update}
                            abstract_ai={""}
                        />
                    ))}

                    {researcher.slice(0, 1).map((user: any) => (
                        <TotalViewResearcher
                            among={user.among}
                            articles={user.articles}
                            book={user.book}
                            book_chapters={user.book_chapters}
                            patent={user.patent}
                            software={user.software}
                            brand={user.brand}
                        />
                    ))}

                    {researcher.slice(0, 1).map((user: any) => (
                        <NuvemPalavras id={user.id} />
                    ))}

                    {researcher.slice(0, 1).map((user: any) => (
                        <Coautores id={user.id} name={user.name} />
                    ))}

                    {researcher.slice(0, 1).map(() => (
                        <div>
                            <div className="mb-6 font-medium text-2xl">Nomes de citação</div>
                            <div className="flex flex-wrap gap-1">
                                {variations.map((variation: string, index: number) => (
                                    <p className="text-xs " key={index}>{variation} /</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}