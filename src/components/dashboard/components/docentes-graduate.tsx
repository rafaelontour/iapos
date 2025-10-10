import { ChevronsUpDown, Maximize2, Plus, RefreshCcw, User, UserIcon, X } from "lucide-react";
import { Button } from "../../ui/button";

import { CardContent, CardHeader, CardTitle } from "../../ui/card";
import { MagnifyingGlass, Trash } from "phosphor-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { toast } from "sonner"
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../../context/context";
import { useModal } from "../../hooks/use-modal-store";

import { Alert } from "../../ui/alert";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Label } from "../../ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { v4 as uuidv4 } from 'uuid';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { ToggleGroup, ToggleGroupItem } from "../../ui/toggle-group";
import CartaoOrientando from "./CartaoOrientando";
import { Separator } from "../../ui/separator";
import { DialogClose } from "@radix-ui/react-dialog";
import { getDiscentesPorPrograma } from "../../../service/discentes";
import { adicionarOrientacao, getDocentesPorPrograma, getOrientacoesPorDocente } from "../../../service/docentes";
import { Card, CardDescription } from "../../ui/card";

export interface PesquisadorProps {
    lattes_id: string
    researcher_id: string
    name: string
    participation: any[]
    graduate_program_id: string;
}

export interface PesquisadorProps2 {
    name: string
    lattes_id: string
    researcher_id: string
    institution_id: string
    participation?: any[]
}

interface Props {
    graduate_program_id: string
}


interface GerenciadorOrientacoesProps {
    docente: PesquisadorProps;
}

interface AdicionarPesquisadorFormProps {
    graduate_program_id: string;
    availableResearchers: PesquisadorProps2[];
    onSuccess: () => void;
    urlGeralAdm: string;
}

type SelectedYears = {
    [year: string]: 'PERMANENTE' | 'COLABORADOR';
};

interface SelecaoPesquisadorStepProps {
    availableResearchers: PesquisadorProps2[];
    onSelectPesquisador: (pesquisador: PesquisadorProps2) => void;
}


