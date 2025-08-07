import { getDiscentesPorPrograma, getInfoPesquisadorPorId } from "../../../service/discentes";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../../ui/dialog";
import { X } from "lucide-react";
import { atualizarOrientacao, excluirOrientacao, getDocentesPorPrograma, getOrientacoesPorDocente } from "../../../service/docentes";

interface OrientacaoProps {
    co_supervisor_researcher_id: string,
    created_at: string,
    deleted_at: string,
    done_date_conclusion: string,
    done_date_project: string,
    done_date_qualification: string,
    graduate_program_id: string,
    id: string,
    peding: string,
    peding_days: string,
    planned_date_conclusion: string,
    planned_date_project: string,
    planned_date_qualification: string,
    start_date: string,
    student_researcher_id: string,
    supervisor_researcher_id: string,
    type: string,
    updated_at: string,
}

interface InfoOrientacaoProps {
    orientacaoC: OrientacaoProps
    pesquisador: any
    buscarOrientacoes: (idDocente: string, idPrograma: string) => void
}


export default function CartaoOrientando(o: InfoOrientacaoProps) {
    const [nomeDiscente, setNomeDiscente] = useState<string>("");

    const tipo = () => {
        if (o.orientacaoC.type === 'PROJETO') {
            return 'Previsão de defesa do projeto:'
        }

        if (o.orientacaoC.type === 'QUALIFICAÇÃO') {
            return 'Previsão de qualificação:'
        }

        if (o.orientacaoC.type === 'CONCLUSÃO') {
            return 'Previsão de defesa final:'
        }

        if (o.orientacaoC.type === 'FINALIZADO') {
            return 'Concluído em: '
        }
    }

    const corSpanPrevisao = () => {
        if (o.orientacaoC.peding === "EM DIA") {
            return 'green-500'
        } else if (o.orientacaoC.peding === "EM ATRASO") {
            return 'red-500'
        } else {
            return 'yellow-500'
        }
    }

    function formatarData(dataStr: string): string {
        const data = new Date(dataStr);

        const dia = String(data.getUTCDate()).padStart(2, '0');
        const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() começa do 0
        const ano = data.getUTCFullYear();

        return `${dia}/${mes}/${ano}`;
    }


    const calcularData = () => {
        if (o.orientacaoC.type === "PROJETO") {
            return formatarData(o.orientacaoC.planned_date_project)
        }

        if (o.orientacaoC.type === "QUALIFICAÇÃO") {
            return formatarData(o.orientacaoC.planned_date_qualification)
        }

        if (o.orientacaoC.type === "CONCLUSÃO") {
            return formatarData(o.orientacaoC.planned_date_conclusion)
        }

        if (o.orientacaoC.type === "FINALIZADO") {
            return formatarData(o.orientacaoC.done_date_conclusion)
        }
    }

    async function getNomePorId(id: string) {
        const nome = await getInfoPesquisadorPorId(id)

        if (nome) {
            setNomeDiscente(nome)
        }
    }

    useEffect(() => {
        getNomePorId(o.orientacaoC.student_researcher_id)
    }, [o.orientacaoC.student_researcher_id])

    const [idOrientador, setIdOrientador] = useState<string | null>(null)
    const [idOrientando, setIdOrientando] = useState<string | null>(null)
    const [idCoorientador, setIdCoorientador] = useState<string | null>(null)

    const [tipoOrientacao, setTipoOrientacao] = useState<string | null>(null)
    const [dataEntrada, setDataEntrada] = useState<string | null>(null)
    const [dataPrevisaoDefesa, setDataPrevisaoDefesa] = useState<string | null>(null)
    const [dataRealizadaDefesa, setDataRealizadaDefesa] = useState<string | null>(null)

    const [dataPrevisaoQualificacao, setDataPrevisaoQualificacao] = useState<string | null>(null)
    const [dataRealizadaQualificacao, setDataRealizadaQualificacao] = useState<string | null>(null)

    const [dataPrevisaoDefesaFinal, setDataPrevisaoDefesaFinal] = useState<string | null>(null)
    const [dataRealizadaDefesaFinal, setDataRealizadaDefesaFinal] = useState<string | null>(null)
    const [docentesPosGraduacao, setDocentesPosGraduacao] = useState<any[]>([])

    useEffect(() => {
        if (dataEntrada !== null) {
            gerarDatas(dataEntrada, "DEFESA_DO_PROJETO");
            gerarDatas(dataEntrada, "QUALIFICACAO");
            gerarDatas(dataEntrada, "DEFESA_FINAL");
        }
    }, [dataEntrada])

    useEffect(() => {
        const docentes = getDocentesPorPrograma(o.pesquisador.graduate_program_id);

        docentes.then((response) => {
            setDocentesPosGraduacao(response)
        })
    }, [])

    function gerarDatas(d: string, tipo?: string): void {

        const [anoStr, mesStr, diaStr] = d.split("-");
        const ano = parseInt(anoStr);
        const mes = parseInt(mesStr) - 1;
        const dia = parseInt(diaStr);

        const data = new Date(ano, mes, dia);
        let mesesAdicionais: number;

        if (tipo) {
            if (tipo === "DEFESA_DO_PROJETO") {
                tipoOrientacao === "MESTRADO" ? mesesAdicionais = 3 : mesesAdicionais = 5;

                data.setMonth(data.getMonth() + mesesAdicionais);
                data.setDate(dia);

                const novoAno = data.getFullYear();
                const novoMesPrevisao = String(data.getMonth() + 1).padStart(2, "0");

                const dataFormadaPrevisao = `${novoAno}-${novoMesPrevisao}-${diaStr}`;

                setDataPrevisaoDefesa(dataFormadaPrevisao);
            }

            if (tipo === "QUALIFICACAO") {
                tipoOrientacao === "MESTRADO" ? mesesAdicionais = 12 : mesesAdicionais = 24;

                data.setMonth(data.getMonth() + mesesAdicionais);
                data.setDate(dia);

                const novoAno = data.getFullYear();
                const novoMesPrevisao = String(data.getMonth() + 1).padStart(2, "0");

                const dataFormadaPrevisao = `${novoAno}-${novoMesPrevisao}-${diaStr}`;

                setDataPrevisaoQualificacao(dataFormadaPrevisao);
            }

            if (tipo === "DEFESA_FINAL") {
                setDataPrevisaoDefesaFinal(d);
                tipoOrientacao === "MESTRADO" ? mesesAdicionais = 24 : mesesAdicionais = 48;

                data.setMonth(data.getMonth() + mesesAdicionais);
                data.setDate(dia);

                const novoAno = data.getFullYear();
                const novoMesPrevisao = String(data.getMonth() + 1).padStart(2, "0");

                const dataFormadaPrevisao = `${novoAno}-${novoMesPrevisao}-${diaStr}`;

                setDataPrevisaoDefesaFinal(dataFormadaPrevisao);
            }
        }
    }

    async function salvarOrientando(evento: any) {
        evento.preventDefault();

        const orientacao = {
            id: o.orientacaoC.id,
            start_date: dataEntrada ? dataEntrada : o.orientacaoC.start_date,
            planned_date_project: dataPrevisaoDefesa ? dataPrevisaoDefesa : o.orientacaoC.planned_date_project,
            done_date_project: dataRealizadaDefesa ? dataRealizadaDefesa : o.orientacaoC.done_date_project,
            graduate_program_id: o.orientacaoC.graduate_program_id,
            planned_date_qualification: dataPrevisaoQualificacao ? dataPrevisaoQualificacao : o.orientacaoC.planned_date_qualification,
            done_date_qualification: dataRealizadaQualificacao ? dataRealizadaQualificacao : o.orientacaoC.done_date_qualification,
            planned_date_conclusion: dataPrevisaoDefesaFinal ? dataPrevisaoDefesaFinal : o.orientacaoC.planned_date_conclusion,
            done_date_conclusion: dataRealizadaDefesaFinal ? dataRealizadaDefesaFinal : o.orientacaoC.done_date_conclusion,
            supervisor_researcher_id: o.orientacaoC.supervisor_researcher_id,
            student_researcher_id: o.orientacaoC.student_researcher_id,
            co_supervisor_researcher_id: idCoorientador ? idCoorientador : o.orientacaoC.co_supervisor_researcher_id
        }

        console.log(orientacao)

        const resposta = await atualizarOrientacao(orientacao)

        if (resposta == 200) {
            limparCampos();
            o.buscarOrientacoes(o.pesquisador.researcher_id, o.orientacaoC.graduate_program_id);
            alert("Orientação salva com sucesso!");
        } else {
            alert("Falha ao atualizar orientação!");
        }
    }

    async function handleExcluirOrientacao(id: string) {
        const resposta = await excluirOrientacao(id)

        if (resposta == 200) {
            limparCampos();
            o.buscarOrientacoes(o.pesquisador.researcher_id, o.orientacaoC.graduate_program_id);
            alert("Orientação excluida com sucesso!");
        }
    }

    function limparCampos() {
        setIdOrientando(null)
        setIdOrientador(null)
        setIdCoorientador(null)
        setTipoOrientacao(null)
        setDataEntrada(null)
        setDataPrevisaoDefesa(null)
        setDataRealizadaDefesa(null)
        setDataPrevisaoQualificacao(null)
        setDataRealizadaQualificacao(null)
        setDataPrevisaoDefesaFinal(null)
        setDataRealizadaDefesaFinal(null)
    }

    function data() {
        if (o.orientacaoC.peding === "EM DIA" && o.orientacaoC.type === "FINALIZADO") {
            return "Concluído há: "
        }

        if (o.orientacaoC.peding === "EM ATRASO") {
            return "Atrasado em: "
        }

        if (o.orientacaoC.peding === "EM DIA") {
            return "Dias restantes: "
        }

    }

    return (
        <div className="flex flex-col items-center gap-5 border rounded-md shadow-md p-5 h-fit">
            <div className="flex w-full gap-6">
                <div
                    className={`flex items-center w-[120px] full rounded-md bg-contain bg-no-repeat bg-center`}
                    style={{
                        backgroundImage: nomeDiscente ? `url(https://iapos-api.senaicimatec.com.br/ResearcherData/Image?name=${encodeURIComponent(nomeDiscente)})` : "",
                        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                    }}
                >
                </div>

                <div className="flex flex-col justify-center gap-2 h-[150px]">
                    <p className="font-bold text-[14px]">{nomeDiscente}</p>
                    <p className="text-sm">{tipo()} <span className="font-bold">{calcularData()}</span></p>
                    {
                        o.orientacaoC.peding && (
                            <p>Status: <span className={`bg-${corSpanPrevisao()} text-white px-2 py-1 rounded-md shadow-sm`}>{o.orientacaoC.peding}</span></p>
                        )
                    }
                    <p>{data()}<span className="font-bold">{Math.abs(parseInt(o.orientacaoC.peding_days))} dias</span></p>
                </div>
            </div>

            <div className="flex gap-3 w-full">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button
                            className="w-1/2"
                            onClick={() => {
                            }}
                        >
                            Editar orientação
                        </Button>
                    </DialogTrigger>

                    <DialogContent
                        onCloseAutoFocus={() => {
                            limparCampos()
                        }}
                        className="w-[60%]"
                    >
                        <p className="text-3xl font-bold">Editar Orientação <br /><span className="text-[20px]">{nomeDiscente}</span></p>

                        <form className="flex flex-col gap-3 text-sm" action="">
                            <div className="flex gap-3">
                                <div className="flex flex-col gap-3 w-full border border-gray-300 rounded-md p-3">
                                    <div className="flex items-center">
                                        <p className="text-lg font-bold">Orientando: &nbsp;</p>
                                        <p>{nomeDiscente}</p>
                                    </div>

                                    <div className="flex items-center justify-between gap-0">
                                        <label className="text-lg font-bold" htmlFor="name">Coorientador: </label>
                                        <select
                                            defaultValue={o.orientacaoC.co_supervisor_researcher_id}
                                            className="w-full border-[3px] ml-3 py-2 px-4 rounded-md"
                                            onChange={(event) => {
                                                setIdCoorientador(event.target.value)
                                            }}
                                        >
                                            <option disabled selected>Selecione um coorientador</option>
                                            {
                                                docentesPosGraduacao && docentesPosGraduacao.map((docente) => (
                                                    o.pesquisador.researcher_id !== docente.researcher_id ?
                                                        <option key={docente.researcher_id} value={docente.researcher_id}>{docente.name}</option>
                                                        :
                                                        <p>
                                                            <option disabled key={docente.researcher_id} value={docente.researcher_id}>{docente.name} - Docente selecionado</option>

                                                        </p>
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
                                        defaultValue={new Date(o.orientacaoC.start_date).toISOString().split("T")[0]}
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
                                className="flex flex-col gap-3 border rounded-md h-[400px] p-3"
                                style={{ boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.25)' }}
                            >
                                <div className="flex flex-col p-3 gap-3 border-dashed border-black border-[2px] rounded-md">
                                    <p className="text-lg font-bold">Defesa do Projeto</p>
                                    <div className="flex items-center gap-3">

                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataPrevista">Prevista: </label>
                                            <input
                                                className="w-full border-[2px] border-bl px-2 py-1 rounded-md"
                                                onChange={(e) => {
                                                    gerarDatas(e.target.value, "DEFESA_DO_PROJETO");
                                                }}
                                                type="date"
                                                id="dataPrevista"
                                                value={
                                                    dataPrevisaoDefesa != null
                                                        ? dataPrevisaoDefesa
                                                        : o.orientacaoC.planned_date_project
                                                            ? new Date(o.orientacaoC.planned_date_project).toISOString().split("T")[0]
                                                            : ""
                                                }
                                            />
                                        </div>

                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataRealizada">Realizada: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                onChange={(e) => {
                                                    setDataRealizadaDefesa(e.target.value);
                                                }}
                                                type="date"
                                                value={
                                                    dataRealizadaDefesa != null
                                                        ? dataRealizadaDefesa
                                                        : o.orientacaoC.done_date_project
                                                            ? new Date(o.orientacaoC.done_date_project).toISOString().split("T")[0]
                                                            : ""

                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 p-3 border-dashed border-[2px] border-black rounded-md">
                                    <p className="text-lg font-bold">Qualificação </p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataPrevista">Prevista: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                onChange={(e) => {
                                                    gerarDatas(e.target.value, "QUALIFICACAO");
                                                }}
                                                type="date"
                                                id="dataPrevista"
                                                value={
                                                    dataPrevisaoQualificacao != null
                                                        ? dataPrevisaoQualificacao
                                                        : o.orientacaoC.planned_date_qualification
                                                            ? new Date(o.orientacaoC.planned_date_qualification).toISOString().split("T")[0]
                                                            : ""
                                                }
                                            />
                                        </div>

                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataRealizada">Realizada: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                type="date"
                                                onChange={(e) => {
                                                    setDataRealizadaQualificacao(e.target.value);
                                                }}
                                                value={
                                                    dataRealizadaQualificacao != null
                                                        ? dataRealizadaQualificacao
                                                        : o.orientacaoC.done_date_qualification
                                                            ? new Date(o.orientacaoC.done_date_qualification).toISOString().split("T")[0]
                                                            : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-3 p-3 border-dashed border-[2px] border-black rounded-md">
                                    <p className="text-lg font-bold">Defesa final</p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataPrevista">Prevista: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                onChange={(e) => {
                                                    gerarDatas(e.target.value, "DEFESA_FINAL");
                                                }}
                                                type="date"
                                                id="dataPrevista"
                                                value={
                                                    dataPrevisaoDefesaFinal != null
                                                        ? dataPrevisaoDefesaFinal
                                                        : o.orientacaoC.planned_date_conclusion
                                                            ? new Date(o.orientacaoC.planned_date_conclusion).toISOString().split("T")[0]
                                                            : ""
                                                }
                                            />
                                        </div>

                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataRealizada">Realizada: </label>
                                            <input
                                                defaultValue={""}
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                type="date"
                                                onChange={(e) => {
                                                    setDataRealizadaDefesaFinal(e.target.value);
                                                }}
                                                value={
                                                    dataRealizadaDefesaFinal != null
                                                        ? dataRealizadaDefesaFinal
                                                        : o.orientacaoC.done_date_conclusion
                                                            ? new Date(o.orientacaoC.done_date_conclusion).toISOString().split("T")[0]
                                                            : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="bg-[#559FB8] text-white px-4 py-2 rounded-md transition-all duration-75 active:scale-95"
                                    onClick={(e) => {
                                        salvarOrientando(e);
                                    }}
                                >Salvar</button>
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

                <Button
                    className="w-1/2 bg-red-500 hover:bg-red-600"
                    onClick={() => {
                        handleExcluirOrientacao(o.orientacaoC.id);
                    }}
                >
                    Excluir
                </Button>
            </div>

        </div>
    )
}