import { useContext, useEffect, useState } from "react"
import { Keepo } from "../dashboard/builder-page/builder-page"
import { PreviewBuilderPage } from "../dashboard/builder-page/preview"
import { GrupoPesquisa } from "./visualizacao-grupo-pesquisa"
import { Research } from "../listagens/researchers-home"
import { UserContext } from "../../context/context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion"
import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home"
import { Button } from "../ui/button"
import { SquaresFour, UserList } from "phosphor-react"
import { Rows } from "lucide-react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { TableReseracherhome } from "../homepage/categorias/researchers-home/table-reseracher-home"
import { Skeleton } from "../ui/skeleton"
import { ResearchersBloco } from "../homepage/categorias/researchers-home/researchers-bloco"
import { ResearchItem } from "../homepage/categorias/researchers-home/researcher-item"

interface Props {
  program: GrupoPesquisa
  keepoData:Keepo
}

export function HomepageGrupoPesquisa(props: Props) {
    const [researcher, setResearcher] = useState<Research[]>([]);
       const [loading, setLoading] = useState(true);
      const [typeVisu, setTypeVisu] = useState('block');
    const {urlGeral} = useContext(UserContext)

    
    
      useEffect(() => {
        const fetchResearchers = async () => {
          if (!props.program) return;
    
         if(props.program) {
          const { first_leader, second_leader } = props.program;
 
    
          try {
            // Fetch data for first_leader
            const firstResponse = await fetch(`${urlGeral}/researcherName?name=${first_leader}`, {
              mode: "cors",
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "3600",
                "Content-Type": "text/plain",
              },
            });
    
            const firstData = await firstResponse.json();
    
            // Fetch data for second_leader if exists
            let secondData = [];
            if (second_leader) {
              const secondResponse = await fetch(`${urlGeral}/researcherName?name=${second_leader}`, {
                mode: "cors",
                headers: {
                  "Access-Control-Allow-Origin": "*",
                  "Access-Control-Allow-Methods": "GET",
                  "Access-Control-Allow-Headers": "Content-Type",
                  "Access-Control-Max-Age": "3600",
                  "Content-Type": "text/plain",
                },
              });
    
              secondData = await secondResponse.json();
            }
    
            // Combine results
            setResearcher([...firstData, ...secondData]);
            setLoading(false)
          } catch (err) {
            console.log(err);
          } finally {
            setLoading(false);
          }
         }
        
        };
    
        fetchResearchers();
      }, [props.program]);

        const items = Array.from({ length: 2 }, (_, index) => (
          <Skeleton key={index} className="w-full rounded-md h-[300px]" />
        ));
       
    

    return (
        <main className="h-full w-full flex flex-col px-4 md:px-8 pb-4 md:pb-8">
  <Accordion defaultValue="item-1" type="single" collapsible>
                <AccordionItem value="item-1">
                  <div className="flex mb-2">
                    <HeaderResultTypeHome title="Lider e/ou vice-lider do grupo de pesquisa" icon={<UserList size={24} className="text-gray-400" />}>
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
                                           {researcher.map((item: any) => {
                       
                                               return (
                                                   <ResearchItem
                                                   ufmg={item.ufmg}
                                                       among={item.among}
                                                       articles={item.articles}
                                                       book={item.book}
                                                       book_chapters={item.book_chapters}
                                                       id={item.id}
                                                       name={item.name}
                                                       university={item.university}
                                                       lattes_id={item.lattes_id}
                                                       area={item.area}
                                                       lattes_10_id={item.lattes_10_id}
                                                       city={item.city}
                                                       graduation={item.graduation}
                                                       patent={item.patent}
                                                       speaker={item.speaker}
                                                       h_index={item.h_index}
                                                       relevance_score={item.relevance_score}
                                                       works_count={item.works_count}
                                                       cited_by_count={item.cited_by_count}
                                                       i10_index={item.i10_index}
                                                       scopus={item.scopus}
                                                       openalex={item.openalex}
                                                       departament={item.departament}
                                                       departments={item.departaments}
                                                       subsidy={item.subsidy}
                                                       status={item.status}
                                                       graduate_programs={item.graduate_programs}
                                                   />
                                               );
                                           })}
                                       </Masonry>
                                   </ResponsiveMasonry>
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

                 {props.keepoData.content.length > 0 && (
                  <div className="mt-8">
                <PreviewBuilderPage keepoData={props.keepoData} />
                </div>
              )}
        </main>
    )
}