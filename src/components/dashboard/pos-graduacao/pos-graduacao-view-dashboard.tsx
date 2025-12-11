import { useContext, useEffect, useState } from "react";
import { useModal } from "../../hooks/use-modal-store"

import { UserContext } from "../../../context/context";

import { ChevronDown, ChevronLeft, ChevronUp, Download, GraduationCap, Plus, Search, SquareMenu } from "lucide-react";


export interface PosGraduationsProps {
  graduate_program_id: string
  sigla: string
  region: string
  state: string
  code: string
  name: string
  area: string
  institution: string
  modality: string
  type: string
  rating: string
  institution_id: string
  description: string
  url_image: string
  city: string
  created_at: string
  visible: boolean
  updated_at: string
  qtd_discente: string
  qtd_colaborador: string
  qtd_permanente: string
  acronym: string

  menagers: string[]

  name_en: string;
  cooperation_project: string;
  basic_area: string;
  site: string;
  coordinator: string;
  email: string;
  start: string;
  phone: string;
  periodicity: string

  researchers: string[]
}


import { useModalDashboard } from "../../hooks/use-modal-dashboard";
import { TooltipProvider } from "../../ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../ui/resizable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Input } from "../../ui/input";
import { DisplayItem } from "./display-item";
import { ItensList } from "../components/itens-list-vitrine";
import { Button } from "../../ui/button";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { ProgramaDashboard } from "./programa";
import { Alert } from "../../ui/alert";
import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { HeaderResultTypeHome } from "../../homepage/categorias/header-result-type-home";
import { SidebarMenuSkeleton } from "../../ui/sidebar";
import { MagnifyingGlass, Rows, SquaresFour } from "phosphor-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ProgramItem } from "../../graduate-program/program-item";
import { Skeleton } from "../../ui/skeleton";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Keepo } from "../builder-page/builder-page";
import { columnsGraduateAdmin } from "../home-dashboard/columns-graduate";
import { DataTable } from "../data-table";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}


