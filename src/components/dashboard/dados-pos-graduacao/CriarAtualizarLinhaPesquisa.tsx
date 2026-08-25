import { Edit, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import {
    Dialog, DialogClose, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useState } from "react";
import { toast } from "sonner";
import { LinhaPesquisa } from "../../../service/linhasPesquisa";
import {
    atualizarLinhaPesquisaService,
    salvarLinhaPesquisaService,
} from "../../../service/linhasPesquisa";

interface Props {
    isAtualizar: boolean;
    atualizar: () => void;
    linhaPesquisa?: LinhaPesquisa;
    graduate_program_id?: string;
}

export default function CriarAtualizarLinhaPesquisa({
    atualizar,
    isAtualizar,
    linhaPesquisa,
    graduate_program_id,
}: Props) {
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [nome, setNome] = useState(linhaPesquisa?.name ?? "");

    async function salvar() {
        if (!isAtualizar) {
            if (!nome.trim()) {
                alert("Preencha o nome da linha de pesquisa!");
                return;
            }
            if (!graduate_program_id) {
                alert("Programa de pós-graduação não identificado!");
                return;
            }
            const status = await salvarLinhaPesquisaService({
                name: nome.trim(),
                graduate_program_id,
            });
            if (!status) {
                toast.error("Erro ao criar linha de pesquisa!");
                return;
            }
            toast.success("Linha de pesquisa criada com sucesso!");
        } else {
            if (!nome.trim()) {
                alert("Preencha o nome da linha de pesquisa!");
                return;
            }
            const status = await atualizarLinhaPesquisaService(
                linhaPesquisa!.id,
                { name: nome.trim() }
            );
            if (!status) {
                toast.error("Erro ao atualizar linha de pesquisa!");
                return;
            }
            toast.success("Linha de pesquisa atualizada com sucesso!");
        }

        setNome("");
        atualizar();
        setOpenDialog(false);
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
                {isAtualizar ? (
                    <Button
                        variant="outline"
                        className="bg-eng-blue hover:bg-eng-blue-dark p-0 w-[35px] h-[35px]"
                        title="Editar"
                    >
                        <Edit color="white" size={17} />
                    </Button>
                ) : (
                    <Button className="flex items-center gap-1">
                        <Plus size={16} />
                        <p>Criar nova linha</p>
                    </Button>
                )}
            </DialogTrigger>

            <DialogContent
                className="flex flex-col gap-4"
                onCloseAutoFocus={() => setNome(linhaPesquisa?.name ?? "")}
            >
                <DialogHeader>
                    <DialogTitle>
                        {isAtualizar ? "Editar linha de pesquisa" : "Criar nova linha de pesquisa"}
                    </DialogTitle>
                    <DialogDescription>
                        {isAtualizar
                            ? "Edite o campo abaixo para atualizar a linha de pesquisa"
                            : "Preencha o campo abaixo para criar uma nova linha de pesquisa"}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-2">
                    <p>Nome:</p>
                    <Input
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Ex: Sistemas Inteligentes e Computação"
                        type="text"
                    />
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button className="bg-red-500 hover:bg-red-600">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={salvar}>
                        {isAtualizar ? "Salvar alterações" : "Criar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
