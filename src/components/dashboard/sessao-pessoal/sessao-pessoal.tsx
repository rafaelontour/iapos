import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Button } from "../../ui/button";

import { ChevronLeft, Disc, File, Plus, Trash, Trash2, Upload, Weight } from "lucide-react";


import { useContext, useState } from "react";
import { CardContent, CardDescription, CardHeader, CardTitle } from "../../ui/card";
import { Alert } from "../../ui/alert";
import { UserContext } from "../../../context/context";
import { Helmet } from "react-helmet";

import { Worker, Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { HeaderResult } from "../../homepage/header-results";
import { HeaderResultTypeHome } from "../../homepage/categorias/header-result-type-home";
import { FilePdf } from "phosphor-react";
import { HeaderInstitution } from "../components/header-institutuion";
import { toast } from "sonner";


export function SessaoPessoal() {
       const history = useNavigate();
    
        const handleVoltar = () => {
          history(-1);
        }

        const {urlGeral} = useContext(UserContext)
        const [tab, setTab] = useState('all')
        
        //images
        const [images, setImages] = useState<{ url: string; name: string; type: string; size: number }[]>([]);

        const [files, setFiles] = useState<File[]>([]);

        const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
          const uploadedFiles = event.target.files;
          if (uploadedFiles) {
            const newFiles = Array.from(uploadedFiles);
            setFiles((prev) => [...prev, ...newFiles]);
        
            // Se quiser continuar mostrando os previews:
            const previewData = newFiles.map((file) => ({
              url: URL.createObjectURL(file),
              name: file.name,
              type: file.type,
              size: file.size,
            }));
            setImages((prevFiles) => [...prevFiles, ...previewData]);
          }
        };
        

        const uploadFiles = async () => {
          if (files.length === 0) {
            toast("Nenhum arquivo para enviar");
            return;
          }
        
          const formData = new FormData();
          files.forEach((file) => {
            formData.append("files", file); // ou "file[]" se o backend espera múltiplos arquivos
          });
        
          try {
            const response = await fetch(`${urlGeral}ufmg/researcher`, {
              method: "POST",
              body: formData,
            });
        
            if (!response.ok) throw new Error("Erro ao enviar arquivos");
        
            const result = await response.json();
            toast("Upload realizado com sucesso!");
            setFiles([])
            setImages([])
            console.log("Resposta do backend:", result);
          } catch (error) {
            console.error("Erro no upload:", error);
            toast("Erro ao enviar arquivos", {
              description: "Verifique sua conexão ou o formato do arquivo.",
            });
          }
        };
   
        
        const removeImage = (indexToRemove: number) => {
          setImages((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
        };
        

const {version} = useContext(UserContext)
    
    return(
        <main className="flex flex-1 flex-col gap-4  md:gap-8 ">
           <Helmet>
          <title>Seção de pessoal | Módulo administrativo | {version ? ('Conectee'):('Simcc')} </title>
          <meta name="description" content={`Seção de pessoal | Módulo administrativo | ${version ? ('Conectee'):('Simcc')}`} />
          <meta name="robots" content="index, follow" />
        </Helmet>
             <Tabs defaultValue={tab} value={tab} className="h-full" >
             <div className="w-full mb-8  gap-4">
            <div className="flex items-center gap-4 p-4 md:p-8 pb-0 md:pb-0">
          
            <Button onClick={handleVoltar } variant="outline" size="icon" className="h-7 w-7">
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Button>
          
              <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                Seção de pessoal
              </h1>
             

                
            
              <div className="hidden items-center gap-2 md:ml-auto md:flex">
              <TabsList >
                
              <TabsTrigger value="all" onClick={() => setTab('all')} className="text-zinc-600 dark:text-zinc-200">Visão geral</TabsTrigger>

             
                </TabsList>
               
          
             
              </div>
            </div>

            </div>

           

            <TabsContent value="all" className="px-8 flex flex-col gap-8 ">
            <HeaderInstitution/>
            <Alert className="p-0">
                <CardHeader>
                    <CardTitle>Gerenciamento de documentos</CardTitle>
                    <CardDescription>
                      Adicione os documentos para atualizar o banco de dados
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex mt-6 flex-col gap-4">
                    <Button className="w-fit">
                    <input
                  type="file"
                  accept=".pdf"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="upload"
                  multiple={true}
                />
                <label htmlFor="upload" className="cursor-pointer w-full h-full gap-2 flex items-center justify-center">
                <Plus size={16}/>
                  Adicionar documentos
                </label>
                    </Button>

                  </CardContent>
                </Alert>


                {images.length > 0 && (
                  <div className="flex flex-col gap-4">
                   <div className="mb-4">
                   <HeaderResultTypeHome title="Arquivos selecionados" icon={<FilePdf size={24} className="text-gray-400" />} />
                   </div>
                     {images.map((file, index) => (
        <Alert key={index} className="flex items-center gap-4 group w-full justify-between">
<div className="flex gap-3 items-center">
<Alert className="aspect-square h-13 w-12 flex items-center justify-center">
<File size={16}/>
         </Alert>
          <div>
            <p>{file.name.split('.pdf')}</p>
           <div className="flex gap-3">
           <p className="text-sm text-gray-500 flex items-center gap-1"><Disc size={12}/>{file.type.split("/")[1]}</p>
           <p className="text-sm text-gray-500 flex items-center gap-1"><Weight size={12}/> {(file.size / 1024).toFixed(2)} KB</p>
           </div>
          </div>

        
</div>

<div>
          <Button
      onClick={() => removeImage(index)}
     variant={'destructive'}
     size={'icon'}
     className="hidden h-8 w-8 group-hover:flex"
    >
      <Trash size={16} />
    </Button>
          </div>
        </Alert>
      ))}
                  </div>
                )}

{images.length > 0 && (
                 <div className="flex w-full justify-end gap-3">
                     <Button variant={'ghost'} onClick={() => {
                      setImages([])
                      setFiles([])
                     }}><Trash size={16}/>Deletar arquivos</Button>
                  <Button onClick={() => uploadFiles()}><Upload size={16}/>Upload dos arquivos</Button>
                 </div>
                )}


            </TabsContent>
             </Tabs>
        </main>
    )
}