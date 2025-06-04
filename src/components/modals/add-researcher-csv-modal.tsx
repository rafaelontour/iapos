import { ArrowUUpLeft, FileXls, Upload } from "phosphor-react";
import { useModal } from "../hooks/use-modal-store";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useCallback, useContext, useState } from "react";
import { toast } from "sonner"
import { UserContext } from "../../context/context";
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone'
import { Sheet, SheetContent } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { DataTableModal } from "../componentsModal/data-table";
import { columnsPesquisadoresModal } from "../componentsModal/columns-pesquisadores-modal";
import { ArrowRight, Info, LoaderCircle, X } from "lucide-react";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import { Link } from "react-router-dom";
import { Separator } from "../ui/separator";
interface Bolsista {
    name: string
    lattes_id: string
    researcher_id: string
    institution_id: string
    cpf:string
}

export function AddResearcherCsvModal() {
    const { onClose, isOpen, type: typeModal } = useModal();

    const isModalOpen = (isOpen && typeModal === 'add-researcher-csv')

    const { urlGeralAdm, user } = useContext(UserContext)
    const [fileInfo, setFileInfo] = useState({ name: '', size: 0 });

    const [data, setData] = useState<Bolsista[]>([]);

    const onDrop = useCallback((acceptedFiles: any) => {
        handleFileUpload(acceptedFiles);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
    });

    const handleFileUpload = (files: any) => {
        const uploadedFile = files[0];
        if (uploadedFile) {
            setFileInfo({
                name: uploadedFile.name,
                size: uploadedFile.size,
            });
            readExcelFile(uploadedFile);
        }
    };

    const readExcelFile = (file: File) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];

            // Convert the worksheet to JSON, starting from the third row
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

            // Extract headers from the first row
            const headers: string[] = json[0] as string[];

            // Remove the first row (headers themselves)
            const rows = json.slice(1);

            // Map headers to your interface keys
            // Corrigir headerMap para bater com os nomes reais da planilha
