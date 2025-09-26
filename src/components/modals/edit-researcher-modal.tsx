import { Check, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useContext, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { UserContext } from "../../context/context";

export interface Props {
    area: string;
    focal_point: boolean;
    institution_id: string;
    lattes_id: string;
    name: string;
    researcher_id: string;
    status: boolean;
}

export function EditResearcherModal(initialProps: Props) {
    const [formData, setFormData] = useState(initialProps);
    const { urlGeralAdm } = useContext(UserContext);

    const handleChange = (field: keyof Props, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmitPesquisador = async () => {
        try {
            const data = [{ ...formData }];
            let urlProgram = urlGeralAdm + "/ResearcherRest/Update";

            try {
                const response = await fetch(urlProgram, {
                    mode: "cors",
                    method: "PUT",
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Access-Control-Allow-Methods": "PUT",
                        "Access-Control-Allow-Headers": "Content-Type",
                        "Access-Control-Max-Age": "3600",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    toast("Dados enviados com sucesso", {
                        description: "Pesquisador atualizado na instituição",
                        action: { label: "Fechar", onClick: () => { } }
                    });
                } else if (response.status === 400) {
                    toast("Pesquisador já existe", {
                        description: "Tente novamente",
                        action: { label: "Fechar", onClick: () => { } }
                    });
                } else {
                    toast("Erro ao enviar os dados ao servidor", {
                        description: "Tente novamente",
                        action: { label: "Fechar", onClick: () => { } }
                    });
                }
            } catch (err) {
                console.log(err);
            }
        } catch (error) {
            console.error("Erro ao processar a requisição:", error);
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className="h-8 w-8 p-0">
                    <Pencil size={8} className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-96"
                onClick={(event) => event.stopPropagation()}
            >
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Editar pesquisador</h4>
                        <p className="text-sm text-muted-foreground">{initialProps.name}</p>
                    </div>
                    <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Nome</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Lattes Id</Label>
                            <Input
                                value={formData.lattes_id}
                                onChange={(e) => handleChange("lattes_id", e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Instituição</Label>
                            <Input
                                value={formData.institution_id}
                                onChange={(e) => handleChange("institution_id", e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Área</Label>
                            <Input
                                value={formData.area}
                                onChange={(e) => handleChange("area", e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Ponto Focal</Label>
                            <Select
                                value={formData.focal_point ? "sim" : "nao"}
                                onValueChange={(val) => handleChange("focal_point", val === "sim")}
                            >
                                <SelectTrigger className="h-8 col-span-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sim">Sim</SelectItem>
                                    <SelectItem value="nao">Não</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Status</Label>
                            <Select
                                value={formData.status ? "ativo" : "inativo"}
                                onValueChange={(val) => handleChange("status", val === "ativo")}
                            >
                                <SelectTrigger className="h-8 col-span-2">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ativo">Ativo</SelectItem>
                                    <SelectItem value="inativo">Inativo</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button onClick={handleSubmitPesquisador}>
                            <Check size={16} /> Atualizar dados
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
