import { ArrowLeftFromLine, ArrowRightFromLine, BarChartBig, Blocks, Book, BookOpen, Briefcase, Calendar, ChevronDown, ChevronLeft, ChevronUp, Copyright, File, Globe, GraduationCap, Home, Info, LayoutDashboard, LoaderCircle, MapPinIcon, SlidersHorizontal, SquareLibrary, Star, TextSearch, Ticket, Undo2, User, Users, Users2, X } from "lucide-react";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { UserContext } from "../../context/context";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Books, Quotes } from "phosphor-react";
import { Alert } from "../ui/alert";
import { Search } from "../search/search";
import { useModalResult } from "../hooks/use-modal-result";
import { useModal } from "../hooks/use-modal-store";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import HC_wordcloud from 'highcharts/modules/wordcloud';
import bg_popup from '../../assets/bg_home.png';
import { BarChart, Bar, XAxis, LabelList, CartesianGrid, } from 'recharts';


import { GraficoArtigosPorQualis } from "../dashboard/graficos/grafico-qualis";
import { DocentesPrograma } from "./docentes-programa";
import { IndicatorsGraduate } from "./indicators-graduate";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { DialogHeader } from "../ui/dialog";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

import { DocentesGraduate } from "../dashboard/components/docentes-graduate";
import { DiscentesGraduate } from "../dashboard/components/discentes-graduate";

import { GraficoIndiceProdBibli } from "./grafico-indice-producao-bibliografica";
import { useTheme } from "next-themes";
import { LogoConecteeWhite } from "../svg/LogoConecteeWhite";
import { LogoConectee } from "../svg/LogoConectee";

import { Badge } from "../ui/badge";
import { HomepageProgram } from "./homepage-program";
import { PainelAdminGraduate } from "./painel-admin-graduate";
import { Helmet } from "react-helmet";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ProducoesPrograma } from "./producoes-programa";
import { LinhasPesquisaPrograma } from "./linhas-pesquisa-programa";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Keepo } from "../dashboard/builder-page/builder-page";
import { LogoIaposWhite } from "../svg/LogoIaposWhite";
import { LogoIapos } from "../svg/LogoIapos";
import { getDownloadURL, getStorage, uploadBytes } from "firebase/storage";

interface PalavrasChaves {
  term: string;
  among: number;
}

interface GraduateProgram {
  area: string;
  code: string;
  graduate_program_id: string;
  modality: string;
  name: string;
  rating: string;

  researchers: string[]

  name_en: string;
  cooperation_project: string;
  basic_area: string;
  site: string;
  coordinator: string;
  email: string;
  start: string;
  phone: string;
  periodicity: string;

  type: string;
  city: string
  state: string
  instituicao: string
  url_image: string
  region: string
  sigla: string
  latitude: string
  longitude: string
  visible: string
  qtd_discente: string
  qtd_colaborador: string
  qtd_permanente: string
  acronym: string
  description?: string
}

interface Total {
  article: string
  book: string
  book_chapter: string
  brand: string
  patent: string
  researcher: string
  software: string
  work_in_event: string
}

type Research = {
  count_article: number
  count_book: number
  count_book_chapter: number,
  count_guidance: number
  count_patent: number
  count_report: number
  count_software: number
  count_guidance_complete: number
  count_guidance_in_progress: number
  count_patent_granted: number
  count_patent_not_granted: number
  count_brand: number
  graduantion: string
  year: number

  A1: number
  A2: number
  A3: number
  A4: number
  B1: number
  B2: number
  B3: number
  B4: number
  C: number
  SQ: number
}

type PesosProducao = {
  a1: string;
  a2: string;
  a3: string;
  a4: string;
  b1: string;
  b2: string;
  b3: string;
  b4: string;
  c: string;
  sq: string;
  f1: string;
  f2: string;
  f3: string;
  f4: string;
  f5: string;
  livro: string;
  cap_livro: string;
  software: string;
  patent_granted: string;
  patent_not_granted: string;
  report: string;
  book: string;
  book_chapter: string;
};


