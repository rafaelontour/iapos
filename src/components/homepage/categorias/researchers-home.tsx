import { useContext, useEffect, useRef, useState } from "react";
import { useModalResult } from "../../hooks/use-modal-result";
import { UserContext } from "../../../context/context";
import { CloudWordResearcherHome } from "./researchers-home/clould-word-researcher-home";
import { HeaderResultTypeHome } from "./header-result-type-home";
import { ChartBar, ListNumbers, Rows, SquaresFour, UserList } from "phosphor-react";
import { Button } from "../../ui/button";
import { ResearchersBloco } from "./researchers-home/researchers-bloco";
import { TableReseracherhome } from "./researchers-home/table-reseracher-home";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../../components/ui/accordion";
import { Skeleton } from "../../ui/skeleton";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../../ui/alert";
import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Hash, MapIcon, Sparkles, Trash, User, X } from "lucide-react";
import bg_popup from '../../../assets/bg_popup.png';
import { HeaderResult } from "../header-results";

import { useTheme } from "next-themes";
import { MariaHome } from "../maria-home";
import MapaResearcher from "./researchers-home/mapa-researcher";

//mapa
import municipios from './researchers-home/municipios.json';

import { useFiltersContext } from "../../../context/filter-context";
import { FiltersBadge } from "./researchers-home/filters-badge";

type CityData = {
  nome: string;
  latitude: number;
  longitude: number;
  pesquisadores: number;
  professores: string[];
  lattes_10_id: string;
};

export type Research = {
  among: number,
  status: boolean
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
  ufmg: Ufmg
}

