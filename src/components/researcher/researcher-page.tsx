import {
    ArrowLeftFromLine, ArrowRightFromLine, BookOpen, BookOpenText, Briefcase,
    Check, ChevronLeft, Download, File, Files, FolderKanban, Minus, MoreHorizontal,
    OctagonAlert, Plus, Stamp, Ticket, TrendingUp, Waypoints, X, Copy
} from "lucide-react";
import { FileCsv, Quotes, ShareNetwork, Student, BracketsCurly, Buildings, CalendarBlank } from "phosphor-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useModal } from "../hooks/use-modal-store";
import { Helmet } from "react-helmet";
import html2pdf from 'html2pdf.js';
import { DrawerHeader } from "../../components/ui/drawer";
import { Button } from "../ui/button";
import { useEffect, useMemo, useState, useContext } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../../components/ui/sheet";
import { InformationResearcher } from "../popup/information-researcher";
import { UserContext } from "../../context/context";
import QRCode from "react-qr-code";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { NuvemPalavras } from "../popup/nuvem-palavras";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { TotalViewResearcher } from "../popup/total-view-researcher";
import { InformacoesGeraisResearcher } from "../popup/informacoes-gerais-researcher";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { toast } from "sonner";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { TimeLineResearcher } from "./timeline-researcher";
import { DialogHeader } from "../ui/dialog";
import { FilterYearTimeLine } from "../popup/filters-year-timeline";
import { Skeleton } from "../ui/skeleton";
import { ResearcherIndicators } from "./researcher-indicators";
import { AlertDescription, AlertTitle } from "../ui/alert";
import { Coautores } from "../popup/coautores";
import { getInstitutionImage } from "../homepage/categorias/institutions-home/institution-image";

// Importações dos Popups
import { ArticlesResearcherPopUp } from "../popup/articles-researcher";
import { BooksResearcherPopUp } from "../popup/book-researcher";
import { ProducaoTecnicaResearcherPopUp } from "../popup/producao-tecnica-researcher";
import { OrientacoesResearcherPopUp } from "../popup/orientacoes-researcher";
import { RelatorioTecnicoResearcherPopUp } from "../popup/relatorio-tecnico-researcher";
import { SpeakerResearcherPopUp } from "../popup/speaker-researcher";
import { ResearchProject } from "../popup/research-project";
import { TextoRevista } from "../popup/texto-revista";
import { WorkEvent } from "../popup/trabalho-evento";
import { CargosFuncoes } from "../popup/cargos-funcoes";

// --- CONFIGURAÇÃO DAS TABS ---
const TABS_CONFIG = [
    { value: 'article', label: 'Artigos', icon: Quotes, component: ArticlesResearcherPopUp },
    { value: 'book', label: 'Livros e capítulos', icon: BookOpen, component: BooksResearcherPopUp },
    { value: 'producao-tecnica', label: 'Produção técnica', icon: Stamp, component: ProducaoTecnicaResearcherPopUp },
    { value: 'relatorio-tecnico', label: 'Relatório técnico', icon: Files, component: RelatorioTecnicoResearcherPopUp },
    { value: 'orientacoes', label: 'Orientações', icon: Student, component: OrientacoesResearcherPopUp },
    { value: 'speaker', label: 'Participação em eventos', icon: Ticket, component: SpeakerResearcherPopUp },
    { value: 'research-project', label: 'Projetos de pesquisa', icon: FolderKanban, component: ResearchProject },
    { value: 'texto-revista', label: 'Textos em revista', icon: BookOpenText, component: TextoRevista },
    { value: 'trabalho-evento', label: 'Trabalhos em evento', icon: Briefcase, component: WorkEvent },
    { value: 'cargos', label: 'Cargos e funções', icon: Waypoints, component: CargosFuncoes },
];

// --- HOOKS CUSTOMIZADOS ---