HC_wordcloud(Highcharts);

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export function VisualizacaoPrograma() {
  const { urlGeral, itemsSelecionados, searchType, permission, urlGeralAdm } = useContext(UserContext)
  const { onOpen: onOpenModal } = useModal();
  const location = useLocation();


  const queryUrl = useQuery();
  const type_search = queryUrl.get('graduate_program_id');
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
  const [graduatePrograms, setGraduatePrograms] = useState<GraduateProgram>();

  const urlGraduateProgram = `${urlGeral}graduate_program_profnit?id=${type_search}`;
  const [loading, setLoading] = useState(true);
  console.log(urlGraduateProgram)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlGraduateProgram, {
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
          setGraduatePrograms(data[0]);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [urlGraduateProgram]);


  const { version } = useContext(UserContext)
  const { theme } = useTheme()

  const siteTitle = graduatePrograms?.name
    ? `${graduatePrograms.name} | ${version ? "Conectee" : "Simcc"}`
    : `${version ? "Conectee" : "Simcc"} | ${version ? "Escola de Engenharia UFMG" : "SECTI-BA"}`;

  const siteDescription = graduatePrograms?.name
    ? `${graduatePrograms.name} | Conectee`
    : `${version ? "Conectee" : "Simcc"} | ${version ? "Escola de Engenharia UFMG" : "SECTI-BA"}`;


  const tabs = [
    { id: "visao_geral", label: "Visão geral", icon: Home },
    //{ id: "producoes", label: "Produções", icon: SquareLibrary },
    //{ id: "linhas_pesquisa", label: "Linhas de pesquisa", icon: TextSearch },
    { id: "docentes", label: "Docentes", icon: Users2 },
    //{ id: "indicadores", label: "Indicadores", icon: BarChartBig },

  ];

  const tab = queryUrl.get('pagina');


  const [value, setValue] = useState(tab || tabs[0].id)

  const navigate = useNavigate();
  const updateFilters = (category: string, values: any) => {
    if (values) {

      queryUrl.set(category, values);

    } else {
      queryUrl.delete(category)
    }

  };


  useEffect(() => {
    console.log("typeResult mudou para:", value);
    updateFilters("pagina", value);

    navigate({
      pathname: location.pathname,
      search: queryUrl.toString(),
    })

  }, [value]);



  const [loadingMessage, setLoadingMessage] = useState("Estamos procurando todas as informações no nosso banco de dados, aguarde.");

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];


    setLoadingMessage("Estamos procurando todas as informações no nosso banco de dados, aguarde.");

    timeouts.push(setTimeout(() => {
      setLoadingMessage("Estamos quase lá, continue aguardando...");
    }, 5000));

    timeouts.push(setTimeout(() => {
      setLoadingMessage("Só mais um pouco...");
    }, 10000));

    timeouts.push(setTimeout(() => {
      setLoadingMessage("Está demorando mais que o normal... estamos tentando encontrar tudo.");
    }, 15000));

    timeouts.push(setTimeout(() => {
      setLoadingMessage("Estamos empenhados em achar todos os dados, aguarde só mais um pouco");
    }, 15000));


    return () => {
      // Limpa os timeouts ao desmontar ou quando isOpen mudar
      timeouts.forEach(clearTimeout);
    };
  }, []);




  /////////////
  const [keepoData, setKeepoData] = useState<Keepo>({
    app: {
      background_color: "",
      background_image: '',
      text_color: "",
      status: "publicar",
      card_color: "",
      card_text_color: "",
      button_color: "",
      button_text_color: "",
    },
    profile_info: {
      avatar: "",
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      supporting: "",
      button_text: "",
      link: "",
    },
    content: [],
  });



  ////firebase
  const graduate_program_id = queryUrl.get('graduate_program_id');
  const group_id = queryUrl.get('group_id');
  const dep_id = queryUrl.get('dep_id');

  const documentId = graduate_program_id || group_id || dep_id;

  const db = getFirestore();
  const isDataLoaded = useRef(false); // Flag para evitar loop de salvamento

  // Carregar dados ao montar a página
  useEffect(() => {
    if (documentId) {
      const fetchData = async () => {
        const docRef = doc(db, "construtor-pagina", documentId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Partial<Keepo>;

          setKeepoData({
            app: {
              background_color: data.app?.background_color || "",
              background_image: data.app?.background_image || "",
              text_color: data.app?.text_color || "",
              card_color: data.app?.card_color || "",
              card_text_color: data.app?.card_text_color || "",
              button_color: data.app?.button_color || "",
              button_text_color: data.app?.button_text_color || "",
              status: data.app?.status || "",
            },
            profile_info: {
              avatar: data.profile_info?.avatar || "",
              firstName: data.profile_info?.firstName || "",
              lastName: data.profile_info?.lastName || "",
              email: data.profile_info?.email || "",
              jobTitle: data.profile_info?.jobTitle || "",
              supporting: data.profile_info?.supporting || "",
              button_text: data.profile_info?.button_text || "",
              link: data.profile_info?.link || "",
            },
            content: data.content || [],
          });

          isDataLoaded.current = true; // Marca que os dados foram carregados
        }
      };
      fetchData();
    }
  }, [documentId]);


  const { onOpen } = useModal()


  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-full flex flex-col items-center justify-center h-full">
          <div className="text-eng-blue mb-4 animate-pulse">
            <LoaderCircle size={108} className="animate-spin" />
          </div>
          <p className="font-medium text-lg max-w-[500px] text-center">
            {loadingMessage}
          </p>
        </div>
      </div>
    );
  }

  if (!graduatePrograms || graduatePrograms.visible === "false") {
    return (
      <div
        className="h-full bg-cover bg-center flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900"

      >
        {version ? (
          <Link to="/" className="absolute top-16">
            {theme === "dark" ? <LogoConecteeWhite /> : <LogoConectee />}
          </Link>
        ) : (
          <Link to="/" className="absolute top-16">
            {theme === "dark" ? <LogoIaposWhite /> : <LogoIapos />}
          </Link>
        )}

        <div className="w-full flex flex-col items-center justify-center">
          <p className="text-9xl text-[#719CB8] font-bold mb-16 animate-pulse">
            (⊙_⊙)
          </p>
          <h1 className="text-center text-2xl md:text-4xl text-neutral-400 font-medium leading-tight tracking-tighter lg:leading-[1.1] ">
            Não foi possível acessar as <br />  informações deste programa.
          </h1>


          <div className="flex gap-3 mt-8">
            <Button onClick={handleVoltar} variant={'ghost'}><Undo2 size={16} /> Voltar</Button>
            <Link to={'/'}> <Button><Home size={16} /> Página Inicial</Button></Link>

          </div>
        </div>
      </div>
    );
  }



  return (
    <>
      <Helmet>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <main className="grid grid-cols-1 ">
        <Tabs defaultValue={tabs[0].id} value={value} className="">
          <div className="md:p-8 p-4 pb-0">
            <div style={{ backgroundImage: `url(${keepoData.app.background_image})` }} className="bg-eng-blue bg-no-repeat bg-center bg-cover border dark:border-neutral-800 w-full rounded-md h-[300px]">
              <div className={`w-full h-full relative rounded-md ${!(keepoData.app.background_image == "") && ('bg-black/25 ')}  pb-0 md:pb-0 p-4 md:p-8 flex-col flex justify-between `}>
                <div
                  className="
                    flex flex-col items-center gap-4 justify-between

                    md:flex-row
                  "
                >
                  <div className="flex gap-2">
                    <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7 text-eng-blue hover:text-eng-blue">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Voltar</span>
                    </Button>
                    <div
                      className="
                        flex flex-col gap-4

                        md:flex-col

                        lg:flex-row
                      "
                    >
                      <h1 className="flex-1 shrink-0 text-white whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                        Pós-graduação
                      </h1>

                      {graduatePrograms.researchers.length > 0 && (
                        <div className=" hidden justify-between items-center md:flex">

                          <div className="flex items-center gap-2">

                            {graduatePrograms.researchers.slice(0, 5).map((item, index) => (
                              <Avatar
                                key={item}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  onOpen('researcher-modal', { name: item });
                                }}
                                className="cursor-pointer rounded-full relative border dark:border-neutral-800 h-8 w-8 hover:z-10 transition-transform hover:scale-110"
                                style={{
                                  marginLeft: index > 0 ? '-10px' : '0px',

                                }}
                              >
                                <AvatarImage
                                  className="rounded-md h-8 w-8"
                                  src={`${urlGeral}ResearcherData/Image?name=${item}`}
                                />
                                <AvatarFallback className="flex items-center justify-center">
                                  <User size={16} />
                                </AvatarFallback>
                              </Avatar>
                            ))}

                            {graduatePrograms.researchers.length > 5 && (
                              <div
                                className="h-8 w-8 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-neutral-800 rounded-full border dark:border-neutral-700 text-xs font-medium"
                                style={{ marginLeft: '-10px' }}
                              >
                                +{graduatePrograms.researchers.length - 5}
                              </div>
                            )}
                          </div>


                        </div>

                      )}
                    </div>
                  </div>

                  <div
                    className="
                      flex items-center gap-2 flex-wrap
                    "
                  >

                    <Link to={`/dashboard/programa?graduate_program_id=${type_search}`} target="_blank">
                      <Button className="h-8 text-eng-blue hover:text-eng-blue" size={'sm'} variant={'outline'}><LayoutDashboard size={16} />Painel administrativo</Button>
                    </Link>
                  </div>
                </div>

                <div className="flex justify-end items-end flex-1 w-full ">
                  <div className="flex justify-between w-full gap-8">


                    <div className="absolute">
                      {keepoData.profile_info.avatar ? (
                        <Alert
                          className="aspect-square  bg-no-repeat bg-center bg-contain  -top-12 xl:top-0 rounded-lg h-24 bg-white dark:bg-neutral-900"
                          style={{ backgroundImage: `url(${keepoData.profile_info.avatar})` }}
                        ></Alert>
                      ) : (
                        <Avatar className=" rounded-lg  h-24 w-24 relative -top-12 xl:top-0">
                          <AvatarImage className={'rounded-md h-24 w-24'} src={``} />
                          <AvatarFallback className="flex items-center justify-center"><GraduationCap size={24} /></AvatarFallback>
                        </Avatar>
                      )}

                    </div>


                    <div className="  w-24 min-w-24">

                    </div>

                    <div className="relative  grid-cols-1 hidden xl:grid">
                      <ScrollArea className="relative overflow-x-auto">
                        <TabsList className="p-0 justify-start flex gap-2 h-auto bg-transparent dark:bg-transparent">
                          {tabs.map(
                            ({ id, label, icon: Icon }) =>

                              <div
                                key={id}
                                className={`pb-2 border-b-2 text-black dark:text-white transition-all ${value === id ? "border-b-white dark:border-b-neutral-800" : "border-b-transparent"
                                  }`}
                                onClick={() => setValue(id)}
                              >
                                <Button variant="ghost" className={`m-0 text-white hover:text-eng-blue dark:hover:text-eng-blue ${value === id ? "bg-white dark:bg-neutral-800 text-eng-blue" : ""}`}>
                                  <Icon size={16} />
                                  {label}
                                </Button>
                              </div>

                          )}
                        </TabsList>
                        <ScrollBar orientation="horizontal" />
                      </ScrollArea>

                      <div>

                      </div>
                    </div>

                  </div>
                </div>

              </div>



            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:gap-8  z-[2] pt-8 md:p-0">

            <div className="flex justify-between  md:px-8 items-center ">
              <div className="flex flex-col  gap-6 mt-8 px-8">


                <div>
                  <h1 className="text-2xl mb-2 max-w-[800px] font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
                    {graduatePrograms.name}
                  </h1>

                  {graduatePrograms.name_en && (
                    <h1 className="text-lg mb-2 max-w-[800px] font-bold leading-tight tracking-tighter md:text-2xl lg:leading-[1.1] md:block">
                      {graduatePrograms.name_en}
                    </h1>
                  )}

                  <p className="text-lg font-light text-foreground">
                    <div className="flex flex-wrap gap-4 ">
                      <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><GraduationCap size={12} />{graduatePrograms.type}</div>

                      {graduatePrograms.modality && (
                        <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Briefcase size={12} />{graduatePrograms.modality}</div>
                      )}

                      <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center capitalize"><MapPinIcon size={12} />{graduatePrograms.city}/{graduatePrograms.state}</div>
                      {graduatePrograms.rating && (
                        <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Star size={12} />CONCEITO CAPES: {graduatePrograms.rating}</div>
                      )}

                      {graduatePrograms.start && (
                        <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center">
                          <Calendar size={12} />
                          ANO DE INÍCIO: {new Date(graduatePrograms.start).getFullYear()}
                        </div>
                      )}


                      {graduatePrograms.area && (
                        <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Blocks size={12} />{graduatePrograms.area}</div>
                      )}

                      {graduatePrograms.basic_area && (
                        <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Blocks size={12} />{graduatePrograms.basic_area}</div>
                      )}

                    </div>
                  </p>



                </div>
              </div>
            </div>

            <div className="xl:hidden">
              <div className="px-8 md:px-8 xl:hidden">
                <div className="relative grid grid-cols-1 xl:hidden">
                  <ScrollArea className="relative w-full overflow-x-auto">
                    <div className="flex w-full gap-2">
                      <TabsList className="p-0 justify-start flex gap-2 h-auto bg-transparent dark:bg-transparent border pt-2 px-2 dark:bg-neutral-800 w-full">
                        {tabs.map(({ id, label, icon: Icon }) => (
                          <div
                            key={id}
                            className={`pb-2 border-b-2 text-black dark:text-white transition-all ${value === id ? "border-b-[#719CB8]" : "border-b-transparent"
                              }`}
                            onClick={() => setValue(id)}
                          >
                            <Button variant="ghost" className="m-0">
                              <Icon size={16} />
                              {label}
                            </Button>
                          </div>
                        ))}
                      </TabsList>
                    </div>
                    <ScrollBar orientation="horizontal" />
                  </ScrollArea>
                  <div></div>
                </div>
              </div>

            </div>




            <TabsContent value="visao_geral" className="m-0">
              <HomepageProgram program={graduatePrograms} keepoData={keepoData} />
            </TabsContent>

            <TabsContent value="producoes" className="m-0">
              <ProducoesPrograma />
            </TabsContent>

            <TabsContent value="linhas_pesquisa" className="m-0">
              <LinhasPesquisaPrograma />
            </TabsContent>

            <TabsContent value="docentes" className="m-0">
              <DocentesPrograma />
            </TabsContent>


            <TabsContent value="indicadores" className="m-0">
              <IndicatorsGraduate />
            </TabsContent>
          </div>
        </Tabs>
      </main>

    </>
  )

}