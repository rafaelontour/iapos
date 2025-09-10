import { Edit, Plus } from "lucide-react";
import { Button } from "../../ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../../ui/dialog";
import { Input } from "../../ui/input";
import { useState } from "react";
import { atualizarConfiguracaoService, salvarConfiguracaoService } from "../../../service/configuracaoDataPosGraduacao";
import { toast } from "sonner";
import { Configuracao } from "./dados-pos-graduacao";

interface Props {
    isAtualizar: boolean
    atualizar: () => void
    config?: Configuracao
}

export default function CriarAtualizarConfiguracao({ atualizar, isAtualizar, config }: Props) {

    const [openDialog, setOpenDialog] = useState<boolean>(false);

    const [dados, setDados] = useState({
        nome: config ? config.config_name : "",
        duracaoProjeto: config ? config.duration_project_months : 0,
        duracaoQualificacao: config ? config.duration_qualification_months : 0,
        duracaoConclusao: config ? config.duration_conclusion_months : 0
    })

    async function salvarConfiguracao() {
        if (!isAtualizar && (dados.nome === "" || dados.duracaoProjeto === 0 || dados.duracaoQualificacao === 0 || dados.duracaoConclusao === 0)) {
            alert("Preencha todos os campos para salvar a configuração!")
            return
        }

        if (!isAtualizar) {
            const resposta = await salvarConfiguracaoService(dados)
            if (resposta !== 201) {
                toast.error("Erro ao criar configuração!")
                return
            }
            limparCampos()
            toast.success("Configuração criada com sucesso!")
        }

        if (isAtualizar) {

            const resposta = await atualizarConfiguracaoService(config?.id, dados)

            if (resposta !== 200) {
                toast.error("Erro ao atualizar configuração!")
                return
            }
            limparCampos()
            toast.success("Configuração atualizada com sucesso!")
        }


        atualizar()
        setOpenDialog(false)
    }

    function limparCampos() {
        setDados({
            nome: "",
            duracaoProjeto: 0,
            duracaoQualificacao: 0,
            duracaoConclusao: 0
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
                                <p>Criar nova configuração</p>
                            </Button>
                    }

                </DialogTrigger>

                <DialogContent className="flex flex-col gap-4" onCloseAutoFocus={limparCampos}>
                    <DialogHeader>
                        <DialogTitle>
                            {isAtualizar ? "Editar configuração" : "Crie uma nova configuração"}
                        </DialogTitle>

                        <DialogDescription>
                            {isAtualizar ? "Edite os campos abaixo para atualizar a configuração" : "Preencha os campos abaixo para criar uma nova configuração"}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                            <p>Nome:</p>
                            <Input
                                defaultValue={isAtualizar ? config?.config_name : dados.nome}
                                onChange={(novoNome) => { setDados(anterior => ({ ...anterior, nome: novoNome.target.value })) }}
                                placeholder="Ex: Configuração mestrado padrão"
                                min={0}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p>Duração do projeto:</p>
                            <Input
                                defaultValue={isAtualizar ? config?.duration_project_months : dados.duracaoProjeto}
                                onChange={(novoDuracao) => setDados(anterior => ({ ...anterior, duracaoProjeto: Number(novoDuracao.target.value) }))}
                                type="number"
                                placeholder="Ex: 6"
                                min={0}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <p>Duração para a  qualificação:</p>
                            <Input
                                defaultValue={isAtualizar ? config?.duration_qualification_months : dados.duracaoQualificacao}
                                onChange={(novoDuracao) => setDados(anterior => ({ ...anterior, duracaoQualificacao: Number(novoDuracao.target.value) }))}
                                type="number"
                                placeholder="Ex: 18"
                                min={0}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <p>Duração para a conclusão:</p>
                        <Input
                            defaultValue={isAtualizar ? config?.duration_conclusion_months : dados.duracaoConclusao}
                            onChange={(novoDuracao) => setDados(anterior => ({ ...anterior, duracaoConclusao: Number(novoDuracao.target.value) }))}
                            type="number"
                            placeholder="Ex: 24"
                        />

                    </div>

                    <DialogFooter className="mt-7">
                        <DialogClose asChild>
                            <Button className="bg-red-500 hover:bg-red-600">
                                Cancelar
                            </Button>
                        </DialogClose>

                        <Button
                            onClick={() => {
                                salvarConfiguracao()
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