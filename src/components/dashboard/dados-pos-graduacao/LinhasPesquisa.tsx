import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CartaoLinhaPesquisa from "./CartaoLinhaPesquisa";
import CriarAtualizarLinhaPesquisa from "./CriarAtualizarLinhaPesquisa";
import { LinhaPesquisa, getLinhasPesquisaService } from "../../../service/linhasPesquisa";
import { useContext } from "react";
import { UserContext } from "../../../context/context";

export default function LinhasPesquisa() {
    const { idGraduateProgram } = useContext(UserContext);

    const [carregando, setCarregando] = useState<boolean>(true);
    const [linhas, setLinhas] = useState<LinhaPesquisa[]>([]);

    async function buscarLinhas() {
        setCarregando(true);
        const dados = await getLinhasPesquisaService(idGraduateProgram || undefined);

        setLinhas(Array.isArray(dados) ? dados : []);
        setTimeout(() => setCarregando(false), 300);
    }

    useEffect(() => {
        buscarLinhas();
    }, [idGraduateProgram]);

    return (
        <div className="flex flex-col w-full px-8 py-3">
            <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold">Linhas de Pesquisa</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Gerencie as linhas de pesquisa disponíveis para os programas de pós-graduação.
                        </p>
                    </div>
                    <CriarAtualizarLinhaPesquisa
                        atualizar={buscarLinhas}
                        isAtualizar={false}
                        graduate_program_id={idGraduateProgram || undefined}
                    />
                </div>

                <div className="relative grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 mt-2">
                    {carregando ? (
                        <div className="flex items-center absolute -translate-x-1/2 left-1/2 top-1/2 justify-center gap-2 text-2xl mt-20 text-center animate-pulse">
                            <p>Carregando...</p>
                            <IconLoader size={30} className="animate-spin" />
                        </div>
                    ) : linhas.length === 0 ? (
                        <p className="animate-pulse col-span-full text-center mt-10 text-gray-500">
                            Nenhuma linha de pesquisa cadastrada
                        </p>
                    ) : (
                        linhas.map((linha) => (
                            <CartaoLinhaPesquisa
                                key={linha.id}
                                atualizar={buscarLinhas}
                                linhaPesquisa={linha}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
