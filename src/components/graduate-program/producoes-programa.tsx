import { useContext, useEffect, useMemo, useState } from "react"
import { UserContext } from "../../context/context"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home";
import { Button } from "../ui/button";

import { Books, ChartLine, ChartLineUp, MagnifyingGlass, Quotes, Rows, SquaresFour, StripeLogo, Student, UserList } from "phosphor-react";

import { ResearchersBloco } from "../homepage/categorias/researchers-home/researchers-bloco";
import { TableReseracherhome } from "../homepage/categorias/researchers-home/table-reseracher-home";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Book, BookOpen, BookOpenText, Briefcase, ChevronDown, ChevronLeft, ChevronUp, Code, Copyright, Download, File, Files, FolderKanban, Info, LibraryBig, MoreHorizontal, SlidersHorizontal, Ticket, UserCog, Users, UserSearch } from "lucide-react";
import { InfiniteMovingResearchers } from "../ui/infinite-moving-researcher";
import { Tabs, TabsContent, TabsList } from "../ui/tabs";
import { Input } from "../ui/input";
import { Alert } from "../ui/alert";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { ArticlesResearcherPopUp } from "../popup/articles-researcher";
import { ResearchersHome } from "../homepage/categorias/researchers-home";
import { ArticlesHome } from "../homepage/categorias/articles-home";
import { Helmet } from "react-helmet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { BookHome } from "../homepage/categorias/book-home";
import { PatentHome } from "../homepage/categorias/patent-home";

import { InfiniteMovingResearchersLoading } from "../ui/infinite-moving-researcher-loading";
import { ChapterHome } from "../homepage/categorias/chapter-home";
import { useQuery } from "../dashboard/builder-page/tabelas/tabela-artigos";
import { useModal } from "../hooks/use-modal-store";
import { TextoRevistaHome } from "../listagens/texto-revista";
import { WorkEventHome } from "../listagens/work-event-home";
import { MagazineHome } from "../listagens/magazine-home";
import { BrandHome } from "../listagens/brand-home";
import { SoftwareHome } from "../listagens/software-home";
import { OrientacoesHome } from "../listagens/orientacoes-home";
import { SpeakerHome } from "../homepage/categorias/speaker-home";
import { RelatorioTecnicoHome } from "../listagens/relatorio-tecnico-home";
import { ProjetoPesquisaHome } from "../listagens/projeto-pesquisa-home";