export function PosGraducaoView() {


  const { isOpen, type } = useModalDashboard();


  const { urlGeralAdm, user, defaultLayout } = useContext(UserContext);


  const { onOpen } = useModal();

  const queryUrl = useQuery();
  const type_search = queryUrl.get('graduate_program_id');
  let programSelecionado = type_search || ''

  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [menu, setMenu] = useState(true)

  const [total, setTotal] = useState<PosGraduationsProps | null>(null);
  const [programas, setProgramas] = useState<PosGraduationsProps[]>([]);
  // Função para lidar com a atualização de researcherData
  const handleResearcherUpdate = (newResearcherData: PosGraduationsProps) => {
    setTotal(newResearcherData);
  };

  const handleOnMenuState = (newResearcherData: boolean) => {
    setMenu(newResearcherData);
  };

  const history = useNavigate();

  const location = useLocation();

  const navigate = useNavigate();

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

  let urlPatrimonioInsert = `${urlGeralAdm}GraduateProgramRest/Query?institution_id=${user?.institution_id}`
  // id pra teste 083a16f0-cccf-47d2-a676-d10b8931f66a
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const fetchData = async () => {

      try {

        const response = await fetch(urlPatrimonioInsert, {
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
          setProgramas(data);
          setJsonData(data)
          setLoading(false)
        }
      }
      catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [programSelecionado]);

  const { version } = useContext(UserContext)

  const items = Array.from({ length: 12 }, (_, index) => (
    <Skeleton key={index} className="w-full rounded-md h-[250px]" />
  ));

  const [typeVisu, setTypeVisu] = useState('block');

  const [isOn, setIsOn] = useState(true);

  const [jsonData, setJsonData] = useState<any[]>([]);


  const convertJsonToCsv = (json: any[]): string => {
    const items = json;
    const replacer = (_: string, value: any) => (value === null ? '' : value); // Handle null values
    const header = Object.keys(items[0]);
    const csv = [
      '\uFEFF' + header.join(';'), // Add BOM and CSV header
      ...items.map((item) =>
        header.map((fieldName) => JSON.stringify(item[fieldName], replacer)).join(';')
      ) // CSV data
    ].join('\r\n');

    return csv;
  };

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

  const [count, setCount] = useState(24)


  const db = getFirestore();

  const fetchAvatars = async () => {
    const snapshot = await getDocs(collection(db, "construtor-pagina"));
    const avatarMap: Record<string, string> = {};

    snapshot.forEach(doc => {
      const data = doc.data() as Partial<Keepo>;
      const avatar = data.profile_info?.avatar || "";
      avatarMap[doc.id] = avatar;
    });

    return avatarMap;
  };

  const [avatarMap, setAvatarMap] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchAvatars().then(setAvatarMap);
  }, []);




  return (
    <>
      <Helmet>
        <title>Pós-graduações | Módulo administrativo | IAPÓS  </title>
        <meta name="description" content={`Pós-graduações | Módulo administrativo | IAPÓS `} />
        <meta name="robots" content="index, follow" />
      </Helmet>

      <>
        {programSelecionado.length == 0 ? (
          <div>
            <div className="w-full  gap-4 p-4 md:p-8 ">
              <div className="flex items-center gap-4">

                <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7">
                  <ChevronLeft className="h-4 w-4" />
                  <span className="sr-only">Voltar</span>
                </Button>

                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                  Pós-graduação
                </h1>

                <div className="hidden items-center gap-2 md:ml-auto md:flex">

                </div>
              </div>

            </div>

            <main className="z-[2]  gap-4 md:gap-8 flex flex-col  pt-0 md:pt-0 w-full">
              <div>
                <div className="top-[68px] sticky z-[9] supports-[backdrop-filter]:dark:bg-neutral-900/60 supports-[backdrop-filter]:bg-neutral-50/60 backdrop-blur">
                  <div className={`w-full px-8  border-b border-b-neutral-200 dark:border-b-neutral-800`}>


                    {isOn && (
                      <div className="w-full   flex justify-between items-center">

                        <div className="w-full pt-4  flex justify-between items-center">
                          <Alert className="h-14 mt-4 mb-2  p-2 flex items-center justify-between  w-full">
                            <div className="flex items-center gap-2 w-full flex-1">
                              <MagnifyingGlass size={16} className=" whitespace-nowrap w-10" />
                              <Input onChange={(e) => setSearch(e.target.value)} value={search} type="text" className="border-0 w-full " />
                            </div>
                          </Alert>
                        </div>
                      </div>
                    )}

                    <div className={`flex w-full flex-wrap pt-2 pb-3 justify-between `}>
                      <div>

                      </div>

                      <div className="hidden xl:flex xl:flex-nowrap gap-2">
                        <div className="md:flex md:flex-nowrap gap-2">

                          <Button onClick={() => handleDownloadJson()} variant="ghost" className="">
                            <Download size={16} className="" />
                            Baixar resultado
                          </Button>
                        </div>

                        <div>

                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setIsOn(!isOn)}>
                          {isOn ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>


                    </div>
                  </div>
                </div>
                <div className="mt-8 px-4 md:px-8">


                  <Alert className={`p-0 mb-6 bg-cover bg-no-repeat bg-center `}  >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">
                        Total de programas
                      </CardTitle>
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{programas.length}</div>
                      <p className="text-xs text-muted-foreground">
                        encontrados na busca
                      </p>
                    </CardContent>
                  </Alert>


                  <Accordion defaultValue="item-1" type="single" collapsible>
                    <AccordionItem value="item-1">
                      <div className="flex mb-2 mt-4">
                        <HeaderResultTypeHome title="Programas de pós-graduação" icon={<GraduationCap size={24} className="text-gray-400" />}>
                          <div className="hidden md:flex gap-3 mr-3">
                            <Button onClick={() => setTypeVisu('rows')} variant={typeVisu === 'block' ? 'ghost' : 'outline'} size={'icon'}>
                              <Rows size={16} className="whitespace-nowrap" />
                            </Button>
                            <Button onClick={() => setTypeVisu('block')} variant={typeVisu === 'block' ? 'outline' : 'ghost'} size={'icon'}>
                              <SquaresFour size={16} className="whitespace-nowrap" />
                            </Button>
                          </div>
                        </HeaderResultTypeHome>
                        <AccordionTrigger>

                        </AccordionTrigger>
                      </div>
                      <AccordionContent>
                        {typeVisu === 'block' ? (
                          loading ? (
                            <ResponsiveMasonry
                              columnsCountBreakPoints={{
                                350: 1,
                                750: 2,
                                900: 2,
                                1200: 3,
                                1700: 4
                              }}
                            >
                              <Masonry gutter="16px">
                                {items.map((item, index) => (
                                  <div className="w-full" key={index}>{item}</div>
                                ))}
                              </Masonry>
                            </ResponsiveMasonry>
                          ) : (
                            <div>
                              <ResponsiveMasonry
                                columnsCountBreakPoints={{
                                  350: 1,
                                  750: 2,
                                  900: 2,
                                  1200: 3,
                                  1700: 4
                                }}
                              >
                                <Masonry gutter="16px" className="pb-4 md:pb-8 z-[1]">
                                  {programas
                                    .slice(0, count) // Filtra os itens onde `visible` é `true`
                                    .map((props, index) => {
                                      const id = props.graduate_program_id
                                      const avatar = avatarMap[id] || "";

                                      return (
                                        <ProgramItem
                                          key={index} // Adiciona uma chave para cada item
                                          area={props.area}
                                          institution={props.institution}
                                          researchers={props.researchers}
                                          code={props.code}
                                          graduate_program_id={props.graduate_program_id}
                                          modality={props.modality}
                                          name={props.name}
                                          rating={props.rating}
                                          type={props.type}
                                          city={props.city}
                                          state={props.state}

                                          url_image={props.url_image}
                                          region={props.region}
                                          sigla={props.sigla}
                                          acronym={props.acronym}
                                          visible={props.visible}
                                          qtd_discente={props.qtd_discente}
                                          qtd_colaborador={props.qtd_colaborador}
                                          qtd_permanente={props.qtd_permanente}

                                          avatar={avatar}
                                          url={'/dashboard/programas'}
                                        />
                                      )
                                    })}
                                </Masonry>
                              </ResponsiveMasonry>

                              {programas.length >= count && (
                                <div className="w-full flex justify-center pb-8"><Button className="w-fit" onClick={() => setCount(count + 12)}><Plus size={16} />Mostrar mais</Button></div>
                              )}
                            </div>
                          )
                        ) : (
                          loading ? (
                            <Skeleton className="w-full rounded-md h-[400px]" />
                          ) : (
                            <DataTable columns={columnsGraduateAdmin} data={programas} />
                          )
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>


                </div>
              </div>

            </main>
          </div>
        ) : (
          <ProgramaDashboard />
        )}
      </>

    </>
  )
}