interface Ufmg {
  id: string;
  full_name: string;
  gender: string | null;
  status_code: string;
  work_regime: string;
  job_class: string;
  job_title: string;
  job_rank: string;
  job_reference_code: string;
  academic_degree: string;
  organization_entry_date: string; // formato ISO: "YYYY-MM-DD"
  last_promotion_date: string;
  employment_status_description: string;
  department_name: string;
  career_category: string;
  academic_unit: string;
  unit_code: string;
  function_code: string
  position_code: string
  leadership_start_date: string
  leadership_end_date: string
  current_function_name: string
  function_location: string
  registration_number: string
  ufmg_registration_number: string
  semester_reference: string
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

interface Total {
  researcher_count: number
  orcid_count: number
  scopus_count: number
  among: number
}


interface Filtros {
  area: string[]
  graduation: string[]
  city: string[]
  institution: string[]
  modality: string[]
  graduate_program: string[]
  departament: string[]
}

export function ResearchersHome() {
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

  const terms = queryUrl.get('terms');
  const openAlexState = queryUrl.get('open_alex');

  let FinalOpenAlex = openAlexState || ''

  const isModalOpen = isOpen && type === "researchers-home";


  const Page = queryUrl.get('page') || '1';
  const Length = queryUrl.get('length') || '24';



  function arrayToParam(arr?: string[]) {
    return (arr || []).join(';');
  }

  let urlTermPesquisadores = '';

  if (searchType === 'name') {
    urlTermPesquisadores = `${urlGeral}researcherName?name=${terms?.replace(/[;|()]/g, '')}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'article') {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${terms}&university=&type=ARTICLE&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'book') {
    urlTermPesquisadores = `${urlGeral}researcherBook?term=${terms}&university=&type=BOOK&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'area') {
    urlTermPesquisadores = `${urlGeral}researcherArea_specialty?area_specialty=${terms}&university=&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'speaker') {
    urlTermPesquisadores = `${urlGeral}researcherParticipationEvent?term=${terms}&university=&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'patent') {
    urlTermPesquisadores = `${urlGeral}researcherPatent?term=${terms}&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&university=&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'abstract') {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${terms}&university=&type=ABSTRACT&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
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
  }, [urlTermPesquisadores]);


  ////
  const [total, setTotal] = useState<Total>()
  let urlTotais = `${urlGeral}researcher_metrics?type=${searchType.toUpperCase()}&term=${terms}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;




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

  const { theme } = useTheme()

  //mapa
  const normalizeCityName = (cityName: string) => {
    return cityName
      .normalize("NFD") // Remove acentos
      .replace(/[\u0300-\u036f]/g, "") // Remove diacríticos
      .toLowerCase(); // Converte para minúsculas
  };

  return (
    <div className="w-full h-full">
      <div className="w-full flex gap-4 justify-center">
        <div className="flex-1 gap-4 flex flex-col">

          <div className="w-full">
            <HeaderResult />
          </div>
          <FiltersBadge />

          {(!isOpenAlex && FinalOpenAlex != 'true') && (
            <div className="grid gap-4 mt-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
              {(searchType != 'abstract' && searchType != 'name' && searchType != 'area') && (
                <Alert className="p-0 bg-cover bg-no-repeat bg-center lg:col-span-3" style={{ backgroundImage: `url(${bg_popup})` }}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de ocorrências
                    </CardTitle>
                    <Hash className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{total?.among || 0}</div>
                    <div className="flex items-center gap-3">
                      <p className="text-xs text-muted-foreground">
                        pela pesquisa
                      </p>

                      <div className="flex gap-2">
                        {itemsSelecionados.map((valor, index) => {
                          return (
                            <div key={index} className="flex gap-2">
                              <div className={`flex gap-2 items-center w-fit p-2 px-3 capitalize rounded-md text-xs ${searchType == 'article' && ('bg-blue-500 dark:bg-blue-500')} ${searchType == 'abstract' && ('bg-yellow-500 dark:bg-yellow-500')} ${searchType == 'speaker' && ('bg-orange-500 dark:bg-orange-500')} ${searchType == 'book' && ('bg-pink-500 dark:bg-pink-500')} ${searchType == 'patent' && ('bg-cyan-500 dark:bg-cyan-500')} ${searchType == 'name' && ('bg-red-500 dark:bg-red-500')} ${searchType == 'area' && ('bg-green-500 dark:bg-green-500')} ${searchType == '' && ('bg-blue-700 dark:bg-blue-700')} text-white border-0`}>
                                {valor.term.replace(/[|;]/g, '')}
                              </div>
                              {index < itemsSelecionados.length - 1 && (
                                <div className="rounded-full flex items-center justify-center whitespace-nowrap h-8 w-8 bg-neutral-100 dark:bg-neutral-800 transition-all text-xs outline-none">
                                  {itemsSelecionados[index].term.endsWith(';') ? "e" : "ou"}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Alert>
              )}

              <Alert className={`p-0 bg-cover bg-no-repeat bg-center ${(searchType == 'abstract' || searchType == 'name' || searchType == 'area') && ('col-span-4')}`}  >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de pesquisadores
                  </CardTitle>
                  <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{total?.researcher_count || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    encontrados na busca
                  </p>
                </CardContent>
              </Alert>
            </div>
          )}

          <MariaHome />

          {searchType !== 'abstract' && searchType !== 'name' && searchType !== 'area' && researcher.length > 0 && (
            <Accordion defaultValue="item-1" type="single" collapsible className="hidden md:flex w-full">
              <AccordionItem value="item-1" className="w-full">
                <div className="flex  w-full">
                  <HeaderResultTypeHome title="Pesquisadores mais relevantes por ordem de ocorrências" icon={<ListNumbers size={24} className="text-gray-400" />}>
                  </HeaderResultTypeHome>
                  <AccordionTrigger>

                  </AccordionTrigger>
                </div>
                <AccordionContent className="w-full p-0">

                  <CloudWordResearcherHome />

                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}

          {(searchType != 'name' && simcc && researcher.length > 0) && (
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
                      <Alert className="p-0">
                        <MapaResearcher
                          cityData={cityData}
                        />
                      </Alert>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          )}
          {searchType !== 'name' && searchType !== 'area' && researcher.length > 0 && (
            <Accordion defaultValue="item-1" type="single" collapsible className="hidden md:flex ">
              <AccordionItem value="item-1" className="w-full ">
                <div className="flex mb-2">
                  <HeaderResultTypeHome title="Gráficos dos pesquisadores" icon={<ChartBar size={24} className="text-gray-400" />}>
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
          )}

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
