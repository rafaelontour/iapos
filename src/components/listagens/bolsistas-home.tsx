import { useContext, useEffect, useRef, useState } from "react";
import { useModalResult } from "../hooks/use-modal-result";
import { UserContext } from "../../context/context";
import municipios from '../homepage/categorias/researchers-home/municipios.json';
import { ChartBar, FadersHorizontal, ListNumbers, MagnifyingGlass, Rows, SquaresFour, UserList } from "phosphor-react";
import { Button } from "../ui/button";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Skeleton } from "../ui/skeleton";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../ui/alert";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Hash, MapIcon, Sparkles, Trash, User, X } from "lucide-react";
import bg_popup from '../../assets/bg_popup.png';
import bg_user from '../../assets/user.png';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from "../hooks/use-modal-store";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

import { Label } from "../ui/label";
;

import { useTheme } from "next-themes";


//mapa

import { Sheet, SheetContent } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home";
import { MariaHome } from "../homepage/maria-home";
import MapaResearcher from "../homepage/categorias/researchers-home/mapa-researcher";
import { TableReseracherhome } from "../homepage/categorias/researchers-home/table-reseracher-home";
import { ResearchersBloco } from "../homepage/categorias/researchers-home/researchers-bloco";
import { HeaderResult } from "../homepage/header-results";
import { GraficoBolsistasPQ } from "../dashboard/graficos/grafico-bolsista-produtividade";
import { GraficoBolsistasDT } from "../dashboard/graficos/grafico-bolsista-tecnologico";
import { useFiltersContext } from "../../context/filter-context";
import { FiltersBadge } from "../homepage/categorias/researchers-home/filters-badge";
interface Total {
  researcher_count:number
  orcid_count:number
  scopus_count:number
  among:number
}

type CityData = {
  nome: string;
  latitude: number;
  longitude: number;
  pesquisadores: number;
  professores: string[];
  lattes_10_id: string;
};

