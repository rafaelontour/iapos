import { Calendar, Trash } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogTrigger } from "../../ui/dialog";
import { toast } from "sonner";
import { LinhaPesquisa, excluirLinhaPesquisaService } from "../../../service/linhasPesquisa";
import CriarAtualizarLinhaPesquisa from "./CriarAtualizarLinhaPesquisa";

interface Props {
    atualizar: () => void;
    linhaPesquisa: LinhaPesquisa;
}

export default function CartaoLinhaPesquisa({ linhaPesquisa, atualizar }: Props) {

    async function excluir(id: string) {
        const status = await excluirLinhaPesquisaService(id);
        if (!status) {
            toast.error("Erro ao excluir a linha de pesquisa!");
            return;
        }
        toast.success("Linha de pesquisa excluída com sucesso!");
        atualizar();
    }

    function formatarData(data: string | undefined) {
        if (!data) return "";
        return new Date(data).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    }

    return (
        <div
            className="flex flex-col gap-3 h-fit rounded-md p-4 overflow-hidden"
            style={{ boxShadow: "1px 1px 3px rgba(0,0,0,0.25)" }}
        >
            <p className="font-bold text-xl">{linhaPesquisa.name}</p>

            <div className="flex h-[80px] items-center justify-center border border-gray-300 rounded-md px-4">
                <p className="text-center text-sm text-gray-600">{linhaPesquisa.name}</p>
            </div>

            <div className="flex justify-between items-center mt-1">
                <div className="flex gap-2">
                    <CriarAtualizarLinhaPesquisa
                        linhaPesquisa={linhaPesquisa}
                        isAtualizar={true}
                        atualizar={atualizar}
                    />

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button
                                title="Excluir"
                                variant="outline"
                                className="p-0 w-[35px] h-[35px] bg-red-500 hover:bg-red-600"
                            >
                                <Trash color="white" size={17} />
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <p className="font-bold text-xl">
                                Deseja mesmo excluir esta linha de pesquisa?{" "}
                                <span className="text-sm font-semibold text-red-600">
                                    Após isso, não será possível desfazer esta ação.
                                </span>
                            </p>
                            <div className="flex items-center justify-end gap-2">
                                <DialogClose asChild>
                                    <Button className="mt-3 bg-eng-blue text-white">Cancelar</Button>
                                </DialogClose>
                                <DialogClose asChild>
                                    <Button
                                        className="mt-3 bg-red-500 hover:bg-red-600 text-white"
                                        onClick={() => excluir(linhaPesquisa.id)}
                                    >
                                        Excluir
                                    </Button>
                                </DialogClose>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="flex items-center py-2 px-3 gap-1 bg-eng-blue text-white rounded-md">
                    <Calendar size={20} />
                    <div className="flex flex-col">
                        <span className="font-bold text-[10px] -mb-1">Criado em</span>
                        <p className="font-bold text-[10px]">{formatarData(linhaPesquisa.created_at)}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