function SelecaoPesquisadorStep({ availableResearchers, onSelectPesquisador }: SelecaoPesquisadorStepProps) {
    const [open, setOpen] = useState(false);
    const [input, setInput] = useState('');

    const normalizeString = (str: any) => {
        return str
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
    };

    const filteredList = availableResearchers.filter((framework) =>
        normalizeString(framework.name).includes(normalizeString(input))
    );

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col space-y-1.5 w-full">
                <Label htmlFor="name">Pesquisador da instituição</Label>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" role="combobox" className="w-full justify-between">
                            {'Selecione um pesquisador'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Escolher pesquisador</DialogTitle>
                            <DialogDescription>
                                Todos os docentes cadastrado no Módulo Administrativo da instituição
                            </DialogDescription>
                        </DialogHeader>
                        <div className="border rounded-md bg-white dark:bg-neutral-950 px-6 h-12 flex items-center gap-1 border-neutral-200 dark:border-neutral-800">
                            <MagnifyingGlass size={16} />
                            <Input
                                className="border-0"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Buscar docente"
                            />
                        </div>
                        <div className={'max-h-[350px] overflow-y-auto elementBarra'}>
                            <div className="flex flex-col gap-1 p-2">
                                {filteredList.length > 0 ? (
                                    filteredList.map((props) => (
                                        <Button variant={'ghost'} key={props.researcher_id} className="text-left justify-start"
                                            onClick={() => {
                                                onSelectPesquisador(props);
                                                setOpen(false);
                                            }}>
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
        </div>
    );
}

interface ConfiguracaoParticipacaoStepProps {
    pesquisador: PesquisadorProps2;
    graduate_program_id: string;
    onSuccess: () => void;
    onCancel: () => void;
    urlGeralAdm: string;
    isNew: boolean;
}
function ConfiguracaoParticipacaoStep({ pesquisador, graduate_program_id, onSuccess, onCancel, urlGeralAdm, isNew }: ConfiguracaoParticipacaoStepProps) {
    const [selectedYears, setSelectedYears] = useState<SelectedYears>({});
    const [tag, setTag] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const currentYear = new Date().getFullYear();
    const availableYears = Array.from({ length: 10 }, (_, i) => (currentYear - i).toString());

    useEffect(() => {
        if (pesquisador.participation && pesquisador.participation.length > 0) {
            const initialYears: SelectedYears = {};
            pesquisador.participation.forEach(p => {
                if (p.year && p.type_) initialYears[p.year.toString()] = p.type_;
            });
            setSelectedYears(initialYears);
        }
    }, [pesquisador]);

    const handleYearClick = (year: string) => {
        const currentType = selectedYears[year];
        if (currentType === 'PERMANENTE') {
            setSelectedYears(prev => ({ ...prev, [year]: 'COLABORADOR' }));
        } else if (currentType === 'COLABORADOR') {
            setSelectedYears(prev => {
                const newState = { ...prev };
                delete newState[year];
                return newState;
            });
        } else {
            setSelectedYears(prev => ({ ...prev, [year]: 'PERMANENTE' }));
        }
    };

    const handleSubmit = async () => {
        const years = Object.keys(selectedYears);
        if (years.length === 0) {
            toast.error("Nenhum ano de participação foi selecionado.");
            return;
        }
        setIsLoading(true);

        try {
            if (!isNew) {
                const urlDelete = `${urlGeralAdm}GraduateProgramResearcherRest/Delete`;
                const deleteData = [{
                    graduate_program_id: graduate_program_id,
                    lattes_id: pesquisador.researcher_id,
                }];
                const deleteResponse = await fetch(urlDelete, {
                    mode: 'cors',
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(deleteData),
                });
                if (!deleteResponse.ok) {
                    toast.error("Tente novamente!", {
                        description: "Falha ao remover os registros antigos do pesquisador.",
                    });
                    setIsLoading(false);
                    return;
                }
            }

            const insertData = years.map(year => ({
                graduate_program_id: graduate_program_id,
                researcher_id: pesquisador.researcher_id,
                year: year,
                type_: selectedYears[year],
                tag: tag || null,
            }));

            const urlInsert = `${urlGeralAdm}GraduateProgramResearcherRest/Insert`;
            const insertResponse = await fetch(urlInsert, {
                mode: 'cors',
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(insertData),
            });

            if (insertResponse.ok) {
                toast.success("Dados enviados com sucesso", {
                    description: "Participações do pesquisador foram salvas.",
                });
                onSuccess();
            } else {
                toast.error("Tente novamente!", {
                    description: "Erro ao salvar as novas participações do pesquisador.",
                });
            }
        } catch (error) {
            console.error(error);
            toast.error("Erro ao processar requisição", {
                description: "Verifique sua conexão e tente novamente.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full animate-in fade-in-0">
            {isNew && (
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="text-lg flex items-center gap-2">
                                <User size={20} />
                                {pesquisador.name}
                            </CardTitle>
                            <CardDescription>Defina os detalhes da participação.</CardDescription>
                        </div>
                        <Button variant="ghost" size="icon" onClick={onCancel}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
            )}
            <CardContent className="flex flex-col gap-6 pt-6">
                <div className="flex flex-col space-y-2">
                    <Label>Anos de participação</Label>
                    <p className="text-sm text-muted-foreground">
                        Clique uma vez para <span className="text-green-500 font-semibold">PERMANENTE</span>,
                        outra para <span className="text-blue-500 font-semibold">COLABORADOR</span>, e novamente para remover.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {availableYears.map((year) => {
                            const type = selectedYears[year];
                            const variant = type ? 'default' : 'outline';
                            const colorClass = type === 'PERMANENTE'
                                ? 'bg-green-600 hover:bg-green-700'
                                : type === 'COLABORADOR'
                                    ? 'bg-blue-600 hover:bg-blue-700'
                                    : '';
                            return (
                                <Button
                                    key={year}
                                    variant={variant}
                                    className={colorClass}
                                    onClick={() => handleYearClick(year)}
                                >
                                    {year} {type && `- ${type.substring(0, 4)}.`}
                                </Button>
                            );
                        })}
                    </div>
                </div>
                <Separator />

                <Button onClick={handleSubmit} disabled={isLoading}>
                    <Plus size={16} className="mr-2" />
                    {isLoading ? 'Salvando...' : 'Salvar Participação'}
                </Button>
            </CardContent>
        </Card>
    );
}

export default function AdicionarPesquisadorForm({ graduate_program_id, availableResearchers, onSuccess, urlGeralAdm }: AdicionarPesquisadorFormProps) {
    const [pesquisadorSelecionado, setPesquisadorSelecionado] = useState<PesquisadorProps2 | null>(null);

    const handleSelectPesquisador = (pesquisador: PesquisadorProps2) => {
        setPesquisadorSelecionado(pesquisador);
    };

    const handleCancel = () => {
        setPesquisadorSelecionado(null);
    };

    const handleSuccess = () => {
        onSuccess();
        setPesquisadorSelecionado(null);
    };

    return <div className="w-full">
        {!pesquisadorSelecionado ? (
            <SelecaoPesquisadorStep
                availableResearchers={availableResearchers}
                onSelectPesquisador={handleSelectPesquisador}
            />
        ) : (
            <ConfiguracaoParticipacaoStep
                pesquisador={pesquisadorSelecionado}
                onCancel={handleCancel}
                onSuccess={handleSuccess}
                graduate_program_id={graduate_program_id}
                urlGeralAdm={urlGeralAdm}
                isNew={true}
            />
        )}
    </div>
}

function GerenciadorOrientacoes({ docente }: GerenciadorOrientacoesProps) {
    const { urlGeralAdm } = useContext(UserContext);
    const [tipoOrientacao, setTipoOrientacao] = useState<any>(null)
    const [orientacoes, setOrientacoes] = useState<any>([])

    const [idOrientador, setIdOrientador] = useState<string | null>(null)
    const [idOrientando, setIdOrientando] = useState<string | null>(null)
    const [idCoorientador, setIdCoorientador] = useState<string | null>(null)

    const [dataEntrada, setDataEntrada] = useState<string | null>(null)
    const [dataPrevisaoDefesa, setDataPrevisaoDefesa] = useState<string | null>(null)
    const [dataRealizadaDefesa, setDataRealizadaDefesa] = useState<string | null>(null)

    const [dataPrevisaoQualificacao, setDataPrevisaoQualificacao] = useState<string | null>(null)
    const [dataRealizadaQualificacao, setDataRealizadaQualificacao] = useState<string | null>(null)

    const [dataPrevisaoDefesaFinal, setDataPrevisaoDefesaFinal] = useState<string | null>(null)
    const [dataRealizadaDefesaFinal, setDataRealizadaDefesaFinal] = useState<string | null>(null)

    const [discentesPosGraduacao, setDiscentesPosGraduacao] = useState<any[]>([])
    const [docentesPosGraduacao, setDocentesPosGraduacao] = useState<any[]>([])

    const [openDialogAdicionar, setOpenDialogAdicionar] = useState<boolean>(false);

    useEffect(() => {
        if (dataEntrada !== null) {
            gerarDatas(dataEntrada, "DEFESA_DO_PROJETO");
            gerarDatas(dataEntrada, "QUALIFICACAO");
            gerarDatas(dataEntrada, "DEFESA_FINAL");
        }
    }, [dataEntrada, tipoOrientacao])

    function buscarDiscentes() {
        const discentes = getDiscentesPorPrograma(docente.graduate_program_id);

        discentes.then((response) => {
            setDiscentesPosGraduacao(response)
        })
    }

    // Efeito para buscar dados quando o componente é montado
    useEffect(() => {
        infoPrograma();
        buscarDiscentes();

        const docentes = getDocentesPorPrograma(docente.graduate_program_id);
        docentes.then((response) => {
            setDocentesPosGraduacao(response)
        });

        buscarOrientacoesPorDocente(docente.researcher_id, docente.graduate_program_id);
    }, [docente.graduate_program_id, docente.researcher_id])

    function gerarDatas(d: string, tipo?: string): void {
        const [anoStr, mesStr, diaStr] = d.split("-");
        const ano = parseInt(anoStr);
        const mes = parseInt(mesStr) - 1;
        const dia = parseInt(diaStr);

        const data = new Date(ano, mes, dia);
        let mesesAdicionais: number;

        if (tipo) {
            if (tipo === "DEFESA_DO_PROJETO") {
                tipoOrientacao === "Mestrado" ? mesesAdicionais = 3 : mesesAdicionais = 18;
                data.setMonth(data.getMonth() + mesesAdicionais);
                data.setDate(dia);
                const novoAno = data.getFullYear();
                const novoMesPrevisao = String(data.getMonth() + 1).padStart(2, "0");
                const dataFormadaPrevisao = `${novoAno}-${novoMesPrevisao}-${diaStr}`;
                setDataPrevisaoDefesa(dataFormadaPrevisao);
            }

            if (tipo === "QUALIFICACAO") {
                tipoOrientacao === "Mestrado" ? mesesAdicionais = 21 : mesesAdicionais = 30;
                data.setMonth(data.getMonth() + mesesAdicionais);
                data.setDate(dia);
                const novoAno = data.getFullYear();
                const novoMesPrevisao = String(data.getMonth() + 1).padStart(2, "0");
                const dataFormadaPrevisao = `${novoAno}-${novoMesPrevisao}-${diaStr}`;
                setDataPrevisaoQualificacao(dataFormadaPrevisao);
            }

            if (tipo === "DEFESA_FINAL") {
                setDataPrevisaoDefesaFinal(d);
                tipoOrientacao === "Mestrado" ? mesesAdicionais = 24 : mesesAdicionais = 48;
                data.setMonth(data.getMonth() + mesesAdicionais);
                data.setDate(dia);
                const novoAno = data.getFullYear();
                const novoMesPrevisao = String(data.getMonth() + 1).padStart(2, "0");
                const dataFormadaPrevisao = `${novoAno}-${novoMesPrevisao}-${diaStr}`;
                setDataPrevisaoDefesaFinal(dataFormadaPrevisao);
            }
        }
    }

    async function buscarOrientacoesPorDocente(idDocente: string, idPrograma: string) {
        const o = await getOrientacoesPorDocente(idDocente, idPrograma);
        setOrientacoes(o)
    }

    async function salvarOrientando(evento: any) {
        evento.preventDefault();
        if (dataEntrada == null || idOrientador == null || idOrientando == null || dataPrevisaoDefesa == null || dataPrevisaoQualificacao == null || dataPrevisaoDefesaFinal == null) {
            alert("Preencha todos os campos!\n\nDados OBRIGATÓRIOS:\n- Orientando\n- Data de Entrada\n- Data da previsão da defesa\n- Data de previsão da qualificação\n- Data de previsão da defesa final");
            return
        }

        const orientacao = {
            start_date: dataEntrada,
            planned_date_project: dataPrevisaoDefesa,
            done_date_project: dataRealizadaDefesa,
            graduate_program_id: docente.graduate_program_id,
            planned_date_qualification: dataPrevisaoQualificacao,
            done_date_qualification: dataRealizadaQualificacao,
            planned_date_conclusion: dataPrevisaoDefesaFinal,
            done_date_conclusion: dataRealizadaDefesaFinal,
            supervisor_researcher_id: idOrientador,
            student_researcher_id: idOrientando,
            co_supervisor_researcher_id: idCoorientador
        }

        const response = await adicionarOrientacao(orientacao)

        if (response.status == 201) {
            buscarOrientacoesPorDocente(idOrientador, docente.graduate_program_id);
            limparCampos();
            alert("Orientação adicionada com sucesso!");
        } else {
            alert("Não foi possível adicionar a orientação!");
        }
    }

    function limparCampos() {
        setIdOrientando(null)
        setIdOrientador(null)
        setIdCoorientador(null)
        setOpenDialogAdicionar(false)
        setDataEntrada(null)
        setDataPrevisaoDefesa(null)
        setDataRealizadaDefesa(null)
        setDataPrevisaoQualificacao(null)
        setDataRealizadaQualificacao(null)
        setDataPrevisaoDefesaFinal(null)
        setDataRealizadaDefesaFinal(null)
    }

    const infoPrograma = async () => {
        const token = localStorage.getItem('jwt_token');
        const resposta = await fetch(`${urlGeralAdm}GraduateProgramRest/Query?graduate_program_id=${docente.graduate_program_id}`, {
            mode: "cors",
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "3600",
                "Content-Type": "text/plain",
            },
        });

        const data = await resposta.json();
        setTipoOrientacao(data[0].type);
    }

    return <div className="flex">
        <Tabs defaultValue="entrada" className="w-full ">
            <div className="flex items-center justify-between mb-3">
                <TabsList className="py-3">
                    <TabsTrigger value="entrada">Entrada &nbsp; <span className="font-bold rounded-full w-6 h-6 flex justify-center items-center  bg-eng-blue text-white">{orientacoes?.filter((orientacao: any) => orientacao.type === "PROJETO").length > 0 ? orientacoes?.filter((orientacao: any) => orientacao.type === "PROJETO").length : "0"}</span></TabsTrigger> <Separator orientation="vertical" />
                    <TabsTrigger value="projetos_defendidos">Projetos Defendidos &nbsp; <span className="font-bold rounded-full w-6 h-6 flex justify-center items-center  bg-eng-blue text-white">{orientacoes?.filter((orientacao: any) => orientacao.type === "QUALIFICAÇÃO").length > 0 ? orientacoes?.filter((orientacao: any) => orientacao.type === "QUALIFICAÇÃO").length : "0"}</span></TabsTrigger> <Separator orientation="vertical" />
                    <TabsTrigger value="qualificados">Qualificados &nbsp; <span className="font-bold rounded-full w-6 h-6 flex justify-center items-center  bg-eng-blue text-white">{orientacoes?.filter((orientacao: any) => orientacao.type === "CONCLUSÃO").length > 0 ? orientacoes?.filter((orientacao: any) => orientacao.type === "CONCLUSÃO").length : "0"}</span></TabsTrigger> <Separator orientation="vertical" />
                    <TabsTrigger value="concluidos">Concluídos &nbsp; <span className="font-bold rounded-full w-6 h-6 flex justify-center items-center  bg-eng-blue text-white">{orientacoes?.filter((orientacao: any) => orientacao.type === "FINALIZADO").length > 0 ? orientacoes?.filter((orientacao: any) => orientacao.type === "FINALIZADO").length : "0"}</span></TabsTrigger>
                </TabsList>
                <Dialog open={openDialogAdicionar} onOpenChange={setOpenDialogAdicionar}>
                    <DialogTrigger asChild>
                        <Button
                            onClick={() => {
                                setIdOrientador(docente.researcher_id)
                            }}
                        >
                            Adicionar orientando
                        </Button>
                    </DialogTrigger>

                    <DialogContent
                        onCloseAutoFocus={() => {
                            limparCampos()
                        }}
                        className="w-[60%]"
                    >
                        <p className="text-3xl font-bold">Adicione um orientando para este docente</p>

                        <form className="flex flex-col gap-3 text-sm" action="">
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-3 w-full border border-gray-300 rounded-md p-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-lg font-bold" htmlFor="name">Orientando: </label>

                                        <select
                                            className="w-full border-[3px] ml-3 py-2 px-4 rounded-md"
                                            onClick={() => buscarDiscentes()}
                                            onChange={(event) => {
                                                setIdOrientando(event.target.value)
                                            }}
                                        >
                                            <option value="" disabled selected>Selecione um orientando</option>
                                            {discentesPosGraduacao &&
                                                discentesPosGraduacao
                                                    .slice()
                                                    .sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((discente) => (
                                                        discente.oriented === false && (
                                                            <option key={discente.researcher_id} value={discente.researcher_id}>
                                                                {discente.name}
                                                            </option>
                                                        )
                                                    ))
                                            }
                                        </select>
                                    </div>

                                    <div className="flex items-center justify-between gap-0">
                                        <label className="text-lg font-bold" htmlFor="name">Coorientador: </label>
                                        <select
                                            className="w-full border-[3px] ml-3 py-2 px-4 rounded-md"
                                            onChange={(event) => {
                                                setIdCoorientador(event.target.value)
                                            }}
                                        >
                                            <option disabled selected>Selecione um coorientador</option>
                                            {
                                                docentesPosGraduacao && docentesPosGraduacao
                                                    .slice()
                                                    .sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((d) => (
                                                        docente.researcher_id !== d.researcher_id ?
                                                            <option key={d.researcher_id} value={d.researcher_id}>{d.name}</option>
                                                            :
                                                            <option disabled key={d.researcher_id} value={d.researcher_id}>{d.name} - Docente selecionado</option>
                                                    ))
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-1 flex-grow border border-gray-300 rounded-md p-3">
                                <p className="text-lg font-bold min-w-fit">Selecione uma data de entrada: </p>
                                <label className="flex w-full items-center gap-2 hover:cursor-pointer" htmlFor="dataEntrada">
                                    <input
                                        className="hover:cursor-pointer w-full border-[3px] ml-5 py-1 px-4 rounded-md"
                                        type="date"
                                        name="dataEntrada"
                                        id="dataEntrada"
                                        onChange={(e) => {
                                            setDataEntrada(e.target.value);
                                        }}
                                    />
                                </label>
                            </div>

                            <div
                                className={`flex flex-col gap-3 border rounded-md h-[400px] p-3 ${tipoOrientacao === "Mestrado" && "h-fit"}`}
                                style={{ boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.25)' }}
                            >
                                {tipoOrientacao === "Doutorado" &&
                                    <div className="flex flex-col p-3 gap-3 border-dashed border-black border-[2px] rounded-md">
                                        <p className="text-lg font-bold">Defesa do Projeto</p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-2 items-center w-1/2">
                                                <label htmlFor="dataPrevista">Prevista: </label>
                                                <input
                                                    className="w-full border-[2px] border-bl px-2 py-1 rounded-md"
                                                    onClick={() => {
                                                        if (dataEntrada == null) {
                                                            alert("Selecione uma DATA DE ENTRADA. As datas de PREVISÃO e REALIZAÇÃO da defesa do projeto serão geradas automaticamente!");
                                                            return;
                                                        }
                                                    }}
                                                    onChange={(e) => setDataPrevisaoDefesa(e.target.value)}
                                                    type="date"
                                                    id="dataPrevista"
                                                    value={dataPrevisaoDefesa == null ? "" : dataPrevisaoDefesa}
                                                />
                                            </div>
                                            <div className="flex gap-2 items-center w-1/2">
                                                <label htmlFor="dataRealizada">Realizada: </label>
                                                <input
                                                    className="w-full border-[2px] px-2 py-1 rounded-md"
                                                    onClick={() => {
                                                        if (dataPrevisaoDefesa == null) {
                                                            alert("Para modificar a data de realização da defesa, primeiro selecione uma DATA DE ENTRADA!");
                                                            return;
                                                        }
                                                    }}
                                                    onChange={(e) => setDataRealizadaDefesa(e.target.value)}
                                                    type="date"
                                                    value={dataRealizadaDefesa == null ? "" : dataRealizadaDefesa}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className={`${tipoOrientacao === "Mestrado" && "-h-fit"} flex flex-col gap-3 p-3 border-dashed border-[2px] border-black rounded-md`}>
                                    <p className="text-lg font-bold">Qualificação </p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataPrevista">Prevista: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                onClick={() => {
                                                    if (dataPrevisaoQualificacao == null) {
                                                        alert("Selecione uma DATA DE ENTRADA. As datas de PREVISÃO e REALIZAÇÃO da qualificação do projeto serão geradas automaticamente!");
                                                        return;
                                                    }
                                                }}
                                                onChange={(e) => setDataPrevisaoQualificacao(e.target.value)}
                                                type="date"
                                                id="dataPrevista"
                                                value={dataPrevisaoQualificacao == null ? "" : dataPrevisaoQualificacao}
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataRealizada">Realizada: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                type="date"
                                                onClick={() => {
                                                    if (dataEntrada == null) {
                                                        alert("Para modificar a data de realização da qualificação, primeiro selecione uma DATA DE ENTRADA!");
                                                        return;
                                                    } else {
                                                        if (dataRealizadaDefesa == null) {
                                                            alert("A orientação deve ter defesa concluída para definir a data de qualificação!");
                                                        }
                                                    }
                                                }}
                                                onChange={(e) => setDataRealizadaQualificacao(e.target.value)}
                                                value={dataRealizadaQualificacao == null ? "" : dataRealizadaQualificacao}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className={`${tipoOrientacao === "Mestrado" && "h-fit"} flex flex-col gap-3 p-3 border-dashed border-[2px] border-black rounded-md`}>
                                    <p className="text-lg font-bold">Defesa final</p>
                                    <div className="flex items-center gap-3">
                                        <div className={`flex gap-2 items-center w-1/2`}>
                                            <label htmlFor="dataPrevista">Prevista: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                onClick={() => {
                                                    if (dataPrevisaoDefesaFinal == null) {
                                                        alert("Selecione uma DATA DE ENTRADA. As datas de PREVISÃO e REALIZAÇÃO da defesa final do projeto serão geradas automaticamente!");
                                                        return;
                                                    }
                                                    if (dataPrevisaoQualificacao == null) {
                                                        alert("Não é possível adicionar data de realização de defesa final sem qualificação realizada!")
                                                    }
                                                }}
                                                onChange={(e) => setDataPrevisaoDefesaFinal(e.target.value)}
                                                type="date"
                                                id="dataPrevista"
                                                value={dataPrevisaoDefesaFinal == null ? "" : dataPrevisaoDefesaFinal}
                                            />
                                        </div>
                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataRealizada">Realizada: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                type="date"
                                                onClick={() => {
                                                    if (dataEntrada == null) {
                                                        alert("Para modificar a data de realização da defesa final, primeiro selecione uma DATA DE ENTRADA!");
                                                        return;
                                                    } else {
                                                        if (dataRealizadaQualificacao == null) {
                                                            alert("A orientação deve ter defesa e qualificação concluídas para definir a data de defesa final!");
                                                        }
                                                    }
                                                }}
                                                onChange={(e) => setDataRealizadaDefesaFinal(e.target.value)}
                                                value={dataRealizadaDefesaFinal == null ? "" : dataRealizadaDefesaFinal}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <button
                                    className="bg-[#559FB8] text-white px-4 py-2 rounded-md transition-all duration-75 active:scale-95"
                                    onClick={(e) => {
                                        salvarOrientando(e);
                                    }}
                                >Salvar orientação</button>
                            </div>
                        </form>
                        <DialogClose
                            className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-md"
                            title="Fechar"
                            onClick={() => {
                                limparCampos();
                            }}
                        >
                            <X className="w-4 h-4" />
                        </DialogClose>
                    </DialogContent>
                </Dialog>
            </div>

            <TabsContent className="grid lg:grid-cols-3 grid-cols-2 gap-3 mt-0" value="entrada">
                {orientacoes?.filter((o: any) => o.type === "PROJETO").length > 0 ? (
                    orientacoes
                        .filter((o: any) => o.type === "PROJETO")
                        .map((o: any) => (
                            <CartaoOrientando key={o.id} tipoPrograma={tipoOrientacao} orientacaoC={o} pesquisador={docente} buscarOrientacoes={buscarOrientacoesPorDocente} />
                        ))
                ) : (
                    <p className="p-3 animate-pulse">
                        Sem orientações novas para este docente.
                    </p>
                )}
            </TabsContent>

            <TabsContent className="grid lg:grid-cols-3 grid-cols-2 gap-3 mt-0" value="projetos_defendidos">
                {orientacoes?.filter((o: any) => o.type === "QUALIFICAÇÃO").length > 0 ? (
                    orientacoes
                        .filter((o: any) => o.type === "QUALIFICAÇÃO")
                        .map((o: any) => (
                            <CartaoOrientando key={o.id} tipoPrograma={tipoOrientacao} orientacaoC={o} pesquisador={docente} buscarOrientacoes={buscarOrientacoesPorDocente} />
                        ))
                ) : (
                    <p className="p-3 animate-pulse">
                        Sem orientações a defender para este docente.
                    </p>
                )}
            </TabsContent>

            <TabsContent className="grid lg:grid-cols-3 grid-cols-2 gap-3 mt-0" value="qualificados">
                {orientacoes?.filter((o: any) => o.type === "CONCLUSÃO").length > 0 ? (
                    orientacoes
                        .filter((o: any) => o.type === "CONCLUSÃO")
                        .map((o: any) => (
                            <CartaoOrientando key={o.id} tipoPrograma={tipoOrientacao} orientacaoC={o} pesquisador={docente} buscarOrientacoes={buscarOrientacoesPorDocente} />
                        ))
                ) : (
                    <p className="p-3 animate-pulse">
                        Sem orientações a qualificar para este docente.
                    </p>
                )}
            </TabsContent>

            <TabsContent className="grid lg:grid-cols-3 grid-cols-2 gap-3 mt-0" value="concluidos">
                {orientacoes?.filter((o: any) => o.type === "FINALIZADO").length > 0 ? (
                    orientacoes
                        .filter((o: any) => o.type === "FINALIZADO")
                        .map((o: any) => (
                            <CartaoOrientando key={o.id} tipoPrograma={tipoOrientacao} orientacaoC={o} pesquisador={docente} buscarOrientacoes={buscarOrientacoesPorDocente} />
                        ))
                ) : (
                    <p className="p-3 animate-pulse">
                        Sem orientações concluídas para este docente.
                    </p>
                )}
            </TabsContent>
        </Tabs>
    </div>;
}

export function DocentesGraduate(props: Props) {
    const { urlGeralAdm, user, urlGeral } = useContext(UserContext);
    const { onOpen, isOpen, type: typeModal } = useModal();
    const [researcher, setResearcher] = useState<PesquisadorProps[]>([]);
    const [researcherSearch, setResearcherSearch] = useState<PesquisadorProps2[]>([]);
    const [input2, setInput2] = useState('');

    const urlGetResearcherSearch = urlGeralAdm + `ResearcherRest/Query?institution_id=&name=&count= `;
    const urlGetResearcher = `${urlGeralAdm}GraduateProgramResearcherRest/Query?graduate_program_id=${props.graduate_program_id}`;
    const currentYear = new Date().getFullYear();

    const permanenteCount = researcher.filter(r =>
        r.participation.some(p => p.type_ === 'PERMANENTE' && p.year === currentYear)
    ).length;

    const colaboradorCount = researcher.filter(r =>
        r.participation.some(p => p.type_ === 'COLABORADOR' && p.year === currentYear)
    ).length;

    const fetchDataAll = async () => {
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
            const researchersWithGraduateProgramId = data.map((researcher: PesquisadorProps) => ({
                ...researcher,
                graduate_program_id: props.graduate_program_id,
            }));
            setResearcher(researchersWithGraduateProgramId);
        }
    }

    useEffect(() => {
        fetchDataAll();
    }, [isOpen, typeModal]);

    useEffect(() => {
        const fetchData = async () => {
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
        };
        fetchData();
    }, [urlGetResearcherSearch, props.graduate_program_id]);

    const filteredTotal: any = Array.isArray(researcher) ? researcher.filter(item => {
        const normalizeString = (str: any) => str
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
        const searchString = normalizeString(item.name);
        const normalizedSearch = normalizeString(input2);
        return searchString.includes(normalizedSearch);
    }) : [];

    return <div>
        <div>
            <CardContent className="flex flex-col justify-between p-8 pt-0 ">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ">
                    <Alert className="p-0 mb-4 md:mb-8">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Docentes permenentes em {currentYear}
                            </CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>

                        <CardContent>
                            <div className="text-2xl font-bold">{permanenteCount}</div>
                            <p className="text-xs text-muted-foreground">
                                registrados
                            </p>
                        </CardContent>
                    </Alert>

                    <Alert className="p-0 mb-4 md:mb-8">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Docentes colaboradores em {currentYear}
                            </CardTitle>
                            <User className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{colaboradorCount}</div>
                            <p className="text-xs text-muted-foreground">
                                registrados
                            </p>
                        </CardContent>
                    </Alert>
                </div>
                <Alert className="p-0">
                    <CardHeader className="flex flex-row items-start bg-neutral-100 rounded-t-md dark:bg-neutral-800">
                        <div className="flex items-center justify-between w-full">
                            <CardTitle className="group flex items-center w-fit gap-2 text-lg">
                                <div className="w-fit">Docentes</div>
                            </CardTitle>
                        </div>
                    </CardHeader>

                    <CardContent className="mt-6">
                        <AdicionarPesquisadorForm
                            graduate_program_id={props.graduate_program_id}
                            availableResearchers={researcherSearch}
                            onSuccess={fetchDataAll}
                            urlGeralAdm={urlGeralAdm} />
                    </CardContent>
                </Alert>
            </CardContent>

            <div className="px-8 pb-8">
                <Accordion type="single" collapsible className="flex flex-col gap-4">
                    <div className="border bg-white dark:bg-neutral-950  rounded-md px-6 h-12 flex items-center gap-1 border-neutral-200 dark:border-neutral-800">
                        <MagnifyingGlass size={16} />
                        <Input className="border-0" value={input2} onChange={(e) => setInput2(e.target.value)} placeholder="Buscar pesquisador" />
                    </div>

                    {filteredTotal.map((props: PesquisadorProps, index: number) => (
                        <Alert key={index}>
                            <AccordionItem value={String(index)}>
                                <div className="flex justify-between items-center h-10 group">
                                    <div className="h-10">
                                        <div className="flex items-center gap-2">
                                            <Avatar className="cursor-pointer rounded-md h-8 w-8">
                                                <AvatarImage className="rounded-md h-8 w-8" src={`${urlGeral}ResearcherData/Image?name=${props.name}`} />
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
                                            <Button size={'icon'} onClick={() => onOpen('researcher-modal', { name: props.name })} variant={'ghost'} className="h-10 w-10 ">
                                                <Maximize2 size={16} />
                                            </Button>
                                            <Button size={'icon'} onClick={() => onOpen('confirm-delete-researcher-graduate-program', { lattes_id: props.lattes_id, graduate_program_id: props.graduate_program_id, nome: props.name })} variant={'destructive'} className=" text-white h-10 w-10 dark:text-white">
                                                <Trash size={16} />
                                            </Button>
                                        </div>
                                        <AccordionTrigger />
                                    </div>
                                </div>

                                <AccordionContent className="p-0">
                                    <div className="flex flex-col w-full gap-4 mt-4">
                                        <div className="flex gap-3">
                                            <ConfiguracaoParticipacaoStep
                                                pesquisador={{ ...props, institution_id: '' }}
                                                onCancel={fetchDataAll}
                                                onSuccess={fetchDataAll}
                                                graduate_program_id={props.graduate_program_id}
                                                urlGeralAdm={urlGeralAdm}
                                                isNew={false}
                                            />
                                        </div>
                                        <hr />
                                        <GerenciadorOrientacoes docente={props} />
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Alert>
                    ))}
                </Accordion>
            </div>
        </div >
    </div >
}