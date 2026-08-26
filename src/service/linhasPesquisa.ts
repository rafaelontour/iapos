import { toast } from "sonner";

const BASE_URL = "https://iapos-api.senaicimatec.com.br/adm/linha-pesquisa/";

export interface LinhaPesquisa {
    id: string;
    name: string;
    graduate_program_id: string;
    created_at?: string;
}

async function getLinhasPesquisaService(graduate_program_id?: string): Promise<LinhaPesquisa[]> {
    try {
        const isParamValido = graduate_program_id && graduate_program_id !== "undefined" && graduate_program_id !== "null" && graduate_program_id.trim() !== "";
        const url = isParamValido
            ? `${BASE_URL}?graduate_program_id=${graduate_program_id}`
            : BASE_URL;

        const resposta = await fetch(url, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!resposta.ok) return [];

        const json = await resposta.json();
        return Array.isArray(json) ? json : [];
    } catch {
        return [];
    }
}

async function salvarLinhaPesquisaService(data: {
    name: string;
    graduate_program_id: string;
}): Promise<number | undefined> {
    try {
        const resposta = await fetch(BASE_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });

        if (!resposta.ok) return undefined;

        return resposta.status;
    } catch {
        return undefined;
    }
}

async function atualizarLinhaPesquisaService(
    id: string,
    data: { name: string }
): Promise<number | undefined> {
    try {
        const resposta = await fetch(BASE_URL, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, ...data }),
        });

        if (!resposta.ok) return undefined;

        return resposta.status;
    } catch {
        toast.error("Erro ao atualizar a linha de pesquisa!");
        return undefined;
    }
}

async function excluirLinhaPesquisaService(id: string): Promise<number | undefined> {
    try {
        const resposta = await fetch(`${BASE_URL.replace(/\/$/, "")}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        if (!resposta.ok) return undefined;

        return resposta.status;
    } catch {
        toast.error("Erro ao excluir a linha de pesquisa!");
        return undefined;
    }
}

export {
    getLinhasPesquisaService,
    salvarLinhaPesquisaService,
    atualizarLinhaPesquisaService,
    excluirLinhaPesquisaService,
};
