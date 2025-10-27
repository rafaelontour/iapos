import { Calendar, Edit, Trash, View } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../../ui/dialog";
import { excluirTagService } from "../../../service/tags";
import { toast } from "sonner";
import CriarAtualizarArea from "./CriarAtualizarArea";
import { Area } from "./Areas";

interface Props {
    atualizar: () => void
    area: Area
}

export default function CartaoArea({ area, atualizar }: Props) {

    async function excluirTag(id: string) {
        const resposta = await excluirTagService(id)

        if (resposta !== 200) {
            toast.error("Erro ao excluir a tag!")
            return
        }

        toast.success("Tag excluida com sucesso!")
        atualizar()

    }

    function formatarData(data: string | undefined) {

        if (!data) {
            return ""
        }

        const d = new Date(data)
        const formatada = d.toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
        return formatada;
    }

    return (
        <div
            className="
                flex flex-col gap-2
                h-fit rounded-md
                p-4 overflow-hidden
            "
            style={{ boxShadow: '1px 1px 3px rgba(0, 0, 0, 0.25)' }}
        >
            <p className="font-bold text-xl">{area.name}</p>

            <div className="flex justify-between">
                <div className="flex min-w-[200px] gap-2 items-center mt-2 ml-1">

                    <CriarAtualizarArea area={area} isAtualizar={true} atualizar={atualizar} />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                title="Excluir"
                                variant={"outline"}
                                className="
                                    p-0 w-[35px] h-[35px] bg-red-500 hover:bg-red-600
                                "
                            >
                                <Trash color="white" size={17} />
                            </Button>
                        </DialogTrigger>

                        <DialogContent>
                            <p className="font-bold text-xl">Deseja mesmo excluir esta configuração? <span className="text-sm font-semibold text-red-600">Após isso, não será possível desfazer esta ação</span></p>
                            <div className="flex items-center justify-end">
                                <DialogClose>
                                    <Button className="mt-3 bg-eng-blue text-white px-4 py-2 rounded-md font-semibold ml-4 right-0 relative">Cancelar</Button>
                                </DialogClose>

                                <DialogClose className="flex justify-end">
                                    <Button
                                        className="
                                            mt-3 bg-red-500 hover:bg-red-600 text-white
                                            px-4 py-2 rounded-md font-semibold ml-4
                                            right-0 relative
                                        "
                                        onClick={() => excluirTag(area.id)}
                                    >
                                        Excluir
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>

                </div>

                <div
                    className="
                        flex items-center mt-2
                        py-2 px-3 gap-1 bg-eng-blue bottom-0
                        right-0 text-white rounded-md
                    "
                >
                    <Calendar size={24} />
                    <div className="flex flex-col">
                        <span className="font-bold text-[10px] -mb-1">Criado em</span>
                        <p className="font-bold text-[10px]">{formatarData(area.created_at)}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}