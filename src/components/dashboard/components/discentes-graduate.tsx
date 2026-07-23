import { AreaChart, ChevronsUpDown, Globe, MapPinIcon, PencilLine, Plus, RefreshCcw, SquareArrowOutUpRight, Star, User, UserIcon, Users } from "lucide-react";
import { Button } from "../../ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Eye, EyeSlash, MagnifyingGlass, Student, Trash } from "phosphor-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "sonner"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/context";
import { useModal } from "../../hooks/use-modal-store";
import { DataTableModal } from "../../componentsModal/data-table";
import { columns } from "../../componentsModal/columns-researchers-program";
import { Alert } from "../../ui/alert";
import { Link } from "react-router-dom";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { v4 as uuidv4 } from 'uuid';
import { columnsStudent } from "../../componentsModal/columns-student-program";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import { Separator } from "../../ui/separator";
import CartaoOrientando from "./CartaoOrientando";

export interface PesquisadorProps {
    lattes_id: string
    name: string
    type_: string
    graduate_program_id: string
    years: Array<number>
}

interface Props {
    graduate_program_id: string
}

interface DiscenteItemProps {
    props: PesquisadorProps;
    index: number;
    selectedYears: Array<Array<number>>;
    handleYearsChange: (index: number, years: string[]) => void;
    handleUpdateData: (index: number, id_r: string) => void;
    years: number[];
    onOpen: any;
    urlGeral: string;
    urlGeralAdm: string;
}

