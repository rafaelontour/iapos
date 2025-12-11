import {  ChevronLeft, Plus,  Search, SquareMenu } from "lucide-react";

import { Button } from "../../ui/button";
import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import { Input } from "../../ui/input";


import { UserContext } from "../../../context/context";
import { TooltipProvider } from "../../ui/tooltip";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "../../ui/resizable";
import { Tabs, TabsContent } from "../../ui/tabs";
import { ItensListDepartamento } from "../components/itens-list-departamento";
import { useModal } from "../../hooks/use-modal-store";
import { DisplayItemDepartamento } from "../components/display-item-departamento";
import { Helmet } from "react-helmet";


interface Departamentos {
  dep_id:string
      org_cod: string
      dep_nom: string
      dep_des: string
      dep_email: string
      dep_site: string
      dep_tel: string
      img_data:string
      dep_sigla: string
}

export function Departamentos() {
   

    const {urlGeralAdm} = useContext(UserContext)
  
    const [menu, setMenu] = useState(true)

    const history = useNavigate();

    const handleVoltar = () => {
      history(-1);
    }


   



  ///

  const [tab] = useState('all')
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState<Departamentos | null>(null);

  const { defaultLayout } = useContext(UserContext);
  const {onOpen} = useModal()

  
  const handleOnMenuState= (newResearcherData: boolean) => {
    setMenu(newResearcherData);
  };

  // Função para lidar com a atualização de researcherData
  const handleResearcherUpdate = (newResearcherData: Departamentos) => {
    setTotal(newResearcherData);
  };

  const {version} = useContext(UserContext)

    return(
      <>
         <Helmet>
          <title>Departamentos | Módulo administrativo | {version ? ('Conectee'):('Simcc')} </title>
          <meta name="description" content={`Departamentos | Módulo administrativo | ${version ? ('Conectee'):('Simcc')}`} />
          <meta name="robots" content="index, follow" />
        </Helmet>

      <div className={`relative grid-cols-5 h-full  ${menu ? ('grid '):('flex')}`}>
      <div className={`col-span-2  sticky top-[68px] p-8 ${menu ? ('grid '):('pr-0')}`}>
       <Tabs defaultValue={tab} value={tab}>
       <div className={`flex items-center justify-between  `}>
       {menu && (
 <div className="flex items-center gap-4">
          
 <Button onClick={handleVoltar } variant="outline" size="icon" className="h-7 w-7">
     <ChevronLeft className="h-4 w-4" />
     <span className="sr-only">Voltar</span>
   </Button>
   <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">Departamentos</h1>
 </div>
       )}     
 

  </div>
 
  {menu && (
    <div className="bg-background/95 pt-8 pb-8 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="flex items-center gap-3">
      <Button onClick={() => onOpen('add-departamento')} className="ml-auto gap-1"  size="sm">
        <Plus size={16}/> Adicionar 
      </Button>
      <div className="relative w-full bg-white h-10 flex gap-2 items-center border pl-4 border-neutral-200 dark:border-neutral-800 rounded-md dark:bg-neutral-950">
        <Search size={16} />
        <Input placeholder="Filtrar pelo nome do departamento..." className="border-none h-8" value={search}  onChange={(e) => setSearch(e.target.value)}/>
      </div>
    </div>
  </div>
  )}


  <TabsContent value="all" className="m-0 flex flex-1 flex-col overflow-y-auto">
   <ItensListDepartamento
   onResearcherUpdate={handleResearcherUpdate}
   url={`${urlGeralAdm}departamentos`}
   search={search}
   menu={menu}
   />
  </TabsContent>
  <TabsContent value="unread" className="m-0">
 
  </TabsContent>
</Tabs>
       </div>
       

       <div className={`p-8  ${menu ? ('col-span-3 pl-0'):('flex-1 flex w-full')}`}>
    
             {total ? (
                 <div className="h-full w-full  ">
    <DisplayItemDepartamento
    dep_id={total.dep_id}
      org_cod={total.org_cod}
      dep_nom={total.dep_nom}
      dep_des={total.dep_des}
      dep_email={total.dep_email}
      dep_site={total.dep_site}
      dep_tel={total.dep_tel}
      img_data={total.img_data}
      dep_sigla={total.dep_sigla}
      menu_state={menu}
      onMenuState={handleOnMenuState}
    />
    </div>
  ):(
    <div className="h-full sticky top-[100px]   max-h-[calc(100vh-198px)]">
        <div className="w-full dark:border-neutral-800 rounded-lg border h-full flex flex-col items-center justify-center">
     <p className="text-9xl  text-eng-blue  font-bold mb-16 animate-pulse">^___^</p>
      <p className="font-medium text-lg">Nenhum departamento selecionado</p>
    </div>
   </div>
  )}
    
    </div>
    </div>
    </>
    )
}