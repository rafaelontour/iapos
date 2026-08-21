import { getDiscentesPorPrograma, getInfoPesquisadorPorId } from "../../../service/discentes";
import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Info, X } from "lucide-react";
import { atualizarOrientacao, excluirOrientacao, getDocentesPorPrograma, getOrientacoesPorDocente } from "../../../service/docentes";
import { Configuracao } from "../dados-pos-graduacao/dados-pos-graduacao";
import { getConfiguracoes } from "../../../service/configuracaoDataPosGraduacao";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../ui/tooltip";
import { Tag } from "../dados-pos-graduacao/Tags";
import { getTagsService } from "../../../service/tags";
import { toast } from "sonner";
import { dataFormatada } from "../../../lib";

interface OrientacaoProps {
    co_supervisor_ids: string[],
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
    student_name?: string,
    supervisor_researcher_id: string,
    type: string,
    updated_at: string,
    tags: Tag[],
    titulo_projeto?: string,
    linha_pesquisa?: string,
}

interface InfoOrientacaoProps {
    orientacaoC: OrientacaoProps
    pesquisador: any
    buscarOrientacoes: (idDocente: string, idPrograma: string) => void
    tipoPrograma: any
    mostrarResumoDiscente?: boolean
    nomeOrientador?: string
}


export default function CartaoOrientando(o: InfoOrientacaoProps) {
    console.log("Dados do Orientando:", o.orientacaoC);

    const [nomeDiscente, setNomeDiscente] = useState<string>(o.orientacaoC.student_name || "");

    const [configDatas, setConfigDatas] = useState<Configuracao[]>([])

    const possuiEtapaProjeto = () => {
        const dataProjeto = o.orientacaoC.planned_date_project?.slice(0, 10);
        const dataEntrada = o.orientacaoC.start_date?.slice(0, 10);

        return Boolean(dataProjeto && dataEntrada && dataProjeto !== dataEntrada);
    }

    const tipo = () => {
        const typeValue = o.orientacaoC.type; // Facilita a leitura e evita repetição

        if (typeValue === 'PROJETO' && !possuiEtapaProjeto()) {
            return 'Previsão de qualificação:'
        }

        if (typeValue === 'PROJETO') return 'Previsão de defesa do projeto:'
        if (typeValue === 'QUALIFICAÇÃO' || typeValue === 'QUALIFICACAO') return 'Previsão de qualificação:'
        if (typeValue === 'CONCLUSÃO' || typeValue === 'CONCLUSAO') return 'Previsão de defesa final:'
        if (typeValue === 'FINALIZADO') return 'Concluído em: '
        return 'Previsão de qualificação:' // Fallback para novos discentes
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

    const etapaAcademica = () => {
        if (o.orientacaoC.done_date_conclusion) return "Concluído";
        if (o.orientacaoC.done_date_qualification) return "Qualificado";
        if (o.orientacaoC.done_date_project) return "Defesa de projeto";
        return "Entrada";
    }

    function formatarData(dataStr: string): string {
        const data = new Date(dataStr);

        const dia = String(data.getUTCDate()).padStart(2, '0');
        const mes = String(data.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() começa do 0
        const ano = data.getUTCFullYear();

        return `${dia}/${mes}/${ano}`;
    }

    const calcularData = () => {
        const tipo = o.orientacaoC.type; // Garante que está lendo a propriedade correta do objeto

        if (tipo === "PROJETO" && possuiEtapaProjeto()) {
            return formatarData(o.orientacaoC.planned_date_project);
        }
        if (tipo === "QUALIFICAÇÃO" || tipo === "QUALIFICACAO") {
            return formatarData(o.orientacaoC.planned_date_qualification);
        }
        if (tipo === "CONCLUSÃO" || tipo === "CONCLUSAO") {
            return formatarData(o.orientacaoC.planned_date_conclusion);
        }
        if (tipo === "FINALIZADO") {
            return formatarData(o.orientacaoC.done_date_conclusion);
        }
        
        // Se cair aqui (ex: tipo_ "DISCENTE" ou nulo), exibe por padrão a data da qualificação
        return formatarData(o.orientacaoC.planned_date_qualification);
    }
    /*
    async function getNomePorId(id: string) {
        // Se não tiver ID válido, não faz a requisição
        if (!id || id === "undefined" || id === "null") return;

        const nome = await getInfoPesquisadorPorId(id)
        console.log("2. Nome retornado da API para o ID", id, "foi:", nome);

        if (nome) {
            setNomeDiscente(nome)
        }
    }*/

    console.log("ID do Discente recebido no Card:", o.orientacaoC.student_researcher_id);

    /*
    useEffect(() => {
        console.log("1. ID recebido para buscar nome:", o.orientacaoC?.student_researcher_id);
        if (o.orientacaoC?.student_researcher_id) {
            getNomePorId(o.orientacaoC.student_researcher_id);
        }
    }, [o.orientacaoC?.student_researcher_id]);
    */

    useEffect(() => {
        let ativo = true;

        async function carregarNomeDiscente() {
            if (o.orientacaoC.student_name) {
                if (ativo) setNomeDiscente(o.orientacaoC.student_name);
                return;
            }

            const nome = await getInfoPesquisadorPorId(o.orientacaoC.student_researcher_id);
            if (ativo) setNomeDiscente(nome || "");
        }

        void carregarNomeDiscente();
        return () => {
            ativo = false;
        };
    }, [o.orientacaoC.student_name, o.orientacaoC.student_researcher_id]);

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const [idOrientador, setIdOrientador] = useState<string | null>(null)
    const [idOrientando, setIdOrientando] = useState<string | null>(null)
    const [idCoorientador, setIdCoorientador] = useState<string | null>(o.orientacaoC.co_supervisor_ids[0] ? o.orientacaoC.co_supervisor_ids[0] : null)

    const [tituloProjeto, setTituloProjeto] = useState<string>(o.orientacaoC.titulo_projeto || "")
    const [linhaPesquisa, setLinhaPesquisa] = useState<string>(o.orientacaoC.linha_pesquisa || "")

    const [tipoOrientacao, setTipoOrientacao] = useState<string | null>(null)
    const [dataEntrada, setDataEntrada] = useState<string | null>(null)
    const [dataPrevisaoDefesa, setDataPrevisaoDefesa] = useState<string | null>(null)
    const [dataRealizadaDefesa, setDataRealizadaDefesa] = useState<string | null>(null)

    const [dataPrevisaoQualificacao, setDataPrevisaoQualificacao] = useState<string | null>(null)
    const [dataRealizadaQualificacao, setDataRealizadaQualificacao] = useState<string | null>(null)

    const [dataPrevisaoDefesaFinal, setDataPrevisaoDefesaFinal] = useState<string | null>(null)
    const [dataRealizadaDefesaFinal, setDataRealizadaDefesaFinal] = useState<string | null>(null)
    const [docentesPosGraduacao, setDocentesPosGraduacao] = useState<any[]>([])

    const [openDialogExcluir, setOpenDialogExcluir] = useState<boolean>(false);

    const [configDataSelecionada, setConfigDataSelecionada] = useState<Configuracao | null>(null)

    const [tags, setTags] = useState<Tag[]>([])
    const [tagsSelecionadas, setTagsSelecionadas] = useState<Tag[]>([])

    useEffect(() => {
        if (dataEntrada !== null) {
            gerarDatas()
        }
    }, [configDatas])

    useEffect(() => {
        const docentes = getDocentesPorPrograma(o.pesquisador.graduate_program_id);
        buscarDatas();

        docentes.then((response) => {
            setDocentesPosGraduacao(response)
        })
    }, [])

    useEffect(() => {
        buscarTags();
    }, [openDialog])

    function buscarTags() {
        getTagsService().then((response) => {
            setTags(response);
            if (response && o.orientacaoC?.tags) {
                const tagsDaOrientacao = response.filter((tag: Tag) => 
                    o.orientacaoC.tags.some((tagOrientacao: Tag) => tagOrientacao.id === tag.id)
                );
                setTagsSelecionadas(tagsDaOrientacao);
            }
        });
    }

    function buscarDatas() {
        const datas = getConfiguracoes();

        datas.then((response) => {
            setConfigDatas(response)
        })

    }

    function gerarDatas(): void {
        const [anoStr, mesStr, diaStr] = (dataEntrada || "").split("-");
        const ano = parseInt(anoStr);
        const mes = parseInt(mesStr) - 1;
        const dia = parseInt(diaStr);

        const projMeses = configDataSelecionada?.duration_project_months || 0;
        const qualMeses = configDataSelecionada?.duration_qualification_months || 0;
        const concMeses = configDataSelecionada?.duration_conclusion_months || 0;

        // 1. Previsão do Projeto (Soma apenas meses do projeto a partir da entrada)
        const dProj = new Date(ano, mes + projMeses, dia);
        setDataPrevisaoDefesa(`${dProj.getFullYear()}-${String(dProj.getMonth() + 1).padStart(2, "0")}-${diaStr}`);

        // 2. Previsão da Qualificação (Soma projeto + qualificação a partir da entrada)
        // Se for Mestrado, projMeses será 0, então contará perfeitamente apenas os meses de qualificação!
        const dQual = new Date(ano, mes + projMeses + qualMeses, dia);
        setDataPrevisaoQualificacao(`${dQual.getFullYear()}-${String(dQual.getMonth() + 1).padStart(2, "0")}-${diaStr}`);

        // 3. Previsão da Defesa Final (Soma todas as etapas a partir da entrada)
        const dConc = new Date(ano, mes + projMeses + qualMeses + concMeses, dia);
        setDataPrevisaoDefesaFinal(`${dConc.getFullYear()}-${String(dConc.getMonth() + 1).padStart(2, "0")}-${diaStr}`);
    }

    async function salvarOrientando(evento: any) {
        evento.preventDefault();

        const orientacao = {
            id: o.orientacaoC.id,
            start_date: dataEntrada ? dataEntrada : o.orientacaoC.start_date,

            planned_date_project: dataPrevisaoDefesa ? dataPrevisaoDefesa : o.orientacaoC.planned_date_project,
            done_date_project: dataRealizadaDefesa === "1" ? null : dataRealizadaDefesa ? dataRealizadaDefesa : o.orientacaoC.done_date_project,

            graduate_program_id: o.orientacaoC.graduate_program_id,

            planned_date_qualification: dataPrevisaoQualificacao ? dataPrevisaoQualificacao : o.orientacaoC.planned_date_qualification,
            done_date_qualification: dataRealizadaQualificacao === "1" ? null : dataRealizadaQualificacao ? dataRealizadaQualificacao : o.orientacaoC.done_date_qualification,

            planned_date_conclusion: dataPrevisaoDefesaFinal ? dataPrevisaoDefesaFinal : o.orientacaoC.planned_date_conclusion,
            done_date_conclusion: dataRealizadaDefesaFinal === "1" ? null : dataRealizadaDefesaFinal ? dataRealizadaDefesaFinal : o.orientacaoC.done_date_conclusion,

            supervisor_researcher_id: o.orientacaoC.supervisor_researcher_id,
            student_researcher_id: o.orientacaoC.student_researcher_id,
            co_supervisor_ids: idCoorientador ? [idCoorientador] : [],
            titulo_projeto: tituloProjeto || null,
            linha_pesquisa: linhaPesquisa || null,

            tag_ids: tagsSelecionadas.map((tag: Tag) => tag.id)
        }

        const resposta = await atualizarOrientacao(orientacao)

        if (resposta === 200) {
            limparCampos();
            o.buscarOrientacoes(o.orientacaoC.supervisor_researcher_id, o.orientacaoC.graduate_program_id);
            toast.success("Orientação salva com sucesso!");
            setOpenDialog(!openDialog);
        } else {
            toast.error("Falha ao atualizar orientação!");
        }
    }

    async function handleExcluirOrientacao(id: string) {
        const resposta = await excluirOrientacao(id)

        if (resposta == 200) {
            limparCampos();
            o.buscarOrientacoes(o.orientacaoC.supervisor_researcher_id, o.orientacaoC.graduate_program_id);
            toast.success("Orientação excluida com sucesso!");
        }
    }

    function limparCampos() {
        setTagsSelecionadas([])
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
        setConfigDataSelecionada(null)
        setTituloProjeto(o.orientacaoC.titulo_projeto || "")
        setLinhaPesquisa(o.orientacaoC.linha_pesquisa || "")
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

   function formatarDataPtBR_semFuso(dataIso) {
        const data = new Date(dataIso);

        const dia = data.getUTCDate();
        const mes = new Intl.DateTimeFormat('pt-BR', {
            month: 'long',
            timeZone: 'UTC'
        }).format(data);
        const ano = data.getUTCFullYear();

        return `${dia} de ${mes} de ${ano}`;
    }

    return (
        <div className={`flex flex-col items-center ${o.orientacaoC.tags.length > 0 ? "gap-5" : "gap-9"} border rounded-md shadow-md p-5 h-fit relative overflow-hidden`}>
            <div className="flex flex-col w-full gap-6">
                <div className="flex items-center gap-1">

                    {
                        o.orientacaoC.tags.length > 0 && (
                            <span className="flex items-center gap-2 p-2 bg-slate-300 w-full absolute top-0 left-0">
                                <p className="font-semibold text-md ml-2">Tags: </p>
                                <div className="flex items-center gap-1">
                                    {
                                        o.orientacaoC.tags.map((tag: Tag, index) => (
                                            <div
                                                key={index}
                                                className={`
                                                px-2 py-1 rounded-md text-white text-xs h-fit-w-fit
                                            `}
                                                style={{
                                                    boxShadow: "-2px 2px 2px rgba(0, 0, 00, .3)",
                                                    backgroundColor: `${tag.color_code}`,
                                                }}>
                                                <p>{tag.name}</p>
                                            </div>
                                        ))

                                    }

                                </div>
                            </span>
                        )
                    }
                </div>

                <div className={`flex gap-5 ${o.orientacaoC.tags.length > 0 ? "mt-4" : "mt-0 gap-8"} `}>
                    <div
                        className={`flex items-center w-[120px] full rounded-md bg-contain bg-no-repeat bg-center`}
                        style={{
                            backgroundImage: o.orientacaoC?.student_researcher_id
                                ? `url(https://iapos-api.senaicimatec.com.br/ResearcherData/Image?researcher_id=${o.orientacaoC.student_researcher_id})` 
                                : "none",
                            boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                        }}
                    />
                    <div className="flex flex-col justify-center gap-2 min-h-[150px]">
                        <p className="font-bold text-[17px]">
                            {nomeDiscente || "Carregando..."}
                        </p>
                        {o.mostrarResumoDiscente && (
                            <>
                                <p className="text-sm">Orientador: <span className="font-semibold">{o.nomeOrientador || "Carregando..."}</span></p>
                                <p className="text-sm">Etapa: <span className="font-semibold">{etapaAcademica()}</span></p>
                                {o.pesquisador?.cpf && (
                                    <p className="text-sm">CPF: <span className="font-semibold">{o.pesquisador.cpf}</span></p>
                                )}
                                {o.pesquisador?.email_pessoal && (
                                    <p className="text-sm">E-mail pessoal: <span className="font-semibold">{o.pesquisador.email_pessoal}</span></p>
                                )}
                                {o.pesquisador?.email_google && (
                                    <p className="text-sm">E-mail Google: <span className="font-semibold">{o.pesquisador.email_google}</span></p>
                                )}
                            </>
                        )}
                        <p className="text-sm">{tipo()} <span className="font-bold">{calcularData()}</span></p>
                        {o.orientacaoC.titulo_projeto && (
                            <p className="text-sm">Título: <span className="font-semibold">{o.orientacaoC.titulo_projeto}</span></p>
                        )}
                        {o.orientacaoC.linha_pesquisa && (
                            <p className="text-sm">Linha de pesquisa: <span className="font-semibold">{o.orientacaoC.linha_pesquisa}</span></p>
                        )}
                        {
                            o.orientacaoC.peding && (
                                <p>Status: <span className={`bg-${corSpanPrevisao()} text-white px-2 py-1 rounded-md shadow-sm`}>{o.orientacaoC.peding}</span></p>
                            )
                        }
                        <p>{data()}<span className="font-bold">{Math.abs(parseInt(o.orientacaoC.peding_days))} {Math.abs(parseInt(o.orientacaoC.peding_days)) === 1 ? "dia" : "dias"}</span></p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full">
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-1/2"
                            onClick={() => {
                                setOpenDialog(!openDialog)
                                setIdCoorientador(o.orientacaoC.co_supervisor_ids[0] ? o.orientacaoC.co_supervisor_ids[0] : null)
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
                                            value={idCoorientador ? idCoorientador : ""}
                                            defaultValue={o.orientacaoC.co_supervisor_ids[0] ? o.orientacaoC.co_supervisor_ids[0] : idCoorientador ? idCoorientador : ""}
                                            className="w-full border-[3px] ml-3 py-2 px-4 rounded-md"
                                            onChange={(event) => {
                                                setIdCoorientador(event.target.value)
                                            }}
                                        >
                                            <option value="" disabled >Selecione um coorientador</option>
                                            {
                                                docentesPosGraduacao && docentesPosGraduacao
                                                    .slice()
                                                    .sort((a, b) => a.name.localeCompare(b.name))
                                                    .map((docente) => (
                                                        o.pesquisador.researcher_id !== docente.researcher_id ?
                                                            <option key={docente.researcher_id} value={docente.researcher_id}>{docente.name}</option>
                                                            :
                                                            <p key={docente.researcher_id}>
                                                                <option disabled value={docente.researcher_id}>{docente.name} - Docente selecionado</option>
                                                            </p>
                                                    ))
                                            }
                                        </select>

                                        {
                                            (o.orientacaoC.co_supervisor_ids.length != 0 && idCoorientador) && (
                                                <Button
                                                    type="button"
                                                    className="ml-2"
                                                    onClick={() => {
                                                        setIdCoorientador(null)
                                                    }}
                                                >
                                                    Limpar seleção
                                                </Button>
                                            )
                                        }
                                    </div>
                                end text-muted-foreground			</div>
                            </div>

                            <div className="flex items-center gap-3 w-full border border-gray-300 rounded-md p-3">
                                <p className="text-lg font-bold whitespace-nowrap">Data de entrada: </p>
                                <p>{formatarDataPtBR_semFuso(o.orientacaoC.start_date)}</p>
                            </div>

                            <div className="flex items-center gap-3 w-full border border-gray-300 rounded-md p-3">
                                <label className="text-lg font-bold whitespace-nowrap" htmlFor="tituloProjeto">
                                    Título do projeto:
                                </label>
                                <input
                                    id="tituloProjeto"
                                    className="w-full border-[2px] px-2 py-1 rounded-md"
                                    type="text"
                                    placeholder="Título da dissertação ou tese"
                                    value={tituloProjeto}
                                    onChange={(e) => setTituloProjeto(e.target.value)}
                                />
                            </div>

                            <div className="flex items-center gap-3 w-full border border-gray-300 rounded-md p-3">
                                <label className="text-lg font-bold whitespace-nowrap" htmlFor="linhaPesquisa">
                                    Linha de pesquisa:
                                </label>
                                <input
                                    id="linhaPesquisa"
                                    className="w-full border-[2px] px-2 py-1 rounded-md"
                                    type="text"
                                    placeholder="Linha de pesquisa do programa"
                                    value={linhaPesquisa}
                                    onChange={(e) => setLinhaPesquisa(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-3 w-full border border-gray-300 rounded-md p-3">
                                <div className="flex w-full items-center justify-between gap-2">
                                    <label className="text-lg font-bold whitespace-nowrap" htmlFor="Tag">
                                        Tag (opcional):
                                    </label>

                                    <select
                                        className="w-full min-w-fit border-[3px] ml-3 py-2 px-4 rounded-md"
                                        defaultValue="" 
                                        onChange={(event) => {
                                            const obj = JSON.parse(event.target.value);
                                            setTagsSelecionadas((tagsSelecionadas) => [...tagsSelecionadas, obj]);
                                            event.target.value = ""; 
                                        }}
                                    >
                                        <option value="" disabled>
                                            Selecione uma tag
                                        </option>

                                        {
                                            tags &&
                                            tags
                                                .filter((tag) => !tagsSelecionadas.some((t) => t.id === tag.id))
                                                .sort((a, b) => a.name.localeCompare(b.name))
                                                .map((tag) => (
                                                    <option key={tag.id} value={JSON.stringify(tag)}>
                                                        {tag.name}
                                                    </option>
                                                ))
                                        }
                                    </select>

                                    {tagsSelecionadas.length > 0 && (
                                        <div className="flex items-center w-1/2 gap-2">
                                            <p className="font-bold text-lg whitespace-nowrap">Tags selecionadas:</p>
                                            <div className="flex border border-gray-300 rounded-md p-3 overflow-x-auto gap-2">
                                                {tagsSelecionadas.map((tag) => (
                                                    <div
                                                        key={tag.id}
                                                        className="flex items-center rounded-sm border overflow-hidden border-gray-300 flex-shrink-0 min-w-max"
                                                    >
                                                        <span title="Remover tag" className="bg-red-400 p-1 h-full flex items-center gap-2 w-fit">
                                                            <X
                                                                onClick={() =>
                                                                    setTagsSelecionadas((tagsSelecionadas) =>
                                                                        tagsSelecionadas.filter((t) => t.id !== tag.id)
                                                                    )
                                                                }
                                                                className="text-black hover:cursor-pointer"
                                                                size={17}
                                                            />
                                                        </span>
                                                        <p className="p-1 whitespace-nowrap w-fit">{tag.name}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div
                                className="flex flex-col gap-3 border rounded-md h-fit p-3"
                                style={{ boxShadow: '3px 3px 3px rgba(0, 0, 0, 0.25)' }}
                            >
                                {
                                    possuiEtapaProjeto() && (
                                        <div className="flex flex-col p-3 gap-3 border-dashed border-black border-[2px] rounded-md">
                                            <p className="text-lg font-bold">Defesa do Projeto</p>
                                            <div className="flex items-center gap-3">

                                                <div className="flex gap-2 items-center w-1/2">
                                                    <label htmlFor="dataPrevista">Prevista: </label>
                                                    <input
                                                        className="w-full border-[2px] border-bl px-2 py-1 rounded-md"
                                                        onChange={(e) => {
                                                            setDataPrevisaoDefesa(e.target.value);
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
                                                        type="date"
                                                        onChange={(e) => {
                                                            setDataRealizadaDefesa(e.target.value);

                                                            if (e.target.value === "") {
                                                                setDataRealizadaDefesa("1");
                                                            }
                                                        }}
                                                        value={
                                                            dataRealizadaDefesa != null
                                                                ? dataRealizadaDefesa
                                                                : o.orientacaoC.done_date_project
                                                                    ? (new Date(o.orientacaoC.done_date_project).toString() !== "Invalid Date" ? new Date(o.orientacaoC.done_date_project).toISOString().split("T")[0] : "")
                                                                    : ""
                                                        }
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )
                                }

                                <div className="flex flex-col gap-3 p-3 border-dashed border-[2px] border-black rounded-md">
                                    <p className="text-lg font-bold">Qualificação </p>
                                    <div className="flex items-center gap-3">
                                        <div className="flex gap-2 items-center w-1/2">
                                            <label htmlFor="dataPrevista">Prevista: </label>
                                            <input
                                                className="w-full border-[2px] px-2 py-1 rounded-md"
                                                onChange={(e) => {
                                                    setDataPrevisaoQualificacao(e.target.value);
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

                                                    if (e.target.value === "") {
                                                        setDataRealizadaQualificacao("1");
                                                    }
                                                }}
                                                onClick={() => {
                                                    if (possuiEtapaProjeto() && o.orientacaoC.done_date_project == null && dataRealizadaDefesa == null) {
                                                        alert("Para definir data de realização de qualificação é preciso ter concluído a defesa do projeto!");
                                                    }
                                                }}
                                                value={
                                                    dataRealizadaQualificacao != null
                                                        ? dataRealizadaQualificacao
                                                        : o.orientacaoC.done_date_qualification
                                                            ? (new Date(o.orientacaoC.done_date_qualification).toString() !== "Invalid Date" ? new Date(o.orientacaoC.done_date_qualification).toISOString().split("T")[0] : "")
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
                                                    setDataPrevisaoDefesaFinal(e.target.value);
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
                                                onClick={() => {
                                                    if (o.orientacaoC.done_date_qualification == null && dataRealizadaQualificacao == null) {
                                                        alert("Para definir data de realização de defesa final é preciso ter concluído a qualificação!");
                                                    }
                                                }}
                                                onChange={(e) => {
                                                    setDataRealizadaDefesaFinal(e.target.value);

                                                    if (e.target.value === "") {
                                                        setDataRealizadaDefesaFinal("1");
                                                    }
                                                }}
                                                value={
                                                    dataRealizadaDefesaFinal != null
                                                        ? dataRealizadaDefesaFinal
                                                        : o.orientacaoC.done_date_conclusion
                                                            ? (new Date(o.orientacaoC.done_date_conclusion).toString() !== "Invalid Date" ? new Date(o.orientacaoC.done_date_conclusion).toISOString().split("T")[0] : "")
                                                            : ""
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    className="bg-[#559FB8] text-white px-4 py-2 rounded-md transition-all duration-75 active:scale-95"
                                    onClick={(e) => {
                                        if (dataRealizadaDefesaFinal != null && (dataRealizadaQualificacao == "" || (possuiEtapaProjeto() && dataRealizadaDefesa == ""))) {
                                            alert("Corrija os dados e tente novamente!");
                                            return;
                                        }
                                        salvarOrientando(e);
                                    }}
                                >
                                    Salvar
                                </button>
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

                <Dialog open={openDialogExcluir} onOpenChange={setOpenDialogExcluir}>
                    <DialogTrigger asChild>
                        <Button
                            className="w-1/2 bg-red-500 hover:bg-red-600"
                        >
                            Excluir
                        </Button>
                    </DialogTrigger>

                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Excluir orientação</DialogTitle>
                            <DialogDescription>
                                Tem certeza que deseja excluir essa orientação?
                            </DialogDescription>
                        </DialogHeader>
                        <DialogClose
                            className="absolute top-6 right-6 bg-red-500 text-white p-2 rounded-md"
                            title="Fechar"
                        >
                            <X className="w-4 h-4" />
                        </DialogClose>

                        <div className="w-full flex gap-3 items-center">
                            <button
                                className="text-white w-1/2 bg-gray-500 px-4 py-2 rounded-md transition-all duration-75 active:scale-95"
                                onClick={(e) => {
                                    setOpenDialogExcluir(false);
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                className="bg-red-500 w-1/2 text-white px-4 py-2 rounded-md transition-all duration-75 active:scale-95"
                                onClick={(e) => {
                                    handleExcluirOrientacao(o.orientacaoC.id);
                                }}
                            >
                                Excluir
                            </button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

        </div>
    )
}
