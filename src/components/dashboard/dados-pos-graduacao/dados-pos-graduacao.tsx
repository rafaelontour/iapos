import { useEffect, useState } from "react";
import { getConfiguracoes } from "../../../service/configuracaoDataPosGraduacao";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";
import CartaoConfiguracao from "./CartaoConfiguracao";
import { Button } from "../../ui/button";
import { AlertCircle, Plus } from "lucide-react";
import CriarAtualizarConfiguracao from "./CriarAtualizarConfiguracao";

export interface Configuracao {
    id: string;
    config_name: string;
    duration_project_months: number;
    duration_qualification_months: number;
    duration_conclusion_months: number;
    created_at: string;
    updated_at: string;
}

export default function DadosPosGraduacao() {

    const [configuracoes, setConfiguracoes] = useState<Configuracao[]>([]);
    const [carregando, setCarregando] = useState<boolean>(true);

    async function buscarConfiguracoes() {
        const configs = await getConfiguracoes();

        if (!configs) {
            toast.error("Erro ao buscar as configurações");
            setCarregando(false);
            return;
        }

        setTimeout(() => {
            setConfiguracoes(configs);
            setCarregando(false);
        }, 2000);

    }

    useEffect(() => {
        buscarConfiguracoes();
    }, [])

    return (
        <div
            className="
                flex flex-col w-full px-8 py-3
            "
        >
            <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold">Configuração de datas</h1>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <p>Crie configurações de datas para usar no cadastro de alunos em programas de pós graduação.</p>

                        <div className="flex items-center text-white w-fit justify-center text-xs gap-2 bg-eng-blue rounded-md py-2 px-4 mt-2">
                            <AlertCircle size={17} />
                            <p>O tempo das configurações sempre é definido como quantidade de meses</p>
                        </div>
                    </div>

                    <CriarAtualizarConfiguracao isAtualizar={false} atualizar={buscarConfiguracoes} />
                </div>

                <div className="relative mt-8 mx-5 grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {
                        carregando ? (
                            <div className="flex items-center absolute -translate-x-1/2 left-1/2 top-1/2 justify-center gap-2 text-2xl mt-20 text-center animate-pulse">
                                <p>Carregando...</p>
                                <IconLoader size={30} className="animate-spin" />
                            </div>
                        ) : (
                            configuracoes.length === 0 ? (
                                <p className="animate-pulse absolute -translate-x-1/2 left-1/2 top-1/2">Nenhuma configuração encontrada</p>
                            ) : (
                                configuracoes.map((config) => (
                                    <CartaoConfiguracao
                                        key={config.id}
                                        atualizar={buscarConfiguracoes}
                                        config={config}
                                    />
                                ))
                            )
                        )
                    }
                </div>
            </div>
        </div>
    )
}