export function ProducoesPrograma() {
    const {urlGeral , version, searchType} = useContext(UserContext)
    
                const [jsonData, setJsonData] = useState<any[]>([]);

                
                            const [isOn, setIsOn] = useState(true);
                            const queryUrl = useQuery();
                
                            const tab = queryUrl.get('tab');
                         
                
                            const tabs = [
                 

                                { id: "book", label: "Livros", icon: Book },
                                { id: "chapter", label: "Capítulo de livros", icon: LibraryBig },
                         
                                { id: "article", label: "Artigos", icon: File },
                             
                                { id: "patent", label: "Patentes", icon: Copyright },
                                { id: "software", label: "Softwares", icon: Code },
                                { id: "brand", label: "Marcas", icon: StripeLogo },
                                { id: "relatorio-tecnico", label: "Relatório técnico", icon: Files },
                                { id: "orientacoes", label: "Orientações", icon: Student },
                                { id: "speaker", label: "Participação em eventos", icon: Ticket },
                                { id: "research-project", label: "Projetos de pesquisa", icon: FolderKanban },
                                { id: "texto-revista", label: "Texto em revista ou jornal", icon: BookOpenText },
                                { id: "work-event", label: "Trabalho em evento", icon: Briefcase },
                              ];
                              

                            const [value, setValue] = useState(tab || tabs[0].id)
                let urlPublicacoesPorPesquisador = ''
                if (value == 'article') {
                  urlPublicacoesPorPesquisador = `${urlGeral}bibliographic_production_researcher?terms=&researcher_id=&type=ARTICLE&qualis=&qualis=&year=1900`;
                } else if (value == 'pesquisadores') {
                  urlPublicacoesPorPesquisador = `${urlGeral}researcherName?name=`;
                } else if (value == 'speaker') {
                  urlPublicacoesPorPesquisador = `${urlGeral}pevent_researcher?researcher_id=&year=1900&term=&nature=`
                } else if (value == 'patent') {
                  urlPublicacoesPorPesquisador = `${urlGeral}patent_production_researcher?researcher_id=&year=1900&term=&distinct=`
                } else if (value == 'book') {
                  urlPublicacoesPorPesquisador = `${urlGeral}book_production_researcher?researcher_id=&year=1900&term=&distinct=0`
              
                  urlPublicacoesPorPesquisador = `${urlGeral}book_chapter_production_researcher?researcher_id=&year=1900&term=&distinct=0`
                } else if (value == 'bolsistas') {
                  urlPublicacoesPorPesquisador = `${urlGeral}/researcher/foment`
                } else if (value == 'software') {
                  urlPublicacoesPorPesquisador = `${urlGeral}software_production_researcher?researcher_id=&year=1900&distinct=0`
                }  else if (value == 'brand') {
                  urlPublicacoesPorPesquisador = `${urlGeral}brand_production_researcher?researcher_id=&year=1900&distinct=0`;
                }  else if (value == 'relatorio-tecnico') {
                  urlPublicacoesPorPesquisador = `${urlGeral}researcher_report?researcher_id=&year=1900&distinct=0`
                }
    
        
    
      const navigate = useNavigate();
    
                const updateFilters = (category: string, values: any) => {
                  if (values  ) {
                   
                    queryUrl.set(category, values);
                   
                  } else {
                   queryUrl.delete(category)
                  }
                 
                };
    
                  const location = useLocation();

       
    
                
                            useEffect(() => {
                              console.log("typeResult mudou para:", value);
                               updateFilters("tab", value );
                          
                               navigate({
                                pathname: location.pathname,
                                search: queryUrl.toString(),
                              })
                          
                            }, [value]);
                
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
                                } finally {
                          
                                }
                              };
                              fetchData();
                            }, [urlPublicacoesPorPesquisador]);
                
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

                                 const { onOpen: onOpenModal } = useModal();
                            


    return(
<main className="h-full w-full flex flex-col relative">
           <Tabs defaultValue="articles" value={value} className="relative ">
             <div className="sticky top-[68px]  z-[2] supports-[backdrop-filter]:dark:bg-neutral-900/60 supports-[backdrop-filter]:bg-neutral-50/60 backdrop-blur ">
              <div className={`w-full ${isOn ? 'px-8' : 'px-4'} border-b border-b-neutral-200 dark:border-b-neutral-800`}>
                {isOn && (
                  <div className="w-full pt-4  flex justify-between items-center">
                   
                  </div>
                )}
                <div className={`flex pt-2 gap-8 justify-between  ${isOn ? '' : ''} `}>
                  <div className="flex items-center gap-2">
                  <div className="relative grid grid-cols-1">
  <ScrollArea className="relative overflow-x-auto">
    <TabsList className="p-0 flex gap-2 h-auto bg-transparent dark:bg-transparent">
      {tabs.map(
        ({ id, label, icon: Icon }) =>
        
            <div
              key={id}
              className={`pb-2 border-b-2 text-black dark:text-white transition-all ${
                value === id ? "border-b-[#719CB8]" : "border-b-transparent"
              }`}
              onClick={() => setValue(id)}
            >
              <Button variant="ghost" className="m-0">
                <Icon size={16} />
                {label}
              </Button>
            </div>
        
      )}
    </TabsList>
    <ScrollBar orientation="horizontal" />
  </ScrollArea>

 
</div>

       
                   
                  </div>
                  <div className="hidden xl:flex xl:flex-nowrap gap-2">
                <div className="md:flex md:flex-nowrap gap-2">
                  <Link to={`${urlGeral}dictionary.pdf`} target="_blank">
                  <Button variant="ghost" className="">
                    <File size={16} className="" />
                    Dicionário de dados
                  </Button>
                  </Link>
                  <Button onClick={() => handleDownloadJson()} variant="ghost" className="">
                    <Download size={16} className="" />
                    Baixar resultado
                  </Button>

                     <Button onClick={() => onOpenModal('filters')} variant="ghost" className="">
                                        <SlidersHorizontal size={16} className="" />
                                        Filtros
                                      </Button>
                </div>

               
              </div>

              <div className="block xl:hidden">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button variant="ghost" className="h-8 w-8 p-0 xl:block">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Mais opções</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link to={`${urlGeral}dictionary.pdf`} target="_blank">
                    <DropdownMenuItem className="p-0">
                      <Button  variant="ghost" className="">
                        <File size={16} className="" />
                        Dicionário de dados
                      </Button>
                    </DropdownMenuItem>
                    </Link>

                    <DropdownMenuItem className="p-0">
                      <Button onClick={() => handleDownloadJson()} variant="ghost" className="">
                        <Download size={16} className="" />
                        Baixar resultado
                      </Button>
                    </DropdownMenuItem>

                   
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

                </div>
              </div>
            
            </div>

            <ScrollArea className="h-full">
            <div className="px-8">


            <TabsContent value="article">
            <ArticlesHome />
  </TabsContent>

  <TabsContent value="research-project">
            <ProjetoPesquisaHome />
  </TabsContent>

  <TabsContent value="book">
            <BookHome />
  </TabsContent>

  <TabsContent value="chapter">
            <ChapterHome />
  </TabsContent>


    <TabsContent value="relatorio-tecnico">
            <RelatorioTecnicoHome />
  </TabsContent>

  <TabsContent value="speaker">
            <SpeakerHome />
  </TabsContent>

  <TabsContent value="orientacoes">
            <OrientacoesHome />
  </TabsContent>

  <TabsContent value="patent">
            <PatentHome />
  </TabsContent>

  <TabsContent value="software">
            <SoftwareHome />
  </TabsContent>

  <TabsContent value="brand">
            <BrandHome />
  </TabsContent>

 

  
  <TabsContent value="work-event">
            <WorkEventHome />
  </TabsContent>

  <TabsContent value="texto-revista">
            <TextoRevistaHome />
  </TabsContent>
              </div>
           
          </ScrollArea>
          </Tabs>
        </main>
    )
}