function DiscenteItem({
    props,
    index,
    selectedYears,
    handleYearsChange,
    handleUpdateData,
    years,
    onOpen,
    urlGeral,
    urlGeralAdm
}: DiscenteItemProps) {
    const [orientacao, setOrientacao] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    // Busca a orientação deste discente específico no backend
    const buscarOrientacaoDoDiscente = async (lattesId: string, nomeEstudante: string) => {
        
        // 🔍 ADICIONE ESTE LOG AQUI:
        console.log("=== CHECK DE ID DO DISCENTE ===");
        console.log("Nome do Estudante:", nomeEstudante);
        console.log("Valor do lattesId recebido:", lattesId);
        console.log("Tamanho do ID:", lattesId?.length);

        if (!lattesId || lattesId === "undefined") {
            console.warn("ID do discente inválido para busca!");
            return;
        }

        setOrientacao(null); // Limpa o card anterior para não reaproveitar dados!
        setLoading(true);

        try {
            const response = await fetch(
                `${urlGeralAdm}guidance_tracking/?student_researcher_id=${lattesId}`, 
                { mode: "cors" }
            );
            if (response.ok) {
                const data = await response.json();
                if (data && data.length > 0) {
                    setOrientacao(data[0]);
                } else {
                    setOrientacao(null); // Se o aluno não tiver orientação cadastrada
                }
            } else {
                setOrientacao(null);
            }
        } catch (err) {
            console.error("Erro ao buscar orientacao do discente:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Vazio para evitar chamadas excessivas ao carregar a página
    }, []);

    return (
        <Alert>
            <AccordionItem value={String(index)}>
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
                        <div className="items-center gap-3 hidden group-hover:flex transition-all">
                            <Button 
                                size={'icon'} 
                                onClick={() => onOpen('confirm-delete-student-graduate-program', { lattes_id: props.lattes_id, graduate_program_id: props.graduate_program_id, nome: props.name })} 
                                variant={'destructive'} 
                                className="text-white h-10 w-10 dark:text-white"
                            >
                                <Trash size={16} />
                            </Button>
                        </div>
                        
                        <AccordionTrigger onClick={() => buscarOrientacaoDoDiscente((props as any).id || (props as any).researcher_id || props.lattes_id, props.name)}></AccordionTrigger>
                    </div>
                </div>

                <AccordionContent className="p-0">
                    <div className="flex w-full gap-4 items-end mt-4">
                        <div className="grid gap-4 w-full">
                            <Label htmlFor="years">Anos de participação</Label>
                            {selectedYears[index] ? (
                                <ToggleGroup
                                    type="multiple"
                                    className="gap-3 justify-start w-fit"
                                    value={selectedYears[index].map(String)}
                                    onValueChange={(years) => handleYearsChange(index, years)}
                                >
                                    {years.map((year) => (
                                        <ToggleGroupItem
                                            key={year}
                                            variant={'outline'}
                                            value={year.toString()}
                                            aria-label={`Toggle ${year}`}
                                        >
                                            {year}
                                        </ToggleGroupItem>
                                    ))}
                                </ToggleGroup>
                            ) : (
                                <p className="text-gray-500">Nenhum ano disponível</p>
                            )}
                        </div>
                        <Button onClick={() => handleUpdateData(index, props.lattes_id)}>
                            <RefreshCcw size={16} /> Atualizar dados
                        </Button>
                    </div>

                    {loading ? (
                        <p className="text-sm text-gray-500 mt-4 animate-pulse">Carregando situação da orientação...</p>
                    ) : orientacao ? (
                        <div className="mt-6 border-t pt-4">
                            <p className="font-semibold text-sm mb-3">Situação Acadêmica no Programa:</p>
                            <div className="max-w-md">
                                <p className="text-red-500 font-bold bg-yellow-300 p-2 text-center rounded">
                                    TESTE BUILD NOVO - FEAT SITUACAO DISCENTE
                                </p>
                                <CartaoOrientando 
                                    tipoPrograma={props.type_} 
                                    orientacaoC={{
                                        ...orientacao,
                                        student_name: props.name 
                                    }} 
                                    pesquisador={{
                                        ...props,
                                        // Passamos o ID correto para não quebrar a chamada da foto/pesquisador
                                        id: (props as any).id || (props as any).researcher_id || props.lattes_id
                                    }} 
                                    buscarOrientacoes={() => buscarOrientacaoDoDiscente((props as any).id || (props as any).researcher_id || props.lattes_id, props.name)} 
                                />
                            </div>
                        </div>
                    ) : (
                        // 💡 Se o aluno não tiver orientação cadastrada no banco:
                        <div className="mt-6 border-t pt-4 text-gray-500 text-sm italic">
                            Nenhuma orientação acadêmica cadastrada para este discente.
                        </div>
                    )}
                </AccordionContent>
            </AccordionItem>
        </Alert>
    );

}

export function DiscentesGraduate(props: Props) {
    const { urlGeralAdm, user, urlGeral } = useContext(UserContext);
    const { onOpen, isOpen, type: typeModal } = useModal();

    const [student, setStudent] = useState<PesquisadorProps[]>([]);

    let urlGetStudent = urlGeralAdm + `studentRest/query?graduate_program_id=${props.graduate_program_id}`;

    const fetchDataStudent = async () => {
        try {
            const response = await fetch(urlGetStudent, {
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
                const researchersWithGraduateProgramId = data.map((researcher: PesquisadorProps) => ({
                    ...researcher,
                    graduate_program_id: props.graduate_program_id,
                }));
                setStudent(researchersWithGraduateProgramId);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const [nomePesquisador, setNomePesquisador] = useState('');
    const [lattesID, setLattesID] = useState('');

    const handleSubmitPesquisadorUnique = async () => {
        const currentYear = new Date().getFullYear();

        try {
            const data = [
                {
                    student_id: uuidv4(),
                    name: nomePesquisador,
                    lattes_id: lattesID,
                    graduate_program_id: props.graduate_program_id,
                    institution_id: user?.institution_id,
                    year: `${currentYear}`
                }
            ]

            let urlProgram = urlGeralAdm + '/studentRest/insert'

            const fetchData = async () => {
                if (nomePesquisador.length != 0 && lattesID.length > 13) {
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
                            setLattesID('')
                            setNomePesquisador('')

                            toast("Dados enviados com sucesso", {
                                description: "Pesquisador cadastrado na instituição",
                                action: {
                                    label: "Fechar",
                                    onClick: () => console.log("Undo"),
                                },
                            })

                            fetchDataStudent()
                        } else {
                            toast("Erro ao enviar os dados ao servidor", {
                                description: "Tente novamenete",
                                action: {
                                    label: "Fechar",
                                    onClick: () => console.log("Undo"),
                                },
                            })
                        }
                    } catch (err) {
                        console.log(err);
                    }
                } else {
                    if (nomePesquisador.length == 0 && lattesID.length == 0) {
                        toast("Parece que os campos estão vazios", {
                            description: "Preencha os campos nome do pesquisador e Lattes Id",
                            action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                            },
                        })
                    } else if (lattesID.length < 14) {
                        toast("Parece que o Lattes Id está incorreto ou não preenchido", {
                            description: "O Lattes ID deve conter 13 números",
                            action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                            },
                        })
                    } else if (nomePesquisador.length == 0) {
                        toast("Preencha o nome do pesquisador", {
                            description: "Parece que o campo está vazio",
                            action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                            },
                        })
                    }
                }
            };
            fetchData();
        } catch (error) {
            console.error('Erro ao processar a requisição:', error);
        }
    };

    useEffect(() => {
        if (typeModal === 'confirm-delete-student-graduate-program' && !isOpen) {
            fetchDataStudent();
        }
        fetchDataStudent();
    }, [isOpen, typeModal, urlGetStudent, props.graduate_program_id]);

    const [selectedYears, setSelectedYears] = useState(
        student.map((props) => props.years ?? [])
    );

    const currentYear = new Date().getFullYear() + 1;
    const years = Array.from({ length: 12 }, (_, index) => currentYear - index);

    const handleYearsChange = (index: number, years: string[]) => {
        const newSelectedYears = [...selectedYears];
        newSelectedYears[index] = years.map((year) => parseInt(year));
        setSelectedYears(newSelectedYears);
    };

    useEffect(() => {
        setSelectedYears(student.map((props) => props.years))
    }, [student]);

    const handleUpdateData = (index: number, id_r: string) => {
        try {
            const data = [
                {
                    graduate_program_id: props.graduate_program_id,
                    lattes_id: id_r,
                    year: selectedYears[index].join(';'),
                }
            ]

            let urlProgram = urlGeralAdm + 'studentRest/update'

            const fetchData = async () => {
                try {
                    const response = await fetch(urlProgram, {
                        mode: 'cors',
                        method: 'PUT',
                        headers: {
                            'Access-Control-Allow-Origin': '*',
                            'Access-Control-Allow-Methods': 'PUT',
                            'Access-Control-Allow-Headers': 'Content-Type',
                            'Access-Control-Max-Age': '3600',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data),
                    });

                    if (response.ok) {
                        toast("Dados enviados com sucesso", {
                            description: "Pesquisador atualizado no programa de pós-graduação",
                            action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                            },
                        })
                        fetchDataStudent()
                    } else {
                        console.error('Erro ao enviar dados para o servidor.');
                        toast("Tente novamente!", {
                            description: "Erro ao atualizar pesquisador no programa",
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

    const [input2, setInput2] = useState('')

    const filteredTotal = Array.isArray(student) ? student.filter(item => {
        const normalizeString = (str: any) => str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();

        const searchString = normalizeString(item.name);
        const normalizedSearch = normalizeString(input2);

        return searchString.includes(normalizedSearch);
    }) : [];

    return (
        <div>
            <CardContent className="flex flex-col justify-between pt-6 ">
                <Alert className="p-0 mb-4 md:mb-8">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total de discentes
                        </CardTitle>
                        <Student className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{student.length}</div>
                        <p className="text-xs text-muted-foreground">
                            registrados
                        </p>
                    </CardContent>
                </Alert>

                <Alert className="p-0">
                    <CardHeader className="flex flex-row items-start bg-neutral-100 rounded-t-md dark:bg-neutral-800">
                        <div className="flex items-center justify-between w-full">
                            <CardTitle className="group flex items-center w-fit gap-2 text-lg">
                                <div className="w-fit">Discentes</div>
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="mt-6">
                        <div className="gap-6 flex mt-6 items-end">
                            <div className="grid gap-3 w-full">
                                <Label htmlFor="name">Nome completo</Label>
                                <Input value={nomePesquisador} onChange={(e) => setNomePesquisador(e.target.value)} type="text" />
                            </div>

                            <div className="grid gap-3 w-full">
                                <Label htmlFor="name">Lattes Id</Label>
                                <Input value={lattesID} onChange={(e) => setLattesID(e.target.value)} type="text" />
                            </div>

                            <Button onClick={() => handleSubmitPesquisadorUnique()}><Plus size={16} />Adicionar</Button>
                        </div>
                    </CardContent>
                </Alert>

                <Accordion type="single" className="flex flex-col gap-4 md:mt-8 mt-4">
                    <div className="border bg-white dark:bg-neutral-950 rounded-md px-6 h-12 flex items-center gap-1 border-neutral-200 dark:border-neutral-800">
                        <MagnifyingGlass size={16} />
                        <Input
                            className="border-0"
                            value={input2}
                            onChange={(e) => setInput2(e.target.value)}
                            placeholder="Buscar estudante"
                        />
                    </div>

                    {filteredTotal.map((props, index) => (
                        <DiscenteItem 
                            key={props.lattes_id || index}
                            props={props}
                            index={index}
                            selectedYears={selectedYears}
                            handleYearsChange={handleYearsChange}
                            handleUpdateData={handleUpdateData}
                            years={years}
                            onOpen={onOpen}
                            urlGeral={urlGeral}
                            urlGeralAdm={urlGeralAdm}
                        />
                    ))}
                </Accordion>
            </CardContent>
        </div>
    )
}