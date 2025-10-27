import { toast } from "sonner";

async function getAreaService() {
    try {
        const resposta = await fetch('https://iapos-api.senaicimatec.com.br/adm/area/', {
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

async function salvarAreaService(tag: any) {
    try {
        const resposta = await fetch('https://iapos-api.senaicimatec.com.br/adm/area/', {
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

async function atualizarAreaService(id: string | undefined, tag: any) {

    try {
        const resposta = await fetch(`https://iapos-api.senaicimatec.com.br/adm/area/`, {
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
        toast.error("Erro ao excluir a área!")
    }
}

async function excluirAreaService(id: string) {
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
        toast.error("Erro ao excluir a área!")
    }
}

export {
    getAreaService,
    salvarAreaService,
    atualizarAreaService,
    excluirAreaService
}