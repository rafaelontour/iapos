import { AlertCircle, View } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { Configuracao } from "./dados-pos-graduacao";
import { DialogClose } from "@radix-ui/react-dialog";
import { Button } from "../../ui/button";

export default function VisualizarConfiguracao(config: Configuracao) {
    return (
        <div className="flex flex-col gap-4">
            <p className="font-bold text-xl">Nome da configuração: <p className="mt-3 bg-eng-blue text-white px-4 py-2 rounded-md font-semibold ml-4">{config.config_name}</p></p>
            <p className="font-bold text-xl">Duração do projeto: <p className="mt-3 bg-eng-blue text-white px-4 py-2 rounded-md font-semibold ml-4">{config.duration_project_months} meses</p></p>
            <p className="font-bold text-xl">Duração da qualificação: <p className="mt-3 bg-eng-blue text-white px-4 py-2 rounded-md font-semibold ml-4">{config.duration_qualification_months} meses</p></p>
            <p className="font-bold text-xl">Duração da conclusão: <p className="mt-3 bg-eng-blue text-white px-4 py-2 rounded-md font-semibold ml-4">{config.duration_conclusion_months} meses</p></p>
        </div>
    )
}