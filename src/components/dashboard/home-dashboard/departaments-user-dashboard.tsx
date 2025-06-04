import { useContext, useEffect, useState } from "react";

import { UserContext } from "../../../context/context";
import { PosGraduationsProps } from "../pos-graduacao/pos-graduacao-view-dashboard";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { HeaderResultTypeHome } from "../../homepage/categorias/header-result-type-home";
import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Building2, GraduationCap, Plus } from "lucide-react";
import { Alert } from "../../ui/alert";
import { Button } from "../../ui/button";
import { Rows, SquaresFour } from "phosphor-react";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ProgramItem } from "../../graduate-program/program-item";
import { Skeleton } from "../../ui/skeleton";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { Keepo } from "../builder-page/builder-page";
import { columnsGraduate } from "../../graduate-program/columns-graduate";
import { DataTable } from "../data-table";
import { columnsGraduateAdmin } from "./columns-graduate";
import { DepartamentItem } from "../../departamentos/departament-item";
import { columnsDepartament } from "./columns-departament";

export interface Departamentos {
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
}


export function DepartamentsUserDashboard() {
     const { urlGeralAdm, user, defaultLayout } = useContext(UserContext);
    
          const [programas, setProgramas] = useState<Departamentos[]>([]);
    
         let urlPatrimonioInsert = `${urlGeralAdm}departamentos?user_id=${user?.user_id}`
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
                  setLoading(false)
                }
              }
              catch (err) {
                console.log(err);
              }
            };
            fetchData();
          }, []);
    
    
            const items = Array.from({ length: 12 }, (_, index) => (
              <Skeleton key={index} className="w-full rounded-md h-[250px]" />
            ));
          
            const [typeVisu, setTypeVisu] = useState('block');
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
    

    return(
         <main>
              <Alert className={`p-0 mb-6 bg-cover bg-no-repeat bg-center `}  >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">
                                Total de departamentos
                              </CardTitle>
                              <Building2 className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{programas.length}</div>
                              <p className="text-xs text-muted-foreground">
                                encontrados com acesso administrativo
                              </p>
                            </CardContent>
                          </Alert>

                           <Accordion defaultValue="item-1" type="single" collapsible>
                                                      <AccordionItem value="item-1">
                                                        <div className="flex mb-2 mt-4">
                                                          <HeaderResultTypeHome title="Departamentos" icon={<Building2 size={24} className="text-gray-400" />}>
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
                                                                    const id = props.dep_id
                                                                    const avatar = avatarMap[id] || "";
                                      
                                                                    return (
                                                                      <DepartamentItem
                                                                                        {...props}
                                                                                        avatar={avatar}
                                                                                        url={'/dashboard/departamento'}
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
                                                              <DataTable columns={columnsDepartament} data={programas} />
                                                            )
                                                          )}
                                                        </AccordionContent>
                                                      </AccordionItem>
                                                    </Accordion>
    </main>
    )
}