const headerMap: { [key: string]: keyof Bolsista } = {
    'name': 'name',
    'lattes_id': 'lattes_id',
    'cpf': 'cpf'
};


            // Convert rows to an array of objects
            const jsonData = rows.map((row: any) => {
                const obj: Bolsista = {
                    researcher_id: uuidv4(),
                    name: '',
                    lattes_id: '',
                     cpf: '',
                    institution_id: user?.institution_id || '',
                   
                };
                headers.forEach((header, index) => {
                    const key = headerMap[header];
                    if (key) {
                        obj[key] = String(row[index]) || "";
                    }
                });
                return obj;
            });

            setData(jsonData);
        };
        reader.readAsArrayBuffer(file);
    };

    const [uploadProgress, setUploadProgress] = useState(false);

    const handleSubmitBolsista = async () => {
        if (data.length === 0) {
            toast("Erro: Nenhum arquivo selecionado", {
                description: "Por favor, selecione um arquivo .xls para enviar.",
                action: { label: "Fechar", onClick: () => {} },
            });
            return;
        }
    
        setUploadProgress(true);
        const urlBolsistaInsert = `${urlGeralAdm}ResearcherRest/Insert`;
    
        const failedInserts: Bolsista[] = [];
        const validationErrors: { item: Bolsista; motivo: string }[] = [];
    
        for (const item of data) {
            const nomeValido = item.name?.trim().length > 0;
            const lattesId = item.lattes_id?.trim() || '';
            const lattesValido = lattesId.length >= 13;
            const cpf = item.cpf?.trim() || '';
            const cpfValido = cpf.length >= 11;
    
            // Regras de validação com prioridade para Lattes ID
            if (!nomeValido) {
                validationErrors.push({ item, motivo: 'Nome do pesquisador ausente.' });
                continue;
            }
    
            if (!lattesValido) {
                if (!cpfValido) {
                    validationErrors.push({
                        item,
                        motivo: lattesId.length > 0
                            ? 'Lattes ID inválido (menos de 13 caracteres) e CPF inválido ou ausente.'
                            : 'Lattes ID ausente e CPF inválido ou ausente.',
                    });
                    continue;
                }
            }
    
            // Envio ao backend
            try {
                const response = await fetch(urlBolsistaInsert, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST',
                        'Access-Control-Allow-Headers': 'Content-Type',
                        'Access-Control-Max-Age': '3600'
                    },
                    body: JSON.stringify(item),
                });
    
                if (!response.ok) {
                    if (response.status === 400) {
                        toast(`Pesquisador já existe: ${item.name}`, {
                            description: "Registro duplicado.",
                            action: { label: "Fechar", onClick: () => {} },
                        });
                    } else {
                        toast(`Erro ao enviar: ${item.name}`, {
                            description: `Erro ${response.status}`,
                            action: { label: "Fechar", onClick: () => {} },
                        });
                    }
                    failedInserts.push(item);
                }
            } catch (error) {
                console.error(`Erro ao enviar ${item.name}:`, error);
                failedInserts.push(item);
            }
        }
    
        setUploadProgress(false);
    
        if (validationErrors.length > 0) {
            console.warn("Erros de validação:", validationErrors);
            toast("Erros de validação", {
                description: `${validationErrors.length} registros ignorados.`,
                action: {
                    label: "Ver detalhes",
                    onClick: () => console.table(validationErrors),
                },
            });
        }
    
        if (failedInserts.length > 0 || validationErrors.length > 0) {
            setData(failedInserts.concat(validationErrors.map(v => v.item)));
            toast("Dados com erro", {
                description: `${failedInserts.length + validationErrors.length} registros falharam.`,
                action: { label: "Fechar", onClick: () => {} },
            });
        } else {
            setData([]);
            setFileInfo({ name: '', size: 0 });
            toast("Sucesso!", {
                description: "Todos os registros foram inseridos.",
                action: { label: "Fechar", onClick: () => {} },
            });
        }
    };
    
    

    console.log(data)

    return (
        <Sheet open={isModalOpen} onOpenChange={onClose}>
            <SheetContent className={`p-0 dark:bg-neutral-900 dark:border-gray-600 min-w-[50vw]`}>
                <DialogHeader className="h-[50px] px-4 justify-center border-b dark:border-b-neutral-600">

                    <div className="flex items-center gap-3">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button className="h-8 w-8" variant={'outline'} onClick={() => onClose()} size={'icon'}><X size={16} /></Button>
                                </TooltipTrigger>
                                <TooltipContent> Fechar</TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <div className="flex ml-auto items-center w-full justify-between">

                            <div className="flex ml-auto items-center gap-3">


                            </div>
                        </div>

                    </div>

                </DialogHeader>

                <ScrollArea className="relative pb-4 whitespace-nowrap h-[calc(100vh-50px)] p-8 ">
                    <div className="mb-8">
                        <p className="max-w-[750px] mb-2 text-lg font-light text-foreground">
                            Pesquisadores
                        </p>

                        <h1 className="max-w-[500px] text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
                            Adicionar pesquisadores com .xls
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
                    <div className="">
                        <div {...getRootProps()} className="border-dashed mb-6 flex-col border border-neutral-300 p-6 text-center rounded-md text-neutral-400 text-sm  cursor-pointer transition-all gap-3  w-full flex items-center justify-center hover:bg-neutral-100 mt-4">
                            <input {...getInputProps()} />
                            <div className="p-4  border rounded-md">
                                <FileXls size={24} className=" whitespace-nowrap" />
                            </div>
                            {isDragActive ? (
                                <p>Solte os arquivos aqui ...</p>
                            ) : (
                                <p>Arraste e solte o arquivo .xls aqui ou clique para selecionar o arquivo</p>
                            )}
                        </div>

                        <div>
                            {fileInfo.name && (
                              <>
                                <div className="justify-center flex items-center gap-3">
                                    <FileXls size={16} />
                                    <p className=" text-center  text-zinc-500 text-sm">
                                        Arquivo selecionado: <strong>{fileInfo.name}</strong> ({(fileInfo.size / 1024).toFixed(2)} KB)
                                    </p>
                                </div>

<Separator className="my-8"/></>
                            )}
                        </div>
                    </div>

                    {data.length > 0 && (
                        <div className="">

                            <h5 className="font-medium text-xl mb-4">Tabela de dados</h5>
                            <DataTableModal columns={columnsPesquisadoresModal} data={data} />
                          

                            <Separator className="my-8"/>
                           
                        </div>
                    )}

                    <div className="flex items-center justify-between">
                        <div className="text-sm font-gray-500">
                            {uploadProgress ? ('Isso pode demorar bastante, não feche a página.') : ('')}
                        </div>
                        <Button disabled={data.length == 0} onClick={() => handleSubmitBolsista()} className="ml-auto flex mt-3">
                            {uploadProgress ? (<LoaderCircle size={16} className="an animate-spin" />) : (<Upload size={16} className="" />)}  {uploadProgress ? ('Adicionando docentes') : ('Adicionar docentes')}
                        </Button>

                    </div>

                </ScrollArea>

            </SheetContent>
        </Sheet>
    )
}
