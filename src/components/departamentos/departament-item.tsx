import { Link, useLocation, useNavigate } from "react-router-dom";
import { VisualizacaoDepartamento } from "./visualizacao-departamento";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/context";
import { Alert } from "../ui/alert";
import { Buildings, MagnifyingGlass, Rows, SquaresFour } from "phosphor-react";
import { Input } from "../ui/input";
import { ArrowRight, Building, ChevronDown, ChevronLeft, ChevronUp, Download, File, GraduationCap, Hash, Info, Mail, Phone, SlidersHorizontal, User } from "lucide-react";
import { cn } from "../../lib"
import { Button } from "../ui/button";
import bg_graduate from '../../assets/bg_graduate.png'
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Helmet } from "react-helmet";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { DataTable } from "../popup/columns/popup-data-table";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Keepo } from "../dashboard/builder-page/builder-page";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useModal } from "../hooks/use-modal-store";
import { useQuery } from "../dashboard/builder-page/tabelas/tabela-artigos";

interface Props {
  dep_id: string
  org_cod: string
  dep_nom: string
  dep_des: string
  dep_email: string
  dep_site: string
  dep_tel: string
  img_data: string
  dep_sigla: string
  researchers:string[]

  url:string
  avatar:string
}

export function DepartamentItem(item:Props) {
      
    const {onOpen} = useModal()
const queryUrl = useQuery();
  const { urlGeralAdm, urlGeral } = useContext(UserContext)

    
      const navigate = useNavigate();
    
      const handlePesquisaFinal = (dep_id: string) => {
        queryUrl.set('dep_id', dep_id);
        navigate({
          pathname: item.url,
          search: queryUrl.toString(),
        });
      }

    return(
        <div className="flex cursor-pointer w-full" onClick={() => handlePesquisaFinal(item.dep_id)}>
                            <Alert className="">
                              <div className="flex justify-between items-center w-full">
                                <div className="text-xs font-medium mb-2 flex items-center gap-2 flex-1 min-w-0">
                                  <span className="truncate">{item.dep_sigla}</span>
                                </div>
                                <Building size={16} className="flex-shrink-0" />
                              </div>
                          
                              <div className="flex gap-3 mt-2">
                                <Avatar 
                                  className="cursor-pointer rounded-md relative border dark:border-neutral-800 h-14 w-14 flex-shrink-0"
                                >
                                  <AvatarImage 
                                    className="rounded-md h-14 w-14" 
                                    src={item.avatar} 
                                  />
                                  <AvatarFallback className="flex items-center justify-center">
                                    <Buildings size={16} />
                                  </AvatarFallback>
                                </Avatar>
                              
                                <div className="flex-1 min-w-0">
                                 <div>
                                 <h3 className="font-semibold text-lg truncate whitespace-normal ">
                                    {item.dep_nom}
                                  </h3>
                                 </div>
                              
                                  <div className="flex gap-2 flex-wrap mt-1">
                                    <div className="text-gray-500 text-sm flex gap-1 items-center min-w-0">
                                      <Phone size={12} className="flex-shrink-0" />
                                      <span className="truncate">{item.dep_tel}</span>
                                    </div>
                              
                                    <div className="text-gray-500 text-sm flex gap-1 items-center min-w-0">
                                      <Mail size={12} className="flex-shrink-0" />
                                      <span className="truncate">{item.dep_email}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                          
                              {item.researchers.length > 0 && (
                                <div className="flex justify-between items-center mt-8">
                                  <p className="text-sm text-gray-500">Pesquisadores:</p>
                                  <div className="flex items-center gap-2">
                                    {item.researchers.slice(0, 5).map((researcher, index) => (
                                      <Avatar 
                                        key={researcher}
                                        onClick={(event) => {
                                          event.stopPropagation(); 
                                          onOpen('researcher-modal', { name: researcher });
                                        }} 
                                        className="cursor-pointer rounded-full relative border dark:border-neutral-800 h-8 w-8 hover:z-10 transition-transform hover:scale-110"
                                        style={{
                                          marginLeft: index > 0 ? '-10px' : '0px',
                                        }}
                                      >
                                        <AvatarImage
                                          className="rounded-md h-8 w-8" 
                                          src={`${urlGeral}ResearcherData/Image?name=${researcher}`} 
                                        />
                                        <AvatarFallback className="flex items-center justify-center">
                                          <User size={16} />
                                        </AvatarFallback>
                                      </Avatar>
                                    ))}
                                  
                                    {item.researchers.length > 5 && (
                                      <div 
                                        className="h-8 w-8 flex items-center justify-center text-gray-500 bg-gray-100 dark:bg-neutral-800 rounded-full border dark:border-neutral-700 text-xs font-medium"
                                        style={{ marginLeft: '-10px' }}
                                      >
                                        +{item.researchers.length - 5}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Alert>
                          </div>
    )
}