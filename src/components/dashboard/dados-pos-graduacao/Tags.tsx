import { IconLoader } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import CartaoTag from "./CartaoTag";
import CriarAtualizarTag from "./CriarAtualizarTag";
import { getTagsService } from "../../../service/tags";

export interface Tag {
    id: string
    name: string
    color_code: string
    created_at?: string
}

export default function Tags() {

    const [carregando, setCarregando] = useState<boolean>(true);
    const [tags, setTags] = useState<Tag[]>([]);

    async function buscarTags() {

        const tags = await getTagsService();

        if (!tags) {
            toast.error("Erro ao buscar as tags!");
            setCarregando(false);
            return;
        }

        setTags(tags);

        setTimeout(() => {
            setCarregando(false);
        }, 1000);

    }

    useEffect(() => {
        buscarTags();
    }, [])

    return (
        <div
            className="
                flex flex-col w-full px-8 py-3
            "
        >
            <div className="flex flex-col gap-3 w-full">
                <div className="flex items-center justify-between">
                    <h1 className="text-3xl font-semibold">Tags</h1>
                    <CriarAtualizarTag atualizar={buscarTags} isAtualizar={false} />
                </div>

                <div className="relative grid sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
                    {
                        carregando ? (
                            <div className="flex items-center absolute -translate-x-1/2 left-1/2 top-1/2 justify-center gap-2 text-2xl mt-20 text-center animate-pulse">
                                <p>Carregando...</p>
                                <IconLoader size={30} className="animate-spin" />
                            </div>
                        ) : (
                            tags.length === 0 ? (
                                <p className="animate-pulse absolute -translate-x-1/2 left-1/2 top-1/2">Nenhuma tag encontrada</p>
                            ) : (
                                tags.map((tag) => (
                                    <CartaoTag
                                        key={tag.id}
                                        atualizar={buscarTags}
                                        tag={tag}
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