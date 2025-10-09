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
    uniqueAreas: string[]
    area: string
    focal_point: boolean
    institution_id: string
    lattes_id: string
    name: string
    researcher_id: string
    status: boolean
}

export function EditResearcherModal(initialProps: Props) {
    const parseAreas = (areaString: string) => {
        if (!areaString) return []
        return areaString.split(";").map(item => {
            const [areaPart, focalPart] = item.trim().split("|ponto focal:")
            if (!areaPart) return null
            return {
                area: areaPart.trim(),
                focal_point: focalPart?.trim() === "true"
            }
        }).filter(Boolean)
    }

    const stringifyAreas = (areasArray: { area: string; focal_point: boolean }[]) =>
        areasArray.map(a => `${a.area}|ponto focal: ${a.focal_point}`).join("; ")

    const [formData, setFormData] = useState({
        ...initialProps,
        areas: parseAreas(initialProps.area)
    })

    const { urlGeralAdm } = useContext(UserContext)

    const handleAreaChange = (index: number, field: "area" | "focal_point", value: any) => {
        const newAreas = [...formData.areas]
        newAreas[index] = { ...newAreas[index], [field]: value }
        setFormData(prev => ({ ...prev, areas: newAreas }))
    }

    const addNewArea = () => {
        setFormData(prev => ({
            ...prev,
            areas: [...prev.areas, { area: "", focal_point: false }]
        }))
    }

    const removeArea = (index: number) => {
        const newAreas = formData.areas.filter((_, i) => i !== index)
        setFormData(prev => ({ ...prev, areas: newAreas }))
    }

    const handleSubmitPesquisador = async () => {
        try {
            const areaString = stringifyAreas(formData.areas)
            const data = [{ ...formData, area: areaString }]
            const urlProgram = urlGeralAdm + "/ResearcherRest/Update"

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
            })

            if (response.ok) {
                toast("Dados enviados com sucesso", {
                    description: "Pesquisador atualizado na instituição",
                    action: { label: "Fechar", onClick: () => { } }
                })
            } else if (response.status === 400) {
                toast("Pesquisador já existe", {
                    description: "Tente novamente",
                    action: { label: "Fechar", onClick: () => { } }
                })
            } else {
                toast("Erro ao enviar os dados ao servidor", {
                    description: "Tente novamente",
                    action: { label: "Fechar", onClick: () => { } }
                })
            }
        } catch (err) {
            console.log(err)
        }
    }

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
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="col-span-2 h-8"
                            />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Lattes Id</Label>
                            <Input
                                value={formData.lattes_id}
                                onChange={(e) => setFormData(prev => ({ ...prev, lattes_id: e.target.value }))}
                                className="col-span-2 h-8"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Áreas</Label>
                            {formData.areas.map((a, index) => (
                                <div key={index} className="grid grid-cols-3 items-center gap-2">
                                    <Select
                                        value={
                                            initialProps.uniqueAreas.includes(a.area)
                                                ? a.area
                                                : "outra"
                                        }
                                        onValueChange={(val) => {
                                            if (val === "outra") handleAreaChange(index, "area", "")
                                            else handleAreaChange(index, "area", val)
                                        }}
                                    >
                                        <SelectTrigger className="h-8 col-span-2">
                                            <SelectValue placeholder="Selecione a área" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {initialProps.uniqueAreas.map((area) => (
                                                <SelectItem key={area} value={area}>
                                                    {area}
                                                </SelectItem>
                                            ))}
                                            <SelectItem value="outra">Outra...</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {(!a.area || !initialProps.uniqueAreas.includes(a.area)) && (
                                        <Input
                                            placeholder="Digite a área"
                                            value={a.area}
                                            onChange={(e) => handleAreaChange(index, "area", e.target.value)}
                                            className="col-span-2 h-8"
                                        />
                                    )}

                                    <Select
                                        value={a.focal_point ? "sim" : "nao"}
                                        onValueChange={(val) => handleAreaChange(index, "focal_point", val === "sim")}
                                    >
                                        <SelectTrigger className="h-8">
                                            <SelectValue placeholder="Ponto focal?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="sim">Sim</SelectItem>
                                            <SelectItem value="nao">Não</SelectItem>
                                        </SelectContent>
                                    </Select>

                                    <Button variant="destructive" size="sm" onClick={() => removeArea(index)}>
                                        Remover
                                    </Button>
                                </div>
                            ))}
                            <Button variant="secondary" onClick={addNewArea}>Adicionar área</Button>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Status</Label>
                            <Select
                                value={formData.status ? "ativo" : "inativo"}
                                onValueChange={(val) => setFormData(prev => ({ ...prev, status: val === "ativo" }))}
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
    )
}
