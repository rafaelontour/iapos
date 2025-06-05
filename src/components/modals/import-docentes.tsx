import { FileXls, Upload } from "phosphor-react";
import { useModal } from "../hooks/use-modal-store";
import { Button } from "../ui/button";
import { DialogHeader } from "../ui/dialog";
import { useCallback, useContext, useState } from "react";
import { toast } from "sonner";
import { UserContext } from "../../context/context";
import { useDropzone } from "react-dropzone";

import { Sheet, SheetContent } from "../ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { ArrowRight, Info, LoaderCircle, X } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Link } from "react-router-dom";
import { DataTableModal } from "../componentsModal/data-table";
import { columnsDocentes } from "../componentsModal/columns-docentes";
import { Separator } from "../ui/separator";

export function ImportDocentes() {
  const { onClose, isOpen, type: typeModal } = useModal();
  const isModalOpen = isOpen && typeModal === "import-docentes";
  const { urlGeralAdm } = useContext(UserContext);

  const [file, setFile] = useState<File | null>(null);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number }>({
    name: "",
    size: 0,
  });
  const [dataDocentes, setDataDocentes] = useState<any[]>([]);
  const [dataTecnicos, setDataTecnicos] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState(false);

  const handleSubmitPatrimonio = async () => {
    try {
      if (!fileInfo?.name || !file) {
        toast("Erro: Nenhum arquivo selecionado", {
            description: "Por favor, selecione um arquivo .xls para enviar.",
            action: {
              label: "Fechar",
              onClick: () => console.log("Fechar"),
            },
          });
        return;
      }

      setUploadProgress(true);
      const formData = new FormData();
      formData.append("file", file);

      const url = `${urlGeralAdm}v2/ufmg/researcher/upload`;
      const response = await fetch(url, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toast("Arquivo enviado com sucesso", {
            description: "O arquivo foi enviado para o servidor.",
            action: {
              label: "Fechar",
              onClick: () => console.log("Fechar"),
            },
          });

          setDataDocentes([]);
          setDataTecnicos([]);
          setFile(null)
          setFileInfo({ name: "", size: 0 });
      } else {
        toast("Erro no envio", {
            description: "O servidor retornou um erro.",
            action: {
              label: "Fechar",
              onClick: () => console.log("Fechar"),
            },
          });
      }

      setFile(null);
      setFileInfo({ name: "", size: 0 });
    } catch (error) {
      console.error("Erro:", error);
      toast("Erro no envio", {
        description: "O servidor retornou um erro.",
        action: {
          label: "Fechar",
          onClick: () => console.log("Fechar"),
        },
      });
    } finally {
      setUploadProgress(false);
    }
  };

  return (
    <Sheet open={isModalOpen} onOpenChange={onClose}>
      <SheetContent className="p-0 dark:bg-neutral-900 dark:border-gray-600 min-w-[50vw]">
        <DialogHeader className="h-[50px] px-4 justify-center border-b dark:border-b-neutral-600">
          <div className="flex items-center gap-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-8 w-8"
                    variant={"outline"}
                    onClick={() => onClose()}
                    size={"icon"}
                  >
                    <X size={16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Fechar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <div className="flex ml-auto items-center w-full justify-between"></div>
          </div>
        </DialogHeader>

        <ScrollArea className="relative pb-4 h-[calc(100vh-50px)] p-8">
          <div className="mb-8">
            <p className="max-w-[750px] mb-2 text-lg font-light text-foreground">
              Indicadores
            </p>
            <h1 className="max-w-[500px] text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
              Atualizar dados da UFMG
            </h1>
            <Link
              to={"/modelos-documentos"}
              target="_blank"
              className="inline-flex mt-2 items-center rounded-lg bg-neutral-100 dark:bg-neutral-700 gap-2 mb-3 px-3 py-1 text-sm font-medium"
            >
              <Info size={12} />
              <div className="h-full w-[1px] bg-neutral-200 dark:bg-neutral-800"></div>
              Veja o modelo do documento .xls
              <ArrowRight size={12} />
            </Link>
          </div>

          {fileInfo.name && (
   <>
    <div className="justify-center flex items-center gap-3 mb-4">
        <FileXls size={16} />
        <p className="text-center text-zinc-500 text-sm">
            Arquivo selecionado: <strong>{fileInfo.name}</strong> ({(fileInfo.size / 1024).toFixed(2)} KB)
        </p>
    </div>

    
<Separator className="my-8"/></>
)}


          {dataDocentes.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold text-lg mb-2">Pré-visualização dos Docenets</h2>
              <DataTableModal
                columns={columnsDocentes}
                data={dataDocentes}
              />
             
             <Separator className="my-8"/>
            </div>
          )}



{dataTecnicos.length > 0 && (
  <div className="mt-6">
    <h2 className="font-semibold text-lg mb-2">Pré-visualização dos Técnicos Administrativos</h2>
    <DataTableModal
      columns={columnsDocentes} // use outra definição se os técnicos tiverem colunas diferentes
      data={dataTecnicos}
    />
   <Separator className="my-8"/>
  </div>
)}



<div className="flex items-center justify-between">
    <div className="text-sm font-gray-500">
    {uploadProgress ? ('Isso pode demorar bastante, não feche a página.'):('')}
    </div>
<Button onClick={() => handleSubmitPatrimonio()} className="ml-auto flex mt-3">
                        {uploadProgress ? (<LoaderCircle size={16} className="an animate-spin" />):(<Upload size={16} className="" />)}  {uploadProgress ? ('Atualizando dados'):('Atualizar dados')} 
                    </Button>

</div>

        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
