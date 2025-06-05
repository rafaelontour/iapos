import { ArrowUUpLeft, FileXls, Upload } from "phosphor-react";
import { useModal } from "../hooks/use-modal-store";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { UserContext } from "../../context/context";
import { useDropzone } from 'react-dropzone';
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Progress } from "../ui/progress";

interface Patrimonio {
    semester: string;
    department: string;
    academic_activity_code: string;
    academic_activity_name: string;
    academic_activity_ch: string;
    demanding_courses: string;
    oft: string;
    id: string;
    available_slots: string;
    occupied_slots: string;
    percent_occupied_slots: string;
    schedule: string;
    language: string;
    professor: string;
    status: string;
    dep_id: string
}

export function ImportDisciplina() {
    const { onClose, isOpen, type: typeModal, data: dataModal } = useModal();
    const isModalOpen = (isOpen && typeModal === 'import-disciplina');
    const { urlGeralAdm } = useContext(UserContext);
    const [fileInfo, setFileInfo] = useState({ name: '', size: 0 });
    const [data, setData] = useState<Patrimonio[]>([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [semester, setSemester] = useState('1');
    const [uploadProgress, setUploadProgress] = useState(0);

    const [depId, setDepId] = useState(dataModal ? dataModal.dep_id : '')

    useEffect(() => {

        setDepId(dataModal.dep_id)
    }, [dataModal]);

    useEffect(() => {

        const dataToSet = data.map(item => ({
            ...item,
            dep_id: item.dep_id || 'default_value'
        }));
        setData(dataToSet);
    }, [depId]);

    console.log('deep', depId)

    const handleSubmitPatrimonio = async () => {
        try {
            if (data.length === 0) {
                toast("Erro: Nenhum arquivo selecionado", {
                    description: "Por favor, selecione um arquivo csv para enviar.",
                    action: {
                        label: "Fechar",
                        onClick: () => console.log("Fechar"),
                    },
                });
                return;
            }

            const urlPatrimonioInsert = urlGeralAdm + `departamentos/disciplinas`;

            const response = await fetch(urlPatrimonioInsert, {
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
                    description: "Todos os dados foram enviados.",
                    action: {
                        label: "Fechar",
                        onClick: () => console.log("Fechar"),
                    },
                });
            }

            setData([]);
            setFileInfo({
                name: '',
                size: 0,
            });

        } catch (error) {
            console.error('Erro ao processar a requisição:', error);
            toast("Erro ao processar a requisição", {
                description: "Tente novamente mais tarde.",
                action: {
                    label: "Fechar",
                    onClick: () => console.log("Fechar"),
                },
            });
        }
    };

    const currentYear = new Date().getFullYear();
    const years: any[] = [];
    for (let i = currentYear; i > currentYear - 4; i--) {
        years.push(i);
    }

    console.log(data)

    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent className="min-w-[40vw]">
                <DialogHeader className="pt-8 px-6 flex flex-col items-center">
                    <DialogTitle className="text-2xl text-center font-medium">
                        Importar arquivo .xls
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500 max-w-[350px]">
                        Atualize os itens do na Vitrine com a planilha .xls gerada no SICPAT
                    </DialogDescription>
                </DialogHeader>

                <div className="mb-4">

                    {fileInfo.name && (
                        <aside>
                            <h4>Arquivo</h4>
                            <ul>
                                <li key={fileInfo.name}>
                                    {fileInfo.name} - {(fileInfo.size / 1024).toFixed(2)} KB
                                </li>
                            </ul>
                        </aside>
                    )}
                </div>

                {uploadProgress > 0 && (
                    <Progress value={uploadProgress} className="w-full" />
                )}

                <DialogFooter className="mt-8">
                    <div className="w-full flex gap-3">
                        <Button onClick={onClose} className="w-full" variant='secondary'>
                            <ArrowUUpLeft className="mr-2" size={20} />
                            Cancelar
                        </Button>
                        <Button onClick={handleSubmitPatrimonio} className="w-full">
                            <Upload className="mr-2" size={20} />
                            Enviar arquivo
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
