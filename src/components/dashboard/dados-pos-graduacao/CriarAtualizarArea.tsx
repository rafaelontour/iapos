import { AlertCircle, Edit, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useState } from "react";
import { toast } from "sonner";

import { atualizarAreaService, salvarAreaService } from "../../../service/area";
import { Area } from "./Areas";


interface Props {
    isAtualizar: boolean
    atualizar: () => void
    area?: Area
}

export default function CriarAtualizarArea({ atualizar, isAtualizar, area }: Props) {

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const [dados, setDados] = useState({
        name: area ? area.name : ""
    })

    async function salvarArea() {
        if (!isAtualizar && (dados.name === "")) {
            alert("É obrigatório o nome da tag!")
            return
        }

        if (!isAtualizar) {
            const resposta = await salvarAreaService(dados)
            if (resposta !== 200) {
                toast.error("Erro ao criar área!")
                return
            }
            limparCampos()
            toast.success("Área criada com sucesso!")
        }

        if (isAtualizar) {

            const resposta = await atualizarAreaService(area?.id, dados)

            if (resposta !== 200) {
                toast.error("Erro ao atualizar área!")
                return
            }
            limparCampos()
            toast.success("Área atualizada com sucesso!")
        }


        atualizar()
        setOpenDialog(false)
    }

    function limparCampos() {
        setDados({
            name: ""
        })
    }

    return (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <form>
                <DialogTrigger asChild>

                    {
                        isAtualizar ?
                            <Button variant={"outline"} className="bg-eng-blue hover:bg-eng-blue-dark p-0 w-[35px] h-[35px]" title="Editar">
                                <Edit color="white" size={17} />
                            </Button>
                            :
                            <Button className="flex items-center">
                                <Plus size={16} />
                                <p>Criar nova área</p>
                            </Button>
                    }

                </DialogTrigger>

                <DialogContent className="flex flex-col gap-4" onCloseAutoFocus={limparCampos}>
                    <DialogHeader>
                        <DialogTitle>
                            {isAtualizar ? "Editar área" : "Crie uma nova área"}
                        </DialogTitle>

                        <DialogDescription>
                            {isAtualizar ? "Edite o abaixo para atualizar a área" : "Preencha o campo abaixo para criar uma nova área"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <p>Nome:</p>
                            <Input
                                defaultValue={isAtualizar ? area?.name : dados.name}
                                onChange={(novoNome) => { setDados(anterior => ({ ...anterior, name: novoNome.target.value })) }}
                                placeholder="Rótulo da área"
                                type="text"
                            />
                        </div>
                    </div>

                    <DialogFooter className="mt-7">
                        <DialogClose asChild>
                            <Button className="bg-red-500 hover:bg-red-600">
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button
                            onClick={() => {
                                salvarArea()
                            }}
                        >
                            {isAtualizar ? "Salvar alterações" : "Criar"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}