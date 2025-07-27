import { getInfoPesquisadorPorId } from "../../../service/discentes";
import { useEffect, useState } from "react";

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
        <div className="flex items-center gap-5 border rounded-md shadow-md p-5 max-h-[170px]">
            <div
                className={`flex items-center w-[100px] h-[100px] rounded-md bg-cover`}
                style={{
                    backgroundImage: nomeDiscente ? `url(https://iapos-api.senaicimatec.com.br/ResearcherData/Image?name=${encodeURIComponent(nomeDiscente)}) ` : "",
                    boxShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                }}
            >

            </div>

            <div className="flex flex-col justify-center gap-2 h-[150px]">
                <p className="font-bold text-[16px]">{nomeDiscente}</p>
                <p className="text-sm">{tipo()} <span className="font-bold">{calcularData()}</span></p>

                {
                    o.orientacaoC.peding && (
                        <p>Status: <span className={`bg-${corSpanPrevisao()} text-white px-2 py-1 rounded-md shadow-sm`}>{o.orientacaoC.peding}</span></p>
                    )
                }

                <p>{data()}<span className="font-bold">{Math.abs(parseInt(o.orientacaoC.peding_days))} dias</span></p>

            </div>
        </div>
    )
}