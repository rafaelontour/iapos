import { AlertCircle, Edit, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useState } from "react";
import { toast } from "sonner";

import { Tag } from "./Tags";
import { atualizarTagService, salvarTagService } from "../../../service/tags";

interface Props {
    isAtualizar: boolean
    atualizar: () => void
    tag?: Tag
}

export default function CriarAtualizarTag({ atualizar, isAtualizar, tag }: Props) {

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const [dados, setDados] = useState({
        name: tag ? tag.name : "",
        color_code: tag ? tag.color_code : "",
    })

    async function salvarTag() {
        if (!isAtualizar && (dados.name === "" || dados.color_code === "")) {
            alert("Preencha todos os campos para salvar a tag!")
            return
        }

        if (!isAtualizar) {
            const resposta = await salvarTagService(dados)
            if (resposta !== 200) {
                toast.error("Erro ao criar tag!")
                return
            }
            limparCampos()
            toast.success("Tag criada com sucesso!")
        }

        if (isAtualizar) {

            const resposta = await atualizarTagService(tag?.id, dados)

            if (resposta !== 200) {
                toast.error("Erro ao atualizar tag!")
                return
            }
            limparCampos()
            toast.success("Tag atualizada com sucesso!")
        }


        atualizar()
        setOpenDialog(false)
    }

    function limparCampos() {
        setDados({
            name: "",
            color_code: ""
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
                                <p>Criar nova tag</p>
                            </Button>
                    }

                </DialogTrigger>

                <DialogContent className="flex flex-col gap-4" onCloseAutoFocus={limparCampos}>
                    <DialogHeader>
                        <DialogTitle>
                            {isAtualizar ? "Editar tag" : "Crie uma nova tag"}
                        </DialogTitle>

                        <DialogDescription>
                            {isAtualizar ? "Edite os campos abaixo para atualizar a tag" : "Preencha os campos abaixo para criar uma nova tag"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <p>Nome:</p>
                            <Input
                                defaultValue={isAtualizar ? tag?.name : dados.name}
                                onChange={(novoNome) => { setDados(anterior => ({ ...anterior, name: novoNome.target.value })) }}
                                placeholder="Rótulo da tag"
                                type="text"
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p>Cor da tag:</p>
                            <div className="flex items-center gap-2 bg-eng-blue text-white w-fit px-4 py-2 rounded-md">
                                <AlertCircle size={16} />
                                <span className="text-sm">Clique na barra de cor abaixo para selecionar a cor</span>
                            </div>

                            <Input
                                defaultValue={isAtualizar ? tag?.color_code : dados.color_code}
                                onChange={(novaCor) => {
                                    setDados(anterior => ({ ...anterior, color_code: novaCor.target.value })
                                    )
                                }}
                                type="color"
                                placeholder="Ex: 6"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p>Pré-visualização da tag:</p>

                        <div className={`flex justify-center items-center  w-full h-[150px] border border-gray-300 rounded-md`}>
                            <div
                                className={`
                                    flex justify-center items-center
                                    px-4 py-1 rounded-xl w-fit h-[50px]
                                    ${dados.color_code === "" ? "text-black" : "text-white"}
                                `}
                                style={{
                                    backgroundColor: dados.color_code || "#ffffff",
                                    boxShadow: '-2px 4px 2px rgba(0,0,0,.3)'
                                }}
                            >
                                {
                                    dados.name ? dados.name : "Tag sem nome"
                                }
                            </div>
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
                                salvarTag()
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