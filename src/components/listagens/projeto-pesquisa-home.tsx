import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../../context/context"
import { Skeleton } from "../ui/skeleton"
import { HeaderResult } from "../homepage/header-results"
import { Alert } from "../ui/alert"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Code, FolderKanban } from "lucide-react"
import { FilterYearPopUp } from "../popup/filters-year-popup"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home"
import { ChartBar, Rows, SquaresFour, StripeLogo } from "phosphor-react"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { BlockItemGeral } from "../homepage/categorias/book-home/block-item-geral"
import { TableReseracherMarcasPopup } from "../popup/columns/producoes-tecnicas/table-marcas-popup"
import { GraficoProjetoPesquisa } from "../popup/graficos/grafico-projeto-pesquisa"
import { TableReseracherProject } from "../popup/columns/table-projetos-pesquisa"
import debounce from "lodash.debounce"; // Importing debounce
import { useQuery } from "../dashboard/builder-page/tabelas/tabela-artigos"
import { FiltersBadge } from "../homepage/categorias/researchers-home/filters-badge"
import { useFiltersContext } from "../../context/filter-context"
import { Total } from "../homepage/categorias/book-home"
import { GraficoTotalProjetoPesquisa } from "./graficos/grafico-projeto-ano"

type Patente = {
  agency_code: string
  agency_name: string
  nature: string
  description: string
  end_year: string
  id: string
  number_academic_masters: string
  number_phd: string
  number_specialists: string
  number_undergraduates: string
  project_name: string
  start_year: string
  status: string
  researcher_id: string
  production: Production[]
  foment: Forment[]
  components: Components[]
  researcher_name: string
    }

    interface Components {
      citations: string
      lattes_id: string
      name: string
    }
    
    interface Production {
    
      title: string
      type: string
    }
    
    interface Forment {
      agency_code: string
      agency_name: string
      nature: string
    }
    

    type Filter = {
        year: number[]
        qualis: string[]
      }

