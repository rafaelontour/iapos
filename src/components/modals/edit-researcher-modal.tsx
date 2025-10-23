import { Check, Pencil } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useContext, useState, useMemo } from "react"; // 1. Importar useMemo
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { toast } from "sonner";
import { UserContext } from "../../context/context";

// --- Interfaces ---

export interface Props {
    uniqueAreas: string[] // A prop está vindo como string[] (de JSONs)
    area: string | any
    focal_point: boolean
    institution_id: string
    lattes_id: string
    name: string
    researcher_id: string
    status: boolean
}

interface AreaEntry {
    area: string
    focal_point: boolean
}

interface FormState {
    name: string
    lattes_id: string
    status: boolean
    areas: AreaEntry[]
}

// --- Funções Auxiliares (Lógica Pura) ---

const parseAreas = (areaValue: string | any): AreaEntry[] => {
    if (!areaValue) return [];

    try {
        let dataToParse = areaValue;

        if (typeof areaValue === 'string') {
            const fixedJson = areaValue.replace(/'/g, '"');
            dataToParse = JSON.parse(fixedJson);
        }

        if (Array.isArray(dataToParse)) {
            return dataToParse.map(item => ({
                area: item.area_leader || "",
                focal_point: Boolean(item.focal_point)
            }));
        }

        return [];
    } catch (err) {
        console.error("Erro ao parsear áreas:", err);
        return [];
    }
};

const formatAreasForAPI = (areas: AreaEntry[]) => {
    return areas.map(a => ({
        area_leader: a.area,
        focal_point: a.focal_point
    }));
};

// --- Componente React ---

export function EditResearcherModal(initialProps: Props) {
    const { urlGeralAdm } = useContext(UserContext);

    // 2. Criar um array limpo de 'uniqueAreas'
    const parsedUniqueAreas = useMemo(() => {
        try {
            return initialProps.uniqueAreas
                .map(areaJsonString => {
                    // Parseia a string JSON (ex: '[{"area_leader": "Nome"}]')
                    const parsedArray = JSON.parse(areaJsonString);
                    // Pega o nome da area_leader do primeiro objeto do array
                    if (Array.isArray(parsedArray) && parsedArray.length > 0 && parsedArray[0].area_leader) {
                        return parsedArray[0].area_leader;
                    }
                    return null; // Retorna null se a estrutura for inesperada
                })
                .filter(Boolean) as string[]; // Filtra os nulos e garante o tipo string[]
        } catch (e) {
            console.error("Erro ao parsear uniqueAreas:", e, initialProps.uniqueAreas);
            return []; // Retorna um array vazio em caso de erro
        }
    }, [initialProps.uniqueAreas]);


    const [formData, setFormData] = useState<FormState>(() => ({
        name: initialProps.name,
        lattes_id: initialProps.lattes_id,
        status: initialProps.status,
        areas: parseAreas(initialProps.area),
    }));

    const handleFieldChange = (field: keyof FormState, value: string | boolean) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleAreaChange = (index: number, field: keyof AreaEntry, value: string | boolean) => {
        const newAreas = formData.areas.map((item, i) => {
            if (i !== index) return item;
            return { ...item, [field]: value };
        });
        setFormData(prev => ({ ...prev, areas: newAreas }));
    };

    const addNewArea = () => {
        setFormData(prev => ({
            ...prev,
            areas: [...prev.areas, { area: "", focal_point: false }]
        }));
    };

    const removeArea = (index: number) => {
        setFormData(prev => ({
            ...prev,
            areas: prev.areas.filter((_, i) => i !== index)
        }));
    };

    const handleSubmitPesquisador = async () => {
        try {
            const areasFormatted = formatAreasForAPI(formData.areas);

            const payload = {
                institution_id: initialProps.institution_id,
                researcher_id: initialProps.researcher_id,
                ...formData,
                area: JSON.stringify(areasFormatted),
                areas: undefined,
            };

            const urlProgram = urlGeralAdm + "/ResearcherRest/Update";

            const response = await fetch(urlProgram, {
                mode: "cors",
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify([payload])
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
            toast("Erro inesperado", {
                description: "Ocorreu um erro ao tentar enviar os dados.",
                action: { label: "Fechar", onClick: () => { } }
            });
        }
    };

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant={"outline"} className="h-8 w-8 p-0">
                    <Pencil size={8} className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" onClick={(event) => event.stopPropagation()}>
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
                                onChange={(e) => handleFieldChange("name", e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Lattes Id</Label>
                            <Input
                                value={formData.lattes_id}
                                onChange={(e) => handleFieldChange("lattes_id", e.target.value)}
                                className="col-span-2 h-8"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Áreas</Label>
                            {formData.areas.map((a, index) => {
                                // 3. Usar o array limpo 'parsedUniqueAreas' na lógica
                                const areaValue = a.area || "";
                                const selectValue = parsedUniqueAreas.includes(areaValue)
                                    ? areaValue
                                    : (areaValue === "" ? "" : "outra"); // Se for "" fica "", senão "outra"

                                return (
                                    <div key={index} className="grid grid-cols-3 items-center gap-2 border-t pt-2 mt-2">
                                        <Select
                                            value={selectValue} // Se value for "", o placeholder aparece
                                            onValueChange={(val) => {
                                                const newValue = (val === "outra") ? "" : val;
                                                handleAreaChange(index, "area", newValue);
                                            }}
                                        >
                                            <SelectTrigger className="h-8 col-span-3">
                                                <SelectValue placeholder="Selecione a área" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {/* 3. Usar o array limpo 'parsedUniqueAreas' para renderizar */}
                                                {parsedUniqueAreas.map((area) => (
                                                    <SelectItem key={area} value={area}>
                                                        {area}
                                                    </SelectItem>
                                                ))}
                                                <SelectItem value="outra">Outra...</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        {/* 3. A condição de exibição do Input agora é 'selectValue === "outra"' */}
                                        {selectValue === "outra" && (
                                            <Input
                                                placeholder="Digite a área"
                                                value={areaValue}
                                                onChange={(e) => handleAreaChange(index, "area", e.target.value)}
                                                className="col-span-3 h-8"
                                            />
                                        )}

                                        <Select
                                            value={a.focal_point ? "sim" : "nao"}
                                            onValueChange={(val) => handleAreaChange(index, "focal_point", val === "sim")}
                                        >
                                            <SelectTrigger className="h-8 col-span-2">
                                                <SelectValue placeholder="Ponto focal?" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="sim">Sim</SelectItem>
                                                <SelectItem value="nao">Não</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => removeArea(index)}
                                            className="col-span-1"
                                        >
                                            Remover
                                        </Button>
                                    </div>
                                )
                            })}
                            <Button variant="secondary" onClick={addNewArea}>Adicionar área</Button>
                        </div>

                        <div className="grid grid-cols-3 items-center gap-4">
                            <Label>Status</Label>
                            <Select
                                value={formData.status ? "ativo" : "inativo"}
                                onValueChange={(val) => handleFieldChange("status", val === "ativo")}
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