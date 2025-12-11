import { DialogFooter, DialogHeader, Dialog, DialogContent, DialogDescription, DialogTitle } from "../ui/dialog";
import { useModal } from "../hooks/use-modal-store";
import { Button } from "../ui/button";
import { ArrowUUpLeft, Trash } from "phosphor-react";
import { toast } from "sonner"
import { UserContext } from "../../context/context";
import { useContext, useEffect, useState } from "react";

export interface PesquisadorProps {
    lattes_id: string
    name: string
    type_: string
}

export function ConfirmDeleteResearcherGraduateProgram() {
    const { onOpen, onClose, isOpen, type: typeModal, data: dataModal } = useModal();
    const isModalOpen = isOpen && typeModal === "confirm-delete-researcher-graduate-program";
    const { urlGeralAdm } = useContext(UserContext)

    const handleSubmitDelete = async (id_programa: string | undefined, researcher_id: string | undefined) => {

        try {
            const data = [
                {
                    graduate_program_id: id_programa,
                    lattes_id: researcher_id,
                }
            ]

            let urlProgram = urlGeralAdm + 'GraduateProgramResearcherRest/Delete'
            const fetchData = async () => {
                try {
                    const response = await fetch(urlProgram, {
                        mode: 'cors',
                        method: 'DELETE',
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(data),
                    });

                    if (response.ok) {

                        toast("Dados enviados com sucesso", {
                            description: "Pesquisador removido no programa de pós-graduação",
                            action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                            },
                        })

                        onOpen('add-researcher-graduation')

                    } else {
                        console.error('Erro ao enviar dados para o servidor.');
                        toast("Tente novamente!", {
                            description: "Erro ao remover pesquisador do programa de pós-graduação",
                            action: {
                                label: "Fechar",
                                onClick: () => console.log("Undo"),
                            },
                        })
                    }
                } catch (err) {
                    console.log(err);
                }
            };
            fetchData();

        } catch (error) {
            toast("Erro ao processar requisição", {
                description: "Tente novamente",
                action: {
                    label: "Fechar",
                    onClick: () => console.log("Undo"),
                },
            })
        }
    };


    return (
        <Dialog open={isModalOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader className="pt-8 px-6 flex flex-col items-center">
                    <DialogTitle className="text-2xl  mb-2 font-medium max-w-[450px]">
                        <strong className="bg-red-500 text-white hover:bg-red-600 transition duration-500 font-medium">Deletar</strong> pesquisador(a) {dataModal.nome} do programa
                    </DialogTitle>
                    <DialogDescription className=" text-zinc-500">
                        Você tem certeza de que deseja prosseguir com a exclusão do pesquisador que está atualmente vinculado a este programa de pós-graduação?
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter className=" py-4 ">
                    <Button variant={'ghost'} onClick={() => onOpen('add-researcher-graduation')}>
                        <ArrowUUpLeft size={16} className="" />Cancelar
                    </Button>

                    <Button variant={'destructive'} onClick={() => {
                        if (dataModal) {
                            handleSubmitDelete(dataModal.graduate_program_id, dataModal.researcher_id);
                        }
                    }}>
                        <Trash size={16} className="" />Deletar
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}