import {   ChevronsUpDown,   Maximize2,   Plus,  User, UserIcon} from "lucide-react";
import { Button } from "../../ui/button";

import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Eye,  MagnifyingGlass, Trash } from "phosphor-react";
import { Tabs, TabsContent } from "../../ui/tabs";
import { toast } from "sonner"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/context";
import { useModal } from "../../hooks/use-modal-store";

import { Alert } from "../../ui/alert";

import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";


import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";

export interface PesquisadorProps {
  lattes_id: string
  name: string
  researcher_id: string
  dep_id: string
  years: Array<number>
  }
  
  export interface PesquisadorProps2 {
    name: string
    lattes_id: string
    researcher_id: string
    institution_id: string
  }

  interface Props {
    graduate_program_id:string
  }

export function DocentesDepartamentoDisplay(props:Props) {
  
    const { urlGeralAdm, urlGeral } = useContext(UserContext);
    const [input, setInput] = useState('')
    const [input2, setInput2] = useState('')
    const { onOpen, isOpen, type:typeModal } = useModal();
    const [researcher, setResearcher] = useState<PesquisadorProps[]>([]);

    const urlGetResearcher = `${urlGeralAdm}departamentos/researcher?dep_id=${props.graduate_program_id}`;
console.log(urlGetResearcher)

    const fetchDataAll = async () => {
      try {
        const response = await fetch(urlGetResearcher, {
          mode: "cors",
          method: 'GET',
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
          // Certifique-se de que cada researcher tenha o graduate_program_id correto
          const researchersWithGraduateProgramId = data.map((researcher: PesquisadorProps) => ({
            ...researcher,
            graduate_program_id: props.graduate_program_id,
          }));
          setResearcher(researchersWithGraduateProgramId);
        }
      } catch (err) {
        console.log(err);
      }
    }

    useEffect(() => {
       
        fetchDataAll()
      

        }, [urlGeralAdm, props.graduate_program_id]);

        useEffect(() => {
          if (typeModal === 'confirm-delete-researcher-graduate-program'  && !isOpen) {
            fetchDataAll()
          } 
      
          fetchDataAll()
        }, [isOpen, typeModal]);

  
  const colaboradorCount = researcher.length


   //listar todos os pesquisadores popover
   const [pesquisadoreSelecionado, setPesquisadorSelecionado] = useState<PesquisadorProps2 | undefined>();


const [researcherSearch, setResearcherSearch] = useState<PesquisadorProps2[]>([]);

const urlGetResearcherSearch = urlGeralAdm + `ResearcherRest/Query?institution_id=&name=&count= `;

console.log(urlGetResearcherSearch)
useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await fetch(urlGetResearcherSearch, {
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
        setResearcherSearch(data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  fetchData();

 
}, [urlGetResearcherSearch, props.graduate_program_id]);

const [openPopo2, setOpenPopo2] = useState(false)

const normalizeString = (str:any) => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

const filteredList = researcherSearch.filter((framework) =>
  normalizeString(framework.name).includes(normalizeString(input))
);
const handleSubmit = async () => {

  try {
    const data = [
      {
        dep_id: props.graduate_program_id,
        researcher_id:pesquisadoreSelecionado?.researcher_id,
        }
    ]



    let urlProgram = urlGeralAdm + 'ResearcherRest/departament'


    const fetchData = async () => {
    
      try {
        const response = await fetch(urlProgram, {
          mode: 'cors',
          method: 'POST',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
         
          toast("Dados enviados com sucesso", {
              description: "Pesquisador adicionado no departamento",
              action: {
                label: "Fechar",
                onClick: () => console.log("Undo"),
              },
            })

            fetchDataAll()
            setPesquisadorSelecionado(undefined);
         
        } else {
          console.error('Erro ao enviar dados para o servidor.');
          toast("Tente novamente!", {
              description: "Erro ao cadastrar pesquisador no departamento",
              action: {
                label: "Fechar",
                onClick: () => console.log("Undo"),
              },
            })
        }
        
      } catch (err) {
        console.log(err);
      } 
    };
    fetchData();


    
  } catch (error) {
      toast("Erro ao processar requisição", {
          description: "Tente novamente!",
          action: {
            label: "Fechar",
            onClick: () => console.log("Undo"),
          },
        })
  }
};


const [selectedYears, setSelectedYears] = useState(
    researcher.map((props) => props.years ?? []) // Garantir um array vazio caso 'props.years' seja undefined
  );


useEffect(() => {
       
    setSelectedYears(researcher.map((props) => props.years))

    }, [researcher]);

console.log(selectedYears)

useEffect(() => {
  if (typeModal === 'confirm-delete-researcher-departament'  && !isOpen) {
    fetchDataAll()
  } 

  fetchDataAll()
}, [isOpen, typeModal]);

const [tab, setTab] = useState('all')



const filteredTotal = Array.isArray(researcher) ? researcher.filter(item => {
  // Normaliza a string do item e da busca para comparação
  const normalizeString = (str:any) => str
    .normalize("NFD") // Decompõe os caracteres acentuados
    .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos
    .toLowerCase(); // Converte para minúsculas

  const searchString = normalizeString(item.name);
  const normalizedSearch = normalizeString(input2);

  return searchString.includes(normalizedSearch);
}) : [];


console.log(filteredTotal)
    return(
        <div>
        <div className=" ">
        <CardContent className="flex flex-col justify-between pt-6 ">
        <Alert className="p-0 mb-4 md:mb-8">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">
                       Total de docentes 
                     </CardTitle>
                     <User className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                     <div className="text-2xl font-bold">{colaboradorCount}</div>
                     <p className="text-xs text-muted-foreground">
                     registrados no departamento
                     </p>
                   </CardContent>
                   </Alert>
 
    
 <Tabs value={tab} defaultValue={tab}>
 <Alert className="p-0">
               <CardHeader className="flex flex-row items-start bg-neutral-100 rounded-t-md dark:bg-neutral-800">
       <div className="flex items-center justify-between w-full">
         <CardTitle className="group flex items-center w-fit gap-2 text-lg">
           <div className="w-fit">Docentes</div>
         </CardTitle>
         <div className="flex gap-3 items-center ">
         
         </div>
       </div>
     </CardHeader>
 
              <CardContent className="mt-6">

            

             <TabsContent value="all">
             <div className="gap-6 flex  items-end">
 
 
             <div className="flex flex-col space-y-1.5 w-full flex-1">
             <Label htmlFor="name">Pesquisador da Unidade</Label>
 
             <Dialog open={openPopo2}  onOpenChange={setOpenPopo2}>
             <DialogTrigger className="w-full">
             <Button
                   variant="outline"
                   role="combobox"
                   aria-expanded={openPopo2}
                   className="w-full justify-between"
                 >
                   {pesquisadoreSelecionado
                     ? researcherSearch.find((framework) => framework.name === pesquisadoreSelecionado.name)?.name
                     : 'Selecione um pesquisador'}
                   <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                 </Button>
             </DialogTrigger>
             <DialogContent className="z-[9999]" >
 <DialogHeader>
 <DialogTitle>Escolher pesquisador</DialogTitle>
 <DialogDescription>
 Todos os docentes cadastrado no Módulo Administrativo da instituição
 </DialogDescription>
 </DialogHeader>
 
 <div className="border bg-white dark:bg-neutral-950 rounded-md px-6 h-12 flex items-center gap-1 border-neutral-200 dark:border-neutral-800">
                     <MagnifyingGlass size={16} />
                     <Input
                       className="border-0"
                       value={input}
                       onChange={(e) => setInput(e.target.value)}
                       placeholder="Buscar pesquisador"
                     />
                   </div>
 
                   <div className={'max-h-[350px] overflow-y-auto elementBarra'}>
                   
                   <div className="flex flex-col gap-1 p-2">
                     {filteredList.length > 0 ? (
                       filteredList.map((props, index) => (
                         <Button
                           variant={'ghost'}
                           key={index}
                           className="text-left justify-start"
                           onClick={() => {
                             setPesquisadorSelecionado(props);
                       
                             setOpenPopo2(false); // Fechar o popover após a seleção
                           }}
                         >
                           {props.name}
                         </Button>
                       ))
                     ) : (
                 <div className="text-center w-full text-sm">Nenhum pesquisador encontrado</div>
                     )}
                   </div>
                 </div>
 </DialogContent>
 
             </Dialog>
     </div>
 
     <Button  onClick={() => handleSubmit()}><Plus size={16}/>Adicionar</Button>
 
   </div>
             </TabsContent>

  
              </CardContent>
               </Alert>
 </Tabs>
            
               </CardContent>
 
               <div className="px-6">
               <div   className="flex flex-col gap-4">
               <div className="border bg-white dark:bg-neutral-950  rounded-md px-6 h-12 flex items-center gap-1 border-neutral-200 dark:border-neutral-800">
                     <MagnifyingGlass size={16} />
                     <Input
                       className="border-0"
                       value={input2}
                       onChange={(e) => setInput2(e.target.value)}
                       placeholder="Buscar pesquisador"
                     />
                   </div>

       {filteredTotal.map((props, index) => (
         <Alert key={index}>
          <div className="flex justify-between items-center h-10 group">
               <div className="h-10">
                 <div className="flex items-center gap-2">
                   <Avatar className="cursor-pointer rounded-md h-8 w-8">
                     <AvatarImage
                       className="rounded-md h-8 w-8"
                       src={`${urlGeral}ResearcherData/Image?name=${props.name}`}
                     />
                     <AvatarFallback className="flex items-center justify-center">
                       <UserIcon size={12} />
                     </AvatarFallback>
                   </Avatar>
                   <div>
                     <p className="font-medium">{props.name}</p>
                     <div className="text-xs text-gray-500">{props.lattes_id}</div>
                   </div>
                 </div>
               </div>
              <div className="flex items-center gap-3">
             <div className=" items-center gap-3 hidden group-hover:flex transition-all">
             <Button size={'icon'}  onClick={() => onOpen('researcher-modal', {name:props.name})} variant={'ghost'} className="h-10 w-10 ">
                   <Maximize2 size={16}  />
             </Button>
 
          <Button size={'icon'}  onClick={() => onOpen('confirm-delete-researcher-departament', {lattes_id:props.lattes_id, id_dep:props.dep_id, nome:props.name})} variant={'destructive'} className=" text-white h-10 w-10 dark:text-white">
                        <Trash size={16} />
                      </Button>
             </div>
 
              
              </div>
             </div>
         </Alert>
       ))}
     </div>
               </div>
 
              
        </div>
         </div>
    )
}