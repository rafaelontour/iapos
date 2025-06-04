import { useContext, useMemo, useState } from "react"
import { UserContext } from "../../context/context"
import { Skeleton } from "../ui/skeleton"
import { HeaderResult } from "../homepage/header-results"
import { Alert } from "../ui/alert"
import { CardContent, CardHeader, CardTitle } from "../ui/card"
import { BookOpen, Code, Hash, Plus } from "lucide-react"
import { FilterYearPopUp } from "../popup/filters-year-popup"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home"
import { ChartBar, LinkBreak, MagnifyingGlass, Rows, SquaresFour, StripeLogo } from "phosphor-react"
import { Switch } from "../ui/switch"
import { Button } from "../ui/button"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { BlockItemGeral } from "../homepage/categorias/book-home/block-item-geral"
import { TableReseracherMarcasPopup } from "../popup/columns/producoes-tecnicas/table-marcas-popup"
import { Link } from "react-router-dom"
import { Input } from "../ui/input"
import { DataTable } from "../popup/columns/popup-data-table"
import { columnsMagazine } from "./columns/colums-magazine"

type Patente = {
  id: string,
  issn: string,
  jcr_link: string,
  jif: string,
  magazine: string,
  qualis: string
    }

    type Filter = {
        year: number[]
        qualis: string[]
      }

      export const qualisColor = {
        'A1': 'bg-[#006837]',
        'A2': 'bg-[#8FC53E]',
        'A3': 'bg-[#ACC483]',
        'A4': 'bg-[#BDC4B1]',
        'B1': 'bg-[#F15A24]',
        'B2': 'bg-[#F5831F]',
        'B3': 'bg-[#F4AD78]',
        'B4': 'bg-[#F4A992]',
        'B5': 'bg-[#F2D3BB]',
        'C': 'bg-[#EC1C22]',
        'None': 'bg-[#560B11]',
        'SQ': 'bg-[#560B11]'
      };

export function MagazineHome() {
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

 
    let urlMagazine = `${urlGeral}magazine?initials=&issn=`
  
    const [pesquisaInput, setPesquisaInput] = useState('');

    if (pesquisaInput == "") {
      urlMagazine = `${urlGeral}magazine?initials=&issn=`
    }

else if (/^\d+$/.test(pesquisaInput)) {
// Se filterValue contiver apenas números
urlMagazine = `${urlGeral}magazine?initials=&issn=${pesquisaInput}`;
} else {
// Se filterValue contiver uma string
urlMagazine = `${urlGeral}magazine?initials=${pesquisaInput}&issn=`;
}

const [count, setCount] = useState(100)

    console.log(urlMagazine)
    useMemo(() => {
        const fetchData = async () => {
            try {
              isLoading(true)
              const response = await fetch( urlMagazine, {
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
        }, [ urlMagazine]);

        const items = Array.from({ length: 12 }, (_, index) => (
            <Skeleton key={index} className="w-full rounded-md h-[170px]" />
          ));


       


    return(
        <div className="grid grid-cols-1 gap-4  ">
          <HeaderResult/>

          <Alert className="h-14 mt-4 p-2 flex items-center justify-between  w-full ">
                <div className="flex items-center gap-2 w-full flex-1">
                  <MagnifyingGlass size={16} className=" whitespace-nowrap w-10" />
                  <Input value={pesquisaInput} onChange={(e) => setPesquisaInput(e.target.value)}  type="text" className="border-0 w-full " />
                </div>

                <div className="w-fit">


                </div>
              </Alert>

             <div className="mt-6 ">
             <Alert className={`p-0 bg-cover bg-no-repeat bg-center `}  >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total de revistas
                    </CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{publicacoes.length}</div>
                    <p className="text-xs text-muted-foreground">
                      encontradas na plataforma
                    </p>
                  </CardContent>
                  </Alert>
             </div>

          
   
                <Accordion defaultValue="item-1"  type="single" collapsible >
                <AccordionItem value="item-1" >
                <div className="flex ">
                <div className="flex gap-4 w-full justify-between items-center ">
            <div className="flex gap-4 items-center">
            <BookOpen size={24} className="text-gray-400" />
            <p className=" font-medium"> Revistas</p>
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
                            1200: 4
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
                         <div>
                            <ResponsiveMasonry
                      columnsCountBreakPoints={{
                          350: 1,
                          750: 2,
                          900: 3,
                          1200: 4
                      }}
                  >
                                   <Masonry gutter="16px">
                                      {publicacoes.slice(0, count).map((props) => (
                                        <div className="flex w-full">
                                         <div className={`h-full w-2 min-w-[8px] rounded-l-lg border border-r-0 border-neutral-200 dark:border-neutral-800 ${qualisColor[props.qualis as keyof typeof qualisColor]}` }></div>
                                        
                                         <Alert className="flex items-center rounded-l-none">
                                          <div className="flex items-center flex-1">
                                           
      
                                              <div >
                                              <div className="flex items-center gap-2">
                                                  <Hash size={16} className="text-gray-400" />
                                                  <p className="text-[13px]  text-gray-500">ISSN {props.issn}</p>
                                              </div>
                                              <h4 className="text-base font-medium ">{props.magazine}</h4>
                                             
                                             <div className="mt-2 flex items-center gap-4">

                                             <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center">
                                                <div className={`w-4 h-4 rounded-md ${qualisColor[props.qualis as keyof typeof qualisColor]}`}></div>Qualis {props.qualis}
                                              </div>

                                              {props.jif != "None" && (
              <Link to={props.jcr_link} className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center">
                <LinkBreak size={16} />JCR
              </Link>
            )}
                                             </div>
                                          </div>
                                          </div>
      
                                         
      
                      </Alert>
                                      </div>
                                      ))}
                                    </Masonry>
                                    </ResponsiveMasonry>

                            {publicacoes.length >= count && (
                                <div className="w-full flex justify-center mt-8"><Button onClick={() => setCount(count + 36)}><Plus size={16} />Mostrar mais</Button></div>
                            )}

                         </div>
                         )
                      )
                    ):(
                      loading ? (
                        
                        <Skeleton className="w-full rounded-md h-[400px]"/>
                      ):(
                     <DataTable
                           columns={columnsMagazine}              data={publicacoes}
                                       />
                      )
                    )}
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
        </div>
    )
}