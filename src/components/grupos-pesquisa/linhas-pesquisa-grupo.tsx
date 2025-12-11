import { useContext, useEffect, useState } from "react"
import { UserContext } from "../../context/context"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { Alert } from "../ui/alert"
import { TextSearch } from "lucide-react"
import { useQuery } from "../dashboard/builder-page/tabelas/tabela-artigos"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { Button } from "../ui/button"
import { CalendarBlank, CaretRight, Rows, SquaresFour } from "phosphor-react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { Skeleton } from "../ui/skeleton"

import { DataTable } from "../homepage/categorias/researchers-home/data-table";
import { Badge } from "../ui/badge"

export interface Linhas {
    area: string
    keywords: string
    line: string
    major_area: string
    objective: string
}

export function LinhasPesquisaGrupo() {

       const [jsonData, setJsonData] = useState<Linhas[]>([]);
       const queryUrl = useQuery();
       const type_search = queryUrl.get('group_id');
        const {urlGeral , version, searchType} = useContext(UserContext)
           
        const [loading, isLoading] = useState(true)
        let urlLinhas = `${urlGeral}research_group_lines?group_id=${type_search}`

        console.log(urlLinhas)
      useEffect(() => {
                  const fetchData = async () => {
              
                    try {
                      const response = await fetch(urlLinhas, {
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
                    } finally {
                        isLoading(false)
                    }
                  };
                  fetchData();
                }, [urlLinhas]);


                const qualisColor: { [key: string]: string } = {
                    "ASTRONOMIA": "bg-red-200",
                    "FÍSICA": "bg-blue-200",
                    "GEOCIÊNCIAS": "bg-green-200",
                    "MATEMÁTICA": "bg-yellow-200",
                    "OCEANOGRAFIA": "bg-teal-200",
                    "PROBABILIDADE E ESTATÍSTICA": "bg-purple-200",
                    "QUÍMICA": "bg-orange-200",
                    "AGRONOMIA": "bg-red-800",
                    "CIÊNCIA E TECNOLOGIA DE ALIMENTOS": "bg-blue-800",
                    "ENGENHARIA AGRÍCOLA": "bg-green-800",
                    "MEDICINA VETERINÁRIA": "bg-yellow-800",
                    "RECURSOS FLORESTAIS E ENGENHARIA FLORESTAL": "bg-teal-800",
                    "RECURSOS PESQUEIROS E ENGENHARIA DE PESCA": "bg-purple-800",
                    "ZOOTECNIA": "bg-orange-800",
                    "BIOFÍSICA": "bg-red-600",
                    "BIOLOGIA GERAL": "bg-blue-600",
                    "BIOQUÍMICA": "bg-green-600",
                    "BIOTECNOLOGIA": "bg-yellow-600",
                    "BOTÂNICA": "bg-teal-600",
                    "ECOLOGIA": "bg-purple-600",
                    "FARMACOLOGIA": "bg-orange-600",
                    "FISIOLOGIA": "bg-red-400",
                    "GENÉTICA": "bg-blue-400",
                    "IMUNOLOGIA": "bg-green-400",
                    "MICROBIOLOGIA": "bg-yellow-400",
                    "MORFOLOGIA": "bg-teal-400",
                    "PARASITOLOGIA": "bg-purple-400",
                    "ZOOLOGIA": "bg-orange-400",
                    "EDUCAÇÃO FÍSICA": "bg-red-300",
                    "ENFERMAGEM": "bg-blue-300",
                    "FARMÁCIA": "bg-green-300",
                    "FISIOTERAPIA E TERAPIA OCUPACIONAL": "bg-yellow-300",
                    "FONOAUDIOLOGIA": "bg-teal-300",
                    "MEDICINA": "bg-purple-300",
                    "NUTRIÇÃO": "bg-orange-300",
                    "ODONTOLOGIA": "bg-red-100",
                    "SAÚDE COLETIVA": "bg-blue-100",
                    "ANTROPOLOGIA": "bg-green-100",
                    "ARQUEOLOGIA": "bg-yellow-100",
                    "CIÊNCIA POLÍTICA": "bg-teal-100",
                    "EDUCAÇÃO": "bg-purple-100",
                    "FILOSOFIA": "bg-orange-100",
                    "GEOGRAFIA": "bg-red-900",
                    "HISTÓRIA": "bg-blue-900",
                    "PSICOLOGIA": "bg-green-900",
                    "SOCIOLOGIA": "bg-yellow-900",
                    "TEOLOGIA": "bg-teal-900",
                    "CIÊNCIA DA COMPUTAÇÃO": "bg-purple-900",
                    "DESENHO INDUSTRIAL": "bg-orange-900",
                    "ENGENHARIA AEROESPACIAL": "bg-red-500",
                    "ENGENHARIA BIOMÉDICA": "bg-blue-500",
                    "ENGENHARIA CIVIL": "bg-green-500",
                    "ENGENHARIA DE ENERGIA": "bg-yellow-500",
                    "ENGENHARIA DE MATERIAIS E METALÚRGICA": "bg-teal-500",
                    "ENGENHARIA DE MINAS": "bg-purple-500",
                    "ENGENHARIA DE PRODUÇÃO": "bg-orange-500",
                    "ENGENHARIA DE TRANSPORTES": "bg-red-700",
                    "ENGENHARIA ELÉTRICA": "bg-blue-700",
                    "ENGENHARIA MECÂNICA": "bg-green-700",
                    "ENGENHARIA NAVAL E OCEÂNICA": "bg-yellow-700",
                    "ENGENHARIA NUCLEAR": "bg-teal-700",
                    "ENGENHARIA QUÍMICA": "bg-purple-700",
                    "ENGENHARIA SANITÁRIA": "bg-orange-700",
                    "ARTES": "bg-red-50",
                    "LETRAS": "bg-blue-50",
                    "LINGÜÍSTICA": "bg-green-50",
                    "BIOÉTICA": "bg-yellow-50",
                    "CIÊNCIAS AMBIENTAIS": "bg-teal-50",
                    "DEFESA": "bg-purple-50",
                    "DIVULGAÇÃO CIENTÍFICA": "bg-orange-50",
                    "MICROELETRÔNICA": "bg-red-700",
                    "ROBÓTICA, MECATRÔNICA E AUTOMAÇÃO": "bg-blue-700",
                    "SEGURANÇA CONTRA INCÊNDIO": "bg-green-700",
                    "ADMINISTRAÇÃO": "bg-yellow-700",
                    "ARQUITETURA E URBANISMO": "bg-teal-700",
                    "CIÊNCIA DA INFORMAÇÃO": "bg-purple-700",
                    "COMUNICAÇÃO": "bg-orange-700",
                    "DEMOGRAFIA": "bg-red-100",
                    "DIREITO": "bg-blue-100",
                    "ECONOMIA": "bg-green-100",
                    "ECONOMIA DOMÉSTICA": "bg-yellow-100",
                    "MUSEOLOGIA": "bg-teal-100",
                    "PLANEJAMENTO URBANO E REGIONAL": "bg-purple-100",
                    "SERVIÇO SOCIAL": "bg-orange-100",
                    "TURISMO": "bg-red-200",
                  };
                
                  const normalizeArea = (area: string): string => {
                    return area
                
                      .toUpperCase(); // Converte para maiúsculas
                  };
                
                

                const items = Array.from({ length: 12 }, (_, index) => (
                    <Skeleton key={index} className="w-full rounded-md h-[170px]" />
                  ));

                   const [typeVisu, setTypeVisu] = useState('block')

    return(
        <main className="flex flex-col gap-8 px-4 md:px-8">
<Alert className={`p-0  bg-cover bg-no-repeat bg-center `}  >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de linhas de pesquisa
            </CardTitle>
            <TextSearch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex justify-between items-end">
            <div>
            <div className="text-2xl font-bold">{jsonData.length || 0}</div>
            <p className="text-xs text-muted-foreground flex gap-2">
            no grupo de pesquisa
            </p>
            </div>

          </CardContent>
        </Alert>

        <Accordion defaultValue="item-1" type="single" collapsible >
        <AccordionItem value="item-1" >
          <div className="flex ">
            <div className="flex gap-4 w-full justify-between items-center ">
              <div className="flex gap-4 items-center">
                <TextSearch size={24} className="text-gray-400" />
                <p className=" font-medium">Linhas de pesquisa</p>
              </div>

              <div className="flex gap-3 mr-3  items-center h-full">
            

                <Button onClick={() => setTypeVisu('rows')} variant={typeVisu == 'block' ? 'ghost' : 'outline'} size={'icon'}>
                  <Rows size={16} className=" whitespace-nowrap" />
                </Button>

                <Button onClick={() => setTypeVisu('block')} variant={typeVisu == 'block' ? 'outline' : 'ghost'} size={'icon'}>
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
                    1200: 4
                  }}
                >
                  <Masonry gutter="16px">
                    {items.map((item, index) => (
                      <div className="w-full" key={index}>{item}</div>
                    ))}
                  </Masonry>
                </ResponsiveMasonry>
              ) : (
                jsonData.length == 0 ? (
                  <div className="items-center justify-center w-full flex text-center pt-6">Sem resultados para essa pesquisa</div>
                ) : (
                    <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      350: 1,
                      750: 2,
                      900: 3,
                      1200: 4
                    }}
                  >
                    <Masonry gutter="16px">
                     {jsonData.map((props) => (
                        <div className="flex w-full">
                            <div className={`rounded-r-none ${qualisColor[normalizeArea(props.area || '')]} border rounded-md dark:bg-neutral-800 w-2 min-w-2 border-r-0`}></div>
                            <Alert className="rounded-l-none">
                               
                                <h3 className="font-semibold text-left mb-4 flex flex-1">{props.line}</h3>
                                <div className="flex flex-wrap items-center gap-1 ">
                                <p className="text-left ">{props.major_area}</p> 

                                <CaretRight size={12}/>
                                <p className="text-left">{props.area}</p>
                                </div>
                            
                              
                            <div className="flex flex-wrap gap-2 mt-8 ">
                              {props.keywords.split(';').map((item, index) => (
                                   <Badge variant={'outline'} key={String(index)}> {item}</Badge>
                              ))}
                            </div>
                           
                            </Alert>
                        </div>
                     ))}
                    </Masonry>
                  </ResponsiveMasonry>
                )
              )
            ) : (
              loading ? (

                <Skeleton className="w-full rounded-md h-[400px]" />
              ) : (
                <div>

                </div>
              )
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

        </main>
    )
}