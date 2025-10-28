import { Check, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useContext, useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { UserContext } from "../../context/context";
import { Area } from "../dashboard/dados-pos-graduacao/Areas";
import { Pesquisador } from "../dashboard/columns";

export interface Props {
    pesquisador: Pesquisador;
    areas: Area[];
}

export interface AreaEntry {
    id: string;
    focal_point: boolean;
}

export function EditResearcherModal({ pesquisador, areas }: Props) {
    const { urlGeralAdm } = useContext(UserContext);
    const [areasCriadas, setAreasCriadas] = useState<AreaEntry[]>([]);
    const [nome, setNome] = useState(pesquisador.name);
    const [lattesId, setLattesId] = useState(pesquisador.lattes_id);
    const [popoverOpen, setPopoverOpen] = useState(false);

    // Função para buscar os dados atualizados do pesquisador
    const fetchPesquisadorAtualizado = async () => {
        try {
            const response = await fetch(`${urlGeralAdm}ResearcherRest/Query?institution_id=${pesquisador.institution_id}`);
            if (!response.ok) throw new Error("Erro ao buscar pesquisador");

            const data: Pesquisador[] = await response.json();
            const pesquisadorAtualizado = data.find(p => p.researcher_id === pesquisador.researcher_id);

            if (pesquisadorAtualizado) {
                setAreasCriadas(pesquisadorAtualizado.areas || []);
                setNome(pesquisadorAtualizado.name);
                setLattesId(pesquisadorAtualizado.lattes_id);
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro ao buscar dados do pesquisador", { description: "Tente novamente" });
        }
    };

    const adicionarNovaArea = () => {
        setAreasCriadas((anteriores) => [...anteriores, { id: "", focal_point: false }]);
    };

    const atualizarArea = (index: number, campo: keyof AreaEntry, valor: any) => {
        setAreasCriadas((anteriores) =>
            anteriores.map((area, i) => (i === index ? { ...area, [campo]: valor } : area))
        );
    };

    const removeArea = (index: number) => {
        setAreasCriadas((anteriores) => anteriores.filter((_, i) => i !== index));
    };

    const handleSubmitPesquisador = async () => {
        if (areasCriadas.some(area => area.id === "")) {
            toast.error("Erro ao enviar dados!", { description: "Todas as áreas do pesquisador devem ter um valor!" });
            return;
        }

        try {
            const payload = {
                institution_id: pesquisador.institution_id,
                researcher_id: pesquisador.researcher_id,
                name: nome || pesquisador.name,
                lattes_id: lattesId || pesquisador.lattes_id,
                status: pesquisador.status,
                areas: areasCriadas,
            };

            const urlProgram = urlGeralAdm + "/ResearcherRest/Update";
            const response = await fetch(urlProgram, {
                mode: "cors",
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify([payload]),
            });

            if (response.ok) {
                toast("Dados enviados com sucesso", { description: "Pesquisador atualizado na instituição" });
                setPopoverOpen(false); // fecha o Popover
            } else {
                toast.error("Erro ao enviar os dados", { description: "Tente novamente" });
            }
        } catch (err) {
            console.error(err);
            toast.error("Erro inesperado", { description: "Tente novamente" });
        }
    };

    return (
        <Popover
            open={popoverOpen}
            onOpenChange={async (open) => {
                setPopoverOpen(open);
                if (open) {
                    await fetchPesquisadorAtualizado(); // busca dados atualizados ao abrir
                }
            }}
        >
            <PopoverTrigger asChild>
                <Button variant="outline" className="h-8 w-8 p-0">
                    <Pencil size={8} className="h-4 w-4" />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-96" onClick={(e) => e.stopPropagation()}>
                {/* Formulário */}
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Editar pesquisador</h4>
                        <p className="text-sm text-muted-foreground">{pesquisador.name}</p>
                    </div>

                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Nome</Label>
                            <Input value={nome} onChange={(e) => setNome(e.target.value)} className="col-span-2 h-8" />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Lattes Id</Label>
                            <Input value={lattesId} onChange={(e) => setLattesId(e.target.value)} className="col-span-2 h-8" />
                        </div>

                        <hr />

                        <div className="grid gap-2 max-h-72 mt-1 overflow-y-auto">
                            <Label>Áreas do pesquisador</Label>
                            {areasCriadas.length > 0 ? (
                                areasCriadas.map((a, index) => (
                                    <div key={index} className="grid grid-cols-3 items-center gap-2 border-t pt-2 mt-2">
                                        <Select value={a.id} onValueChange={(val) => atualizarArea(index, "id", val)}>
                                            <SelectTrigger className="h-8 col-span-3">
                                                <SelectValue placeholder="Selecione a área" />
                                            </SelectTrigger>

                                            <SelectContent>
                                                {areas
                                                    .filter(area => !areasCriadas.some(b => b.id === area.id) || area.id === a.id)
                                                    .map(area => (
                                                        <SelectItem key={area.id} value={area.id}>{area.name}</SelectItem>
                                                    ))}
                                            </SelectContent>
                                        </Select>

                                        <Select
                                            value={a.focal_point ? "sim" : "nao"}
                                            onValueChange={val => atualizarArea(index, "focal_point", val === "sim")}
                                        >
                                            <SelectTrigger className="h-8 col-span-2">
                                                <SelectValue placeholder="Ponto focal?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sim">Sim</SelectItem>
                                                <SelectItem value="nao">Não</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button variant="destructive" size="sm" onClick={() => removeArea(index)} className="col-span-1">
                                            Remover
                                        </Button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-center">Nenhuma área cadastrada</p>
                            )}
                        </div>

                        <Button variant="secondary" onClick={adicionarNovaArea}>Adicionar área</Button>

                        <hr />

                        <Button onClick={handleSubmitPesquisador}>
                            <Check size={16} /> Atualizar dados
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
