import { useContext, useEffect, useMemo, useState } from "react";
import { Badge } from "../ui/badge";
import { UserContext } from "../../context/context";
import { Alert } from "../ui/alert";
import { Blocks, Building2, Check, ChevronLeft, ClipboardEdit, FlaskConical, GraduationCap, Home, Link2, Mail, MailIcon, Minus, PieChart, SlidersHorizontal, User, Users, Weight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Button } from "../ui/button";
import { Tabs, TabsContent, TabsList } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { Research } from "../researcher/researcher-page";

import { useQuery } from "./builder-page/tabelas/tabela-artigos";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { VisaoGeralHomeDashboard } from "./home-dashboard/visao-geral";
import { ProgramsUserDashboard } from "./home-dashboard/programs-user-dashboard";
import { DepartamentsUserDashboard } from "./home-dashboard/departaments-user-dashboard";

export function HomeDashboard() {
  const { role, permission, urlGeral, urlGeralAdm, user, version } = useContext(UserContext);
  const history = useNavigate();

  const handleVoltar = () => {
    history(-1);
  };


  const queryUrl = useQuery();
  const [researcher, setResearcher] = useState<Research[]>([]);



  const tabs = [
    { id: "visao_geral", label: "Visão geral", icon: Home },
    { id: "pos_graduaçao", label: "Programas", icon: GraduationCap, condition:(user?.gp_count ?? 0) > 0 },
    { id: "departamento", label: "Departamentos", icon: GraduationCap, condition:(user?.dp_count ?? 0) > 0 },
   
  
 
  ];

  const [value, setValue] = useState(tabs[0].id)
  let urlTermPesquisadores = urlGeral + `researcherName?name=${user?.display_name}`;
  const [loading, isLoading] = useState(true)

  
      const navigate = useNavigate();
      const updateFilters = (category: string, values: any) => {
        if (values  ) {
         
          queryUrl.set(category, values);
         
        } else {
         queryUrl.delete(category)
        }
       
      };
  
  
      useEffect(() => {
        console.log("typeResult mudou para:", value);
         updateFilters("pagina", value );
    
         navigate({
          pathname: location.pathname,
          search: queryUrl.toString(),
        })
    
      }, [value]);
  


    useMemo(() => {
      const fetchData = async () => {
        try {
          isLoading(true)
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
            isLoading(false)
          }

  
        } catch (err) {
          console.log(err);
        }
      };
      fetchData();
    }, [urlTermPesquisadores]);


      const [variations, setVariations] = useState<string[]>([]);

   
  return (
    <main >
      <Helmet>
        <title>Dashboard | Módulo administrativo | {version ? 'Conectee' : 'Simcc'}</title>
        <meta name="description" content={`Dashboard | Módulo administrativo | ${version ? 'Conectee' : 'Simcc'}`} />
        <meta name="robots" content="index, follow" />
      </Helmet>
 
 <main className="grid grid-cols-1 ">
  <Tabs defaultValue={tabs[0].id} value={value} className="">
  <div className="md:p-8 p-4 pb-0">
<div className="bg-eng-blue pb-0 md:pb-0 p-4 md:p-8 flex-col flex justify-between  w-full rounded-md h-[300px]">
  <div
                  className="
                    flex flex-col items-center gap-4 justify-between

                    md:flex-row
                  "
                >
                  <div className="flex gap-2">
                    <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7 text-eng-blue hover:text-eng-blue">
                      <ChevronLeft className="h-4 w-4" />
                      <span className="sr-only">Voltar</span>
                    </Button>
                    <div
                      className="
                        flex flex-col gap-2

                        md:flex-col

                        lg:flex-row
                      "
                    >
                      <h1 className="flex-1 shrink-0 text-white whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                      Dashboard
      </h1>
                    </div>
                  </div>

                  <div
                    className="
                      flex items-center gap-2 flex-wrap
                    "
                  >
     
 


                  </div>
                </div>
  
  <div className="flex justify-end items-end flex-1 w-full ">
  <div className="flex justify-between w-full gap-8">

 <div className="absolute">
 <Avatar className="cursor-pointer rounded-lg  h-24 w-24 relative -top-12 xl:top-0">
            <AvatarImage className={'rounded-md h-24 w-24'} src={user?.photo_url} alt={user?.display_name} />
            <AvatarFallback className="flex items-center justify-center"><User size={24} /></AvatarFallback>
          </Avatar>
 </div>
<div className="  w-24 min-w-24">

</div>

  <div className="relative  grid-cols-1 hidden xl:grid">
<ScrollArea className="relative overflow-x-auto">
<TabsList className="p-0 justify-start flex gap-2 h-auto bg-transparent dark:bg-transparent">
{tabs.map(
({ id, label, icon: Icon, condition = true  }) =>
  condition && (
    <div
    key={id}
    className={`pb-2 border-b-2 text-black dark:text-white transition-all ${
      value === id ? "border-b-white" : "border-b-transparent"
    }`}
    onClick={() => setValue(id)}
  >
    <Button variant="ghost" className={`m-0 text-white hover:text-eng-blue ${ value === id ? "bg-white text-eng-blue" : ""}`}>
      <Icon size={16} />
      {label}
    </Button>
  </div>
  )
   
  
)}
</TabsList>
<ScrollBar orientation="horizontal" />
</ScrollArea>

<div>

</div>
</div>
  </div>
  </div>
  </div>
</div>

<div className="grid grid-cols-1 gap-4 md:gap-8  z-[2] pt-8 md:p-0">

                <div className="flex justify-between  md:px-8 items-center ">
        <div className="flex flex-col  gap-6 mt-8 px-8">
        

          <div>
          <h1 className="text-2xl mb-2 max-w-[800px] font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
              {user?.display_name}
            </h1>

            <p className="max-w-[750px] text-lg font-light text-foreground">
              <div className="flex flex-wrap gap-4 ">
              {user?.lattes_id != '' && (
                  <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Link2 size={12} />Id Lattes: {user?.lattes_id}</div>
                )}

                {user?.email != '' && (
                  <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><MailIcon size={12} />{user?.email}</div>
                )}
              </div>
            </p>

           

           
          </div>
        </div>
      </div>

      <div>
      <div className="px-8 md:px-8">
  <div className="relative grid grid-cols-1 xl:hidden">
    <ScrollArea className="relative w-full overflow-x-auto">
      <div className="flex w-full gap-2">
        <TabsList className="p-0 justify-start flex gap-2 h-auto bg-transparent dark:bg-transparent border pt-2 px-2 dark:bg-neutral-800 w-full">
          {tabs.map(({ id, label, icon: Icon, condition = true }) => (
             condition && (
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
             )
          
          ))}
        </TabsList>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
    <div></div>
  </div>
</div>

      </div>

              
               

<TabsContent value="visao_geral" className="m-0">
          <VisaoGeralHomeDashboard/>
</TabsContent>

<TabsContent value="pos_graduaçao" className="m-0">
        <div className="px-4 md:px-8 pb-4 md:pb-8">
        <ProgramsUserDashboard/>
        </div>
</TabsContent>


<TabsContent value="departamento" className="m-0">
<div className="px-4 md:px-8 pb-4 md:pb-8">
         <DepartamentsUserDashboard/>
         </div>
</TabsContent>



               
 </div>

  </Tabs>
  </main>

   
     </main>
  );
}