const useResearcherParams = () => {
    const query = new URLSearchParams(useLocation().search);
    const lattesId = query.get('lattes_id');
    const researcherName = query.get('researcher_name');
    const typeSearch = query.get('type_search') || '';
    const terms = query.get('terms') || '';

    const searchParam = useMemo(() => {
        if (lattesId) return { type: 'lattes_id', value: lattesId };
        if (researcherName) return { type: 'name', value: researcherName };
        return null;
    }, [lattesId, researcherName]);

    return { lattesId, researcherName, typeSearch, terms, searchParam };
};

const useResearcherData = (urlGeral: string, searchParam: { type: string, value: string } | null, isOpen: boolean) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const { onClose } = useModal();

    useEffect(() => {
        if (!searchParam || !urlGeral) return;

        const fetchResearcher = async () => {
            setLoading(true);
            try {
                const paramKey = searchParam.type === 'lattes_id' ? 'lattes_id' : 'name';
                const url = `${urlGeral}researcherName?${paramKey}=${searchParam.value}`;

                const response = await fetch(url, { headers: { "Content-Type": "text/plain" } });
                const result = await response.json();
                setData(result);

                if ((!result || result.length === 0) && isOpen) {
                    onClose();
                    toast.error("Pesquisador(a) não encontrado ou não carregado na base.");
                }
            } catch (error) {
                console.error("Erro ao buscar pesquisador:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchResearcher();
    }, [searchParam, urlGeral, isOpen, onClose]);

    return { researcher: data, loading };
};

// --- COMPONENTE PRINCIPAL ---

export function ResearcherPage() {
    const {
        urlGeral, user, itemsSelecionados, setSearchType, setValoresSelecionadosExport,
        setItensSelecionadosPopUp, setPesquisadoresSelecionados, pesquisadoresSelecionados,
        setItensSelecionados, permission
    } = useContext(UserContext);

    const navigate = useNavigate();
    const { searchParam, terms, typeSearch } = useResearcherParams();
    const { researcher, loading } = useResearcherData(urlGeral, searchParam, true);

    // AJUSTE 1: Estado inicial fixo como 'article' e sem useEffect para alterá-lo baseado na URL
    const [activeTab, setActiveTab] = useState('article');
    const [mainTab, setMainTab] = useState('all');
    const [filters, setFilters] = useState<{ year: number[] }[]>([]);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isOpenSheet, setIsOpenSheet] = useState(false);

    const primaryResearcher = researcher[0];
    const yearString = filters.length > 0 ? filters[0].year.join(';') : '';

    const variations = useMemo(() => {
        if (!primaryResearcher?.name) return [];
        return generateNameVariations(primaryResearcher.name);
    }, [primaryResearcher]);

    useEffect(() => {
        setSearchType(typeSearch);
        setValoresSelecionadosExport(terms);
        if (terms) {
            setItensSelecionados(parseTerms(terms));
        }
    }, [typeSearch, terms, setSearchType, setValoresSelecionadosExport, setItensSelecionados]);

    useEffect(() => {
        setItensSelecionadosPopUp(itemsSelecionados);
    }, [itemsSelecionados, setItensSelecionadosPopUp]);

    useEffect(() => {
        if (primaryResearcher?.institution_id) {
            getInstitutionImage(primaryResearcher.institution_id).then(setImageUrl);
        }
    }, [primaryResearcher]);

    const hasVisualizarIndices = permission.some(p => p.permission === 'visualizar_indices_pesquisador');
    const hasBaremaAvaliacao = permission.some(p => p.permission === 'criar_barema_avaliacao');

    const handleVoltar = () => navigate(-1);

    const handleDownloadJson = async () => {
        if (!primaryResearcher?.id) return;
        try {
            const url = `${urlGeral}bibliographic_production_researcher?terms=${terms}&researcher_id=${primaryResearcher.id}&type=ARTICLE&qualis=&year=1900`;
            const resp = await fetch(url);
            const data = await resp.json();
            const csvData = convertJsonToCsv(data);
            const blob = new Blob([csvData], { type: 'text/csv;charset=windows-1252;' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'dados.csv';
            link.click();
        } catch (err) {
            console.error(err);
            toast.error("Erro ao baixar dados");
        }
    };

    if (loading || researcher.length === 0) {
        return <ResearcherSkeleton />;
    }

    return (
        // AJUSTE 3: Adicionado overflow-x-hidden e max-w-full para evitar scroll lateral
        <div className="w-full grid grid-cols-1 overflow-x-hidden max-w-[100vw]">
            <Helmet>
                <title>{primaryResearcher?.name || "Pesquisador"} | Iapos</title>
            </Helmet>

            <main className="flex flex-1 flex-col p-4 md:p-8 max-w-full">
                <Tabs value={mainTab} onValueChange={setMainTab} className="h-full grid grid-cols-1">

                    <div className="w-full gap-4 pb-0 grid grid-cols-1">
                        <div className="flex flex-wrap items-center gap-4 justify-between">
                            <div className="flex items-center gap-4">
                                <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>

                                <div className="flex gap-3 items-center overflow-x-auto">
                                    <TabsList>
                                        <TabsTrigger value="all">Visão geral</TabsTrigger>
                                        <TabsTrigger value="indicators" disabled={!hasVisualizarIndices}>
                                            Indicadores de produção
                                        </TabsTrigger>
                                        {user?.display_name === primaryResearcher?.name && (
                                            <TabsTrigger value="provimento">Provimento de cargo</TabsTrigger>
                                        )}
                                    </TabsList>
                                </div>
                            </div>

                            {/* AJUSTE 2: Actions trazido de volta e corrigido */}
                            <ResearcherActions
                                researcher={researcher}
                                isOpenSheet={isOpenSheet}
                                setIsOpenSheet={setIsOpenSheet}
                                yearString={yearString}
                                onFilterUpdate={setFilters}
                                hasBaremaAvaliacao={hasBaremaAvaliacao}
                                pesquisadoresSelecionados={pesquisadoresSelecionados}
                                setPesquisadoresSelecionados={setPesquisadoresSelecionados}
                                handleDownloadJson={handleDownloadJson}
                                urlGeral={urlGeral}
                                searchType={typeSearch || 'name'}
                                terms={terms}
                            />
                        </div>
                    </div>

                    <TabsContent value="all" className="max-w-full">
                        <ProfileHeader researcher={researcher} urlGeral={urlGeral} imageUrl={imageUrl} />

                        <div className="grid grid-cols-1 w-full">
                            <DrawerHeader className="p-0 grid grid-cols-1 w-full">
                                <div className="w-fit">
                                    <InformationResearcher {...primaryResearcher} openAPI={false} />
                                </div>

                                {user?.lattes_id === primaryResearcher.lattes_id && <AlertDataWarning />}

                                <div className="flex gap-6 xl:flex-row flex-col-reverse mt-6 w-full">
                                    <div className="w-full flex-1 flex flex-col min-w-0"> {/* min-w-0 ajuda no overflow do flex */}
                                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                            <ScrollArea className="mb-4 w-full">
                                                <TabsList className="mb-4 flex h-auto w-full justify-start">
                                                    {TABS_CONFIG.map(tab => (
                                                        <TabsTrigger key={tab.value} value={tab.value} className="flex gap-2 items-center whitespace-nowrap">
                                                            <tab.icon size={16} /> {tab.label}
                                                        </TabsTrigger>
                                                    ))}
                                                </TabsList>
                                                <ScrollBar orientation="horizontal" />
                                            </ScrollArea>

                                            {TABS_CONFIG.map(tab => (
                                                <TabsContent key={tab.value} value={tab.value} className="w-full">
                                                    <tab.component name={primaryResearcher.id} />
                                                </TabsContent>
                                            ))}
                                        </Tabs>
                                    </div>

                                    <SidebarMasonry
                                        researcher={researcher}
                                        variations={variations}
                                    />
                                </div>
                            </DrawerHeader>
                        </div>
                    </TabsContent>

                    <TabsContent value="indicators">
                        <ResearcherIndicators
                            {...primaryResearcher}
                            year_filter={yearString}
                            status={false}
                        />
                    </TabsContent>

                </Tabs>
            </main>
        </div>
    );
}

// --- AJUSTE 2: COMPONENTE DE AÇÕES RESTAURADO E CORRIGIDO ---

function ResearcherActions({
    researcher, isOpenSheet, setIsOpenSheet, yearString, onFilterUpdate,
    hasBaremaAvaliacao, pesquisadoresSelecionados, setPesquisadoresSelecionados,
    handleDownloadJson, urlGeral, searchType, terms
}: any) {
    const currentUrl = window.location.origin;
    const props = researcher[0];

    if (!props) return null;

    // Lógica de Datas
    const currentDate = new Date();
    const lattesUpdate = String(props.lattes_update).split('/');
    const lattesMonth = parseInt(lattesUpdate[1]);
    const lattesYear = parseInt(lattesUpdate[2]);
    const monthDifference = (currentDate.getFullYear() - lattesYear) * 12 + (currentDate.getMonth() + 1 - lattesMonth);
    const isOutdated = monthDifference > 3;
    const isOutdated6 = monthDifference > 6;

    let urlShare = `${currentUrl}/researcher?researcher_name=${props.name}&search_type=${searchType}&terms=${terms}`;
    if (searchType == 'name') {
        urlShare = `${currentUrl}/researcher?researcher_name=${props.name}&search_type=${searchType}&terms=`;
    }

    return (
        <div className="flex gap-2 items-center md:ml-auto flex-wrap">
            {/* Badge de Atualização do Lattes */}
            <div className={`border hidden dark:border-neutral-800 w-fit py-2 px-4 text-gray-400 rounded-md text-xs font-bold lg:flex gap-1 items-center 
                ${isOutdated6 ? 'bg-red-500 text-white border-none' : isOutdated ? 'bg-yellow-600 text-white border-none' : ''}`}>
                <CalendarBlank size={16} /> Atualização do Lattes: {String(props.lattes_update)}
            </div>

            {/* Badge de Status Ativo/Inativo */}
            <div className={`hidden text-[0.5rem] py-2 px-4 border dark:border-neutral-800 w-fit rounded-md font-bold gap-1 items-center md:text-xs md:py-2 md:px-4 lg:flex text-white border-none 
                ${props.status ? 'bg-green-500' : 'bg-red-500'}`}>
                {props.status ? <Check size={16} /> : <Minus size={16} />}
                {props.status ? 'Ativo' : 'Inativo'}
            </div>

            <div className="flex gap-3 items-center">
                <TimelineSheet
                    isOpenSheet={isOpenSheet}
                    setIsOpenSheet={setIsOpenSheet}
                    researcher={researcher}
                    yearString={yearString}
                    handleResearcherUpdate={onFilterUpdate}
                />

                {hasBaremaAvaliacao && (
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant={'default'}
                                    onClick={() => {
                                        if (pesquisadoresSelecionados.some((pesq: any) => pesq.name === props.name)) {
                                            setPesquisadoresSelecionados((prev: any[]) => prev.filter(pesq => pesq.name !== props.name));
                                        } else {
                                            setPesquisadoresSelecionados((prev: any[]) => [...prev, {
                                                id: props.id, name: props.name, university: props.university,
                                                lattes_id: props.lattes_id, city: props.city, area: props.area,
                                                graduation: props.graduation
                                            }]);
                                        }
                                    }}
                                    className={`h-8 w-8 p-0 text-white dark:text-white ${pesquisadoresSelecionados.some((p: any) => p.name === props.name) && 'bg-red-500 hover:bg-red-600'}`}
                                >
                                    {pesquisadoresSelecionados.some((p: any) => p.name === props.name) ? <X size={16} /> : <Plus size={16} />}
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                {pesquisadoresSelecionados.some((p: any) => p.name === props.name) ? 'Remover do barema' : 'Adicionar ao barema'}
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem className="flex items-center gap-3" onClick={() => {
                            navigator.clipboard.writeText(props.lattes_id);
                            toast.success("Lattes ID copiado");
                        }}>
                            <Copy className="h-4 w-4" /> Copiar Lattes ID
                        </DropdownMenuItem>

                        <DropdownMenuItem className="flex items-center gap-3" onClick={handleDownloadJson}>
                            <FileCsv className="h-4 w-4" /> CSV dos artigos
                        </DropdownMenuItem>

                        <Link to={`${urlGeral}dictionary.pdf`} target="_blank">
                            <DropdownMenuItem className="flex items-center gap-3">
                                <File className="h-4 w-4" /> Dicionário de dados
                            </DropdownMenuItem>
                        </Link>

                        <DropdownMenuItem className="flex items-center gap-3" onClick={() => {
                            navigator.clipboard.writeText(urlShare);
                            toast.success("Link copiado");
                        }}>
                            <ShareNetwork className="h-4 w-4" /> Copiar link
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="flex justify-center py-4 bg-white hover:bg-white focus:bg-white">
                            <QRCode size={150} className="bg-white p-2" value={urlShare} />
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

// --- SUB-COMPONENTES AUXILIARES ---

function ResearcherSkeleton() {
    return (
        <div className="p-8 flex flex-col items-center">
            <Skeleton className="w-28 h-28 rounded-md mb-4" />
            <Skeleton className="w-[400px] h-8 rounded-md mb-8" />
            <div className="flex gap-4 w-full mt-4 flex-col md:flex-row">
                <Skeleton className="flex-1 h-[600px] rounded-md" />
                <Skeleton className="w-full md:w-[350px] h-[600px] rounded-md" />
            </div>
        </div>
    )
}

function AlertDataWarning() {
    return (
        <div className="bg-red-50 mb-6 flex gap-3 dark:bg-red-200/20 w-full p-8 rounded-md">
            <div><OctagonAlert size={24} /></div>
            <div>
                <AlertTitle>Dados da publicações</AlertTitle>
                <AlertDescription>
                    A plataforma gerencia publicações extraídas do currículo Lattes, associando o Qualis da revista conforme registrado na Plataforma Sucupira...
                </AlertDescription>
            </div>
        </div>
    )
}

function ProfileHeader({ researcher, urlGeral, imageUrl }: any) {
    const user = researcher[0];
    if (!user) return null;

    return (
        <>
            <div className="w-full flex justify-center">
                <div
                    className="bg-cover bg-center bg-no-repeat h-28 w-28 rounded-2xl mb-3 border-4 border-white dark:border-neutral-950"
                    style={{ backgroundImage: `url(${urlGeral}ResearcherData/Image?researcher_id=${user.id})` }}
                />
            </div>
            <div className="flex items-center flex-col relative">
                <h4 className="text-3xl font-medium px-8 text-center mb-2">{user.name}</h4>
                <div className="flex text-gray-500 items-center gap-2 mb-2">
                    {imageUrl ? <img src={imageUrl} alt="Institution" className="h-6" /> : <Buildings size={16} />}
                    <p className="text-md">{user.university}</p>
                </div>
            </div>
        </>
    );
}

function SidebarMasonry({ researcher, variations }: any) {
    const user = researcher[0];
    if (!user) return null;

    // AJUSTE 3: Largura ajustada para não quebrar em telas médias
    return (
        <div className="xl:w-[350px] w-full min-w-[300px] grid grid-cols-1 mt-4 xl:mt-0">
            <ResponsiveMasonry columnsCountBreakPoints={{ 350: 1, 750: 1, 900: 1, 1200: 1 }}>
                <Masonry gutter="24px">
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
                        among={0} articles={0} institution_id={""} book={0} book_chapters={0}
                        id={""} name={""} university={""} lattes_id={""} area={""} lattes_10_id={""}
                        abstract={""} city={""} image={""} graduation={""} patent={""} software={""}
                        brand={""} ind_prod={""} status={false} lattes_update={user.lattes_update} abstract_ai={""}
                    />

                    <TotalViewResearcher
                        among={user.among} articles={user.articles} book={user.book}
                        book_chapters={user.book_chapters} patent={user.patent}
                        software={user.software} brand={user.brand}
                    />

                    <NuvemPalavras id={user.id} />
                    <Coautores id={user.id} name={user.name} />

                    <div>
                        <div className="mb-6 font-medium text-2xl">Nomes de citação</div>
                        <div className="flex flex-wrap gap-1">
                            {variations.map((variation: string, index: number) => (
                                <p className="text-xs" key={index}>{variation} /</p>
                            ))}
                        </div>
                    </div>
                </Masonry>
            </ResponsiveMasonry>
        </div>
    )
}

function TimelineSheet({ isOpenSheet, setIsOpenSheet, researcher, yearString, handleResearcherUpdate }: any) {
    const [expand, setExpand] = useState(false)
    const handleDownload = () => { };

    return (
        <Sheet open={isOpenSheet} onOpenChange={setIsOpenSheet}>
            <SheetTrigger asChild>
                <Button className="h-8" size={'sm'}><TrendingUp size={16} />Linha do tempo</Button>
            </SheetTrigger>
            <SheetContent className={`p-0 dark:bg-neutral-900 w-full dark:border-gray-600 ${expand ? 'md:max-w-[80vw]' : 'md:max-w-[50vw]'}`}>
                <DialogHeader className="h-[50px] justify-center px-4 border-b">
                    <div className="flex items-center gap-3 justify-between">
                        <div className="flex items-center gap-3">
                            <Button className="hidden lg:flex h-8 w-8" onClick={() => setExpand(!expand)} variant={'outline'} size={'icon'}>
                                {expand ? <ArrowRightFromLine size={16} /> : <ArrowLeftFromLine size={16} />}
                            </Button>
                            <Button className="h-8 w-8" variant={'outline'} onClick={() => setIsOpenSheet(false)} size={'icon'}><X size={16} /></Button>
                        </div>
                        <div className="hidden md:flex md:justify-end">
                            <Button onClick={handleDownload} className="ml-auto relative h-8 px-2">
                                <Download size={16} /> Baixar linha do tempo
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="p-8 pb-0 h-full overflow-y-auto">
                    <p className="max-w-[750px] mb-2 text-lg font-light text-foreground">Trajetória do(a) pesquisador(a)</p>
                    <h1 className="max-w-[500px] text-3xl font-bold leading-tight tracking-tighter md:text-4xl">Linha do tempo</h1>
                    <div className="my-6 border-b dark:border-b-neutral-800"></div>
                    <FilterYearTimeLine onFilterUpdate={handleResearcherUpdate} />

                    {researcher.slice(0, 1).map((user: any) => (
                        <TimeLineResearcher
                            key={user.id} {...user}
                            year_filter={yearString}
                            status={false}
                            institution_id={""} genero={""} classification={""} relevance_itens={0}
                        />
                    ))}
                </div>
            </SheetContent>
        </Sheet>
    )
}

function generateNameVariations(name: string): string[] {
    const parts = name.toUpperCase().split(' ');
    return [`${parts[parts.length - 1]}, ${parts[0]}`];
}

function parseTerms(t: string) { return [] }
function convertJsonToCsv(j: any) { return "" }