type Research = {
  among: number,
  satus: boolean
  articles: number,
  book: number,
  book_chapters: number,
  id: string,
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
  h_index: string,
  relevance_score: string,
  works_count: string,
  cited_by_count: string,
  i10_index: string,
  scopus: string,
  openalex: string,
  subsidy: Bolsistas[]
  graduate_programs: GraduatePrograms[]
  departments: Departments[]
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

interface ResearchOpenAlex {
  display_name: string
  id: string
  orcid: string
  works_count: string
  works_api_url: string
  relevance_score: string
  cited_by_count: string
  summary_stats: SummaryStats
  ids: Ids
}

interface SummaryStats {

  h_index: string
  i10_index: string
}

interface Ids {
  scopus: string
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}


export function BolsistasHome() {
  const { isOpen, type } = useModalResult();

  const [loading, setLoading] = useState(true);
  const [researcher, setResearcher] = useState<Research[]>([]);
  const [originalResearcher, setOriginalResearcher] = useState<Research[]>([]);
  const [cityData, setCityData] = useState<CityData[]>([]);
  const [typeVisu, setTypeVisu] = useState('block');
  const { itemsSelecionados, urlGeral, searchType, simcc } = useContext(UserContext);
  const { version, pesquisadoresSelecionados, idGraduateProgram } = useContext(UserContext);

  useEffect(() => {
    localStorage.setItem('pesquisadoresSelecionados', JSON.stringify(pesquisadoresSelecionados));
  }, [pesquisadoresSelecionados]);

  const queryUrl = useQuery();

  const terms = queryUrl.get('terms');
  const openAlexState = queryUrl.get('open_alex');

  let FinalOpenAlex = openAlexState || ''

  const isModalOpen = isOpen && type === "researchers-home";

    const {
      setSelectedAreas,
      setSelectedGraduations,
      setSelectedCities,
      setSelectedDepartaments,
      setSelectedGraduatePrograms,
      setSelectedSubsidies,
      setSelectedUniversities,
      clearFilters,
      selectedAreas,
      selectedGraduations,
      selectedCities,
      selectedDepartaments,
      selectedGraduatePrograms,
      selectedSubsidies,
      selectedUniversities
    } = useFiltersContext(); // ✅ correto
  

  const Page =  queryUrl.get('page') || '1';
  const Length =  queryUrl.get('length') || '24';
  
  let urlTermPesquisadores =`${urlGeral}researcherName?name=&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;

  function arrayToParam(arr?: string[]) {
    return (arr || []).join(';');
  }




 
  console.log(urlTermPesquisadores);

  const urlOpenAlex = `https://api.openalex.org/authors?filter=display_name.search:${terms?.replace(/[()|;]/g, "")}`;
  const [researcherOpenAlex, setResearcherOpenAlex] = useState<ResearchOpenAlex[]>([])
  const [isOpenAlex, setIsOpenAlex] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
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
          setOriginalResearcher(data);
          setLoading(false);


        }
      } catch (err) {
        console.error("Main data fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [urlTermPesquisadores, FinalOpenAlex, urlOpenAlex]);

  useEffect(() => {
    const processCityData = () => {
      const cityMap = new Map<string, CityData>();

      // Cria um mapa para associar o nome normalizado da cidade aos dados do município
      const municipioMap = new Map(
        municipios.map((m) => [normalizeCityName(m.nome), m])
      );

      researcher.forEach((r) => {
        if (r.city) {
          const normalizedCity = normalizeCityName(r.city);
          const municipio = municipioMap.get(normalizedCity);

          if (!municipio) {
            console.warn(`Município não encontrado para a cidade: ${r.city}`);
            return;
          }

          if (!cityMap.has(normalizedCity)) {
            cityMap.set(normalizedCity, {
              nome: r.city,
              latitude: municipio.latitude,
              longitude: municipio.longitude,
              pesquisadores: 1,
              professores: [r.name],
              lattes_10_id: r.lattes_10_id,
            });
          } else {
            const city = cityMap.get(normalizedCity)!;
            city.pesquisadores += 1;
            city.professores.push(r.name);
          }
        }
      });

      setCityData(Array.from(cityMap.values()));
    };

    processCityData();

    console.log('cidades', cityData)
  }, [researcher]);

  const items = Array.from({ length: 12 }, (_, index) => (
    <Skeleton key={index} className="w-full rounded-md h-[300px]" />
  ));
  const totalAmong = researcher.reduce((sum, researcher) => sum + researcher.among, 0);

  const { theme } = useTheme()

  //mapa
  const normalizeCityName = (cityName: string) => {
    return cityName
      .normalize("NFD") // Remove acentos
      .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
      .toLowerCase(); // Converte para minúsculas
  };


    const [bolsistas, setBolsistas] = useState<Bolsistas[]>([]);


////
    const [total, setTotal] = useState<Total>()
    let urlTotais = `${urlGeral}researcher_metrics?type=${searchType.toUpperCase()}&term=&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=*&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
    
    console.log(urlTotais)
      useEffect(() => {
        const fetchData = async () => {
    
          try {
            const response = await fetch(urlTotais, {
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
              setTotal(data[0])
            }
          } catch (err) {
            console.log(err);
          } finally {
    
          }
        };
        fetchData();
      }, [urlTotais]);



  

  return (
    <div className="w-full">
      <div className="w-full flex gap-4 justify-center">
        <div className="flex-1 gap-4 flex flex-col">
         
          <div className="w-full">
            <HeaderResult />
          </div>


  <FiltersBadge/>

<Alert className={`p-0 mt-4 bg-cover bg-no-repeat bg-center ${(searchType == 'abstract' || searchType == 'name' || searchType == 'area') && ('col-span-4')}`}  >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de pesquisadores
                  </CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{total?.among|| 0}</div>
                  <p className="text-xs text-muted-foreground">
                    encontrados na busca
                  </p>
                </CardContent>
              </Alert>

      

         

  
            <Accordion defaultValue="item-1" type="single" collapsible className="hidden md:flex ">
              <AccordionItem value="item-1" className="w-full ">
                <div className="flex mb-2">
                  <HeaderResultTypeHome title="Pesquisadores no mapa" icon={<MapIcon size={24} className="text-gray-400" />}>
                  </HeaderResultTypeHome>

                  <AccordionTrigger>

                  </AccordionTrigger>
                </div>
                <AccordionContent className="p-0">
                  {loading ? (
                    <Skeleton className="rounded-md w-full h-[300px] " />
                  ) : (
                    <div>
                      <MapaResearcher
                        cityData={cityData}
                      />
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>


             <Accordion defaultValue="item-1" type="single" collapsible className="hidden md:flex ">
                          <AccordionItem value="item-1" className="w-full ">
                            <div className="flex mb-2">
                              <HeaderResultTypeHome title="Gráficos dos bolsistas CNPq" icon={<ChartBar size={24} className="text-gray-400" />}>
                              </HeaderResultTypeHome>
            
                              <AccordionTrigger>
            
                              </AccordionTrigger>
                            </div>
                            <AccordionContent className="p-0">
                              {loading ? (
                                <Skeleton className="rounded-md w-full h-[300px] " />
                              ) : (
                                <div>
                                <div className="grid gap-8 xl:grid-cols-2">
                                
                                </div>
                                </div>
                              )}
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
     

        
            <div>
              <Accordion defaultValue="item-1" type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="flex mb-2">
                    <HeaderResultTypeHome title="Pesquisadores por detalhamento" icon={<UserList size={24} className="text-gray-400" />}>
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
                            350: 2,
                            750: 3,
                            900: 4,
                            1200: 6,
                            1500: 6,
                            1700: 7
                          }}
                        >
                          <Masonry gutter="16px">
                            {items.map((item, index) => (
                              <div className="w-full" key={index}>{item}</div>
                            ))}
                          </Masonry>
                        </ResponsiveMasonry>
                      ) : (
                        <ResearchersBloco researcher={researcher} />
                      )
                    ) : (
                      loading ? (
                        <Skeleton className="w-full rounded-md h-[400px]" />
                      ) : (
                        <TableReseracherhome researcher={researcher} />
                      )
                    )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          

        
        </div>

      </div>
    </div>
  );
} 
