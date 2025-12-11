import { color } from "highcharts";
import { toast } from "sonner";

async function getTagsService() {
    try {
        const resposta = await fetch('https://iapos-api.senaicimatec.com.br/adm/tag/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resposta.ok) {
            return
        }

        const dados = resposta.json();

        return dados
    } catch (error) {

    }
}

async function salvarTagService(tag: any) {
    try {
        const resposta = await fetch('https://iapos-api.senaicimatec.com.br/adm/tag/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: tag.name,
                color_code: tag.color_code
            })
        })

        if (!resposta.ok) {
            return
        }

        return resposta.status
    } catch (error) {
        return
    }
}

async function atualizarTagService(id: string | undefined, tag: any) {

    try {
        const resposta = await fetch(`https://iapos-api.senaicimatec.com.br/adm/tag/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                name: tag.name,
                color_code: tag.color_code
            })
        })

        if (!resposta.ok) {
            return
        }

        return resposta.status
    } catch (error) {
        toast.error("Erro ao excluir a configuração!")
    }
}

async function excluirTagService(id: string) {
    try {
        const resposta = await fetch(`https://iapos-api.senaicimatec.com.br/adm/area/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resposta.ok) {
            return
        }

        return resposta.status
    } catch (error) {
        toast.error("Erro ao excluir a tag!")
    }
}

export {
    getTagsService,
    salvarTagService,
    atualizarTagService,
    excluirTagService
}