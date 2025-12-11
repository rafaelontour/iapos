import { useModal } from "../hooks/use-modal-store";
import { Sheet, SheetContent } from "../../components/ui/sheet";
import { ClipboardIcon, Download, Eye, Info, Trash, UserIcon, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { ArrowSquareOut, PencilSimple, Plus } from "phosphor-react";
import { DialogHeader } from "../ui/dialog";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/context";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Research } from "./researcher-modal";

export function PesquisadoresSelecionadosModal() {
  const { onClose, isOpen, type: typeModal, data, onOpen } = useModal();
  const { pesquisadoresSelecionados, urlGeral, permission, setPesquisadoresSelecionados } = useContext(UserContext)
  const isModalOpen = (isOpen && typeModal === "pesquisadores-selecionados")

  const history = useNavigate();
  const location = useLocation();
  const navigate = useNavigate();

  const handleVoltar = () => {
    
     const currentPath = location.pathname;
     const hasQueryParams = location.search.length > 0;
     
     if (hasQueryParams) {
       // Se tem query parameters, remove apenas eles
       navigate(currentPath);
     } else {
       // Se não tem query parameters, remove o último segmento do path
       const pathSegments = currentPath.split('/').filter(segment => segment !== '');
       
       if (pathSegments.length > 1) {
         pathSegments.pop();
         const previousPath = '/' + pathSegments.join('/');
         navigate(previousPath);
       } else {
         // Se estiver na raiz ou com apenas um segmento, vai para raiz
         navigate('/');
       }
     }
   };

  const close = () => {

    onClose()
  }

  const currentUrl = window.location.origin

  const handleRemove = (indexToRemove: number) => {
    setPesquisadoresSelecionados((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

 const [jsonData, setJsonData] = useState<Research[]>([]);

 let urlPesquisadores = `${urlGeral}researcherName?name=${pesquisadoresSelecionados
  .map((pesquisador) => encodeURIComponent(pesquisador.name))
  .join("|")}`;

  console.log(urlPesquisadores)

              useEffect(() => {
                const fetchData = async () => {
            
                  try {
                    const response = await fetch(urlPesquisadores, {
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
              }, [urlPesquisadores]);
  


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

  const hasBaremaAvaliacao = permission.some(
    (perm) => perm.permission === 'criar_barema_avaliacao'
  );


  return (
    <Sheet open={isModalOpen} onOpenChange={close}>
      <SheetContent
        className={`p-0 dark:bg-neutral-900 dark:border-gray-600 w-full lg:min-w-[50vw]`}
      >
        <DialogHeader className="h-[50px] px-4 justify-center border-b dark:border-b-neutral-600">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 w-8"
                    variant={"outline"}
                    onClick={() => {
                      handleVoltar()
                      onClose()
                    }}
                    size={"icon"}
                  >
                    <X size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent> Fechar</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <div className="flex ml-auto items-center w-full justify-between">
              <div className="flex ml-auto items-center gap-3"></div>
            </div>
          </div>
        </DialogHeader>


        <div>
          <ScrollArea className="relative pb-4 whitespace-nowrap h-[calc(100vh-50px)] p-8 ">
            <div className="mb-8 flex justify-between items-center">
              <div >
                <p className="max-w-[750px] mb-2 text-lg font-light text-foreground">
                 Pesquisadores
                </p>

                <h1 className="max-w-[500px] whitespace-pre-wrap flex-wrap text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
                Lista de selecionados
                </h1>
              </div>
            </div>

            <div className="flex flex-col  gap-4">

              
            {pesquisadoresSelecionados.length != 0 && (
              <Alert className="mb-8">
              <Info className="h-4 w-4" />
              <AlertTitle>Esses são os pesquisadores que você selecionou na plataforma</AlertTitle>
              <AlertDescription className="flex items-center gap-2">
                Você pode adicionar novos pesquisadores clicando no botão 
                <Button size="icon" className="h-6 w-6"><Plus size={12} /></Button>
              </AlertDescription>
            </Alert>
            
              )}

              {pesquisadoresSelecionados.length == 0 && (
                <div className=" h-[calc(100vh-236px)] flex flex-col  justify-center items-center w-full">
                                  <p className="text-9xl text-center text-[#719CB8] font-bold mb-16 animate-pulse">{`⚆_⚆`}</p>
                <h1 className="text-2xl md:text-3xl text-neutral-400 text-center font-medium leading-tight tracking-tighter lg:leading-[1.1] ">Nenhum pesquisador selecionado</h1>
                <p className="max-w-[600px] mt-4 text-sm text-gray-500 whitespace-normal text-justify">Selecione os pesquisadores na plataforma para realizar o download dos dados em formato CSV. Caso você possua acesso administrativo, é possível criar um novo barema de avaliação para aplicar aos docentes selecionados.</p>
               
                </div>
              )}
              {pesquisadoresSelecionados.map((props, index) => (
                <Alert key={index} className=" border-0 pt-0 border-b rounded-none">
                  <div className="flex justify-between items-center h-10 group">
                    <div className="h-10">
                      <div className="flex items-center gap-3">
                        <Avatar className="rounded-md h-10 w-10">
                          <AvatarImage
                            className="rounded-md h-10 w-10"
                            src={`${urlGeral}ResearcherData/Image?name=${props.name}`}
                          />
                          <AvatarFallback className="flex items-center justify-center">
                            <UserIcon size={12} />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{props.name}</p>
                          <div className="text-xs text-gray-500">{props.university}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className=" items-center gap-3 hidden group-hover:flex transition-all">

                      <Link to={`${currentUrl}/researcher?researcher_name=${props.name}&search_type=name&terms=`} target="_blank">
                            <Button variant={'outline'} className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <ArrowSquareOut size={8} className="h-4 w-4" />
                            </Button></Link>
                      <Button
            size="icon"
            variant="destructive"
            className="text-white h-8 w-8 dark:text-white"
            onClick={() => handleRemove(index)} // 🔥 Remove pesquisador
          >
            <Trash size={16} />
          </Button>
                      </div>


                    </div>
                  </div>
                </Alert>
              ))}
            </div>

           

            {pesquisadoresSelecionados.length > 0 && (
              <div className="flex mt-8 items-center gap-3 w-full justify-end">
             

<Button onClick={() => handleDownloadJson()} variant={hasBaremaAvaliacao ? ('ghost'):'default'} size={'sm'} className=" mt-3  flex ">
                  <Download size={16} className="" />Baixar dados
                </Button>


                { hasBaremaAvaliacao && (
                 <Link to={'/dashboard/baremas'}>
                 <Button size={'sm'} className="text-white dark:text-white mt-3 flex ">
                   <ClipboardIcon size={16} className="" />Criar barema de avaliação
                 </Button></Link>
              )}
              </div>

              
            )}


          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}