export function ProjetoPesquisaHome() {
    const [publicacoes, setPublicacoes] = useState<Patente[]>([]);
    const [typeVisu, setTypeVisu] = useState('block')
    const [loading, isLoading] = useState(true)

    const [filters, setFilters] = useState<Filter[]>([]);

    const handleResearcherUpdate = (newResearcherData: Filter[]) => {
        setFilters(newResearcherData);
  
    }

    const yearString = filters.length > 0 ? filters[0].year.join(';') : '';

    const {urlGeral, valoresSelecionadosExport} = useContext(UserContext)
    const [distinct, setDistinct] = useState(false)
    const currentDate = new Date();
    const year = currentDate.getFullYear();
      const queryUrl = useQuery();
      const Page =  queryUrl.get('page') || '1';
      const Length =  queryUrl.get('length') || '24';
        const {
              selectedAreas,
              selectedGraduations,
              selectedCities,
              selectedDepartaments,
              selectedGraduatePrograms,
              selectedSubsidies,
              selectedUniversities
            } = useFiltersContext(); // ✅ correto
      
        const graduate_program_id = queryUrl.get('graduate_program_id');
        const dep_id = queryUrl.get('dep_id');
      
        function arrayToParam(arr?: string[]) {
          return (arr || []).join(';');
        }
      

    let urlTermPublicacoes = `${urlGeral}researcher_research_project?researcher_id=&term=&year=${yearString || 1990}&distinct=${distinct ? '1' : '0'}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}&graduate_program_id=${graduate_program_id ? graduate_program_id : ''}&dep_id=${dep_id ? dep_id : ''}`;
  
    console.log(urlTermPublicacoes)
    useMemo(() => {
        const fetchData = async () => {
            try {
              isLoading(true)
              const response = await fetch( urlTermPublicacoes, {
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
                setPublicacoes(data);
                isLoading(false)
              }
            } catch (err) {
              console.log(err);
            }
          };
          fetchData();
        }, [ urlTermPublicacoes]);

        const items = Array.from({ length: 12 }, (_, index) => (
            <Skeleton key={index} className="w-full rounded-md h-[170px]" />
          ));

          const updateDistinct = useCallback(
            debounce((value: boolean) => {
              setDistinct(value);
            }, 300), // 300ms de debounce
            []
          );

                const [total, setTotal] = useState<Total[]>([])
                const totalAmong = total.reduce((acc, item) => acc + item.among, 0);
              
              
                    let urlTotais = `${urlGeral}research_project_metrics?type=BOOK&term=${valoresSelecionadosExport}&year=${yearString || 1990}&distinct=${distinct ? '1' : '0'}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}&graduate_program_id=${graduate_program_id ? graduate_program_id : ''}&dep_id=${dep_id ? dep_id : ''}`;
                    
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
                              setTotal(data)
                            }
                          } catch (err) {
                            console.log(err);
                          } finally {
                    
                          }
                        };
                        fetchData();
                      }, [urlTotais]);
                


    return(
        <div className="grid grid-cols-1 gap-4 pb-16 ">
          <HeaderResult/>

                <FiltersBadge/>
             

          <div className="mt-6">
          <FilterYearPopUp
                onFilterUpdate={handleResearcherUpdate}/>
          </div>

          <div className="mt-4 ">
             <Alert className={`p-0 bg-cover bg-no-repeat bg-center `}  >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de projetos de pesquisa
                    </CardTitle>
                    <FolderKanban className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent className="flex justify-between items-end">
            <div>
            <div className="text-2xl font-bold">{totalAmong}</div>
            <p className="text-xs text-muted-foreground flex gap-2">
              encontrados na busca desde {yearString}
            </p>
            </div>

            <div className="gap-2 flex items-center h-fit text-xs text-gray-500 dark:text-gray-300">
  <p>Projetos de pesquisa:</p>
  <Switch
  checked={distinct}
  onCheckedChange={(value) => updateDistinct(value)}
/>
  <span>{distinct ? "Sem repetição" : "Com repetição"}</span>
</div>
          </CardContent>
                  </Alert>
             </div>

<Accordion  type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1" >
                <div className="flex ">
                <HeaderResultTypeHome title="Gráfico de quantidade total de novos projetos de pesquisa" icon={<ChartBar size={24} className="text-gray-400" />}>
                        </HeaderResultTypeHome>
                    <AccordionTrigger>
                    
                    </AccordionTrigger>
                    </div>
                    <AccordionContent className="p-0">
                    {loading ? (
                      <Skeleton className="w-full rounded-md h-[300px]"/>
                    ):(
                      <GraficoTotalProjetoPesquisa total={total} />

                    )}
                    </AccordionContent>
                </AccordionItem>
                </Accordion>

                <Accordion defaultValue="item-1"  type="single" collapsible >
                <AccordionItem value="item-1" >
                <div className="flex ">
                <div className="flex gap-4 w-full justify-between items-center ">
            <div className="flex gap-4 items-center">
            <FolderKanban size={24} className="text-gray-400" />
            <p className=" font-medium"> Projetos de pesquisa</p>
            </div>

            <div className="flex gap-3 mr-3  items-center h-full">
          

            <Button onClick={() => setTypeVisu('rows')}  variant={typeVisu == 'block' ? 'ghost' : 'outline' } size={'icon'}>
                            <Rows size={16} className=" whitespace-nowrap" />
                        </Button>

                        <Button  onClick={() => setTypeVisu('block')}  variant={typeVisu == 'block' ? 'outline' : 'ghost' }  size={'icon'}>
                            <SquaresFour size={16} className=" whitespace-nowrap" />
                        </Button>
            </div>

          </div>
                   

                    <AccordionTrigger>
                   
                    </AccordionTrigger>
                    </div>
                    <AccordionContent >

{typeVisu == 'block' ? (
                    loading ? (
                        <ResponsiveMasonry
                        columnsCountBreakPoints={{
                          350: 1,
                          750: 2,
                          900: 3,
                          1200: 4,
                          1700: 5
                        }}
                    >
                                     <Masonry gutter="16px">
                        {items.map((item, index) => (
                                <div className="w-full" key={index}>{item}</div>
                              ))}
                        </Masonry>
        </ResponsiveMasonry>
                      ):(
                        publicacoes.length == 0 ? (
                          <div className="items-center justify-center w-full flex text-center pt-6">Sem resultados para essa pesquisa</div>
                         ):(
                          <BlockItemGeral
                          articles={publicacoes}
                          distinct={distinct}
                          type={'research-project'}
                          />
                         )
                      )
                    ):(
                      loading ? (
                        
                        <Skeleton className="w-full rounded-md h-[400px]"/>
                      ):(
                     <TableReseracherProject
                                         projetos={publicacoes}
                                       />
                      )
                    )}
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
        </div>
    )
}