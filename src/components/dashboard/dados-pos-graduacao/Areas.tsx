import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CriarAtualizarArea from "./CriarAtualizarArea";
import { getTagsService } from "../../../service/tags";
import CartaoArea from "./CartaoArea";
import { getAreaService } from "../../../service/area";

export interface Area {
    id: string
    name: string
    created_at?: string
}

export default function Areas() {

    const [carregando, setCarregando] = useState<boolean>(true);
    const [areas, setAreas] = useState<Area[]>([]);

    async function buscarAreas() {

        const areas = await getAreaService();

        if (!areas) {
            toast.error("Erro ao buscar as áreass!");
            setCarregando(false);
            return;
        }

        setAreas(areas);

        setTimeout(() => {
            setCarregando(false);
        }, 1000);

    }

    useEffect(() => {
        buscarAreas();
    }, [])

    return (
        <div
            className="
                flex flex-col w-full px-8 py-3
            "
        >
            <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">Áreas</h1>
                    <CriarAtualizarArea atualizar={buscarAreas} isAtualizar={false} />
                </div>

                <p>Cria áreas para associar aos pesquisadores</p>

                <div className="relative grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {
                        carregando ? (
                            <div className="flex items-center absolute -translate-x-1/2 left-1/2 top-1/2 justify-center gap-2 text-2xl mt-20 text-center animate-pulse">
                                <p>Carregando...</p>
                                <IconLoader size={30} className="animate-spin" />
                            </div>
                        ) : (
                            areas.length === 0 ? (
                                <p className="animate-pulse absolute -translate-x-1/2 left-1/2 top-1/2">Nenhuma área encontrada</p>
                            ) : (
                                areas.map((area) => (
                                    <CartaoArea
                                        key={area.id}
                                        atualizar={buscarAreas}
                                        area={area}
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