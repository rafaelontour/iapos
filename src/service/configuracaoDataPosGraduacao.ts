import { toast } from "sonner";

async function getConfiguracoes() {

    try {
        const responsta = await fetch('https://iapos-api.senaicimatec.com.br/adm/guidance_config/', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!responsta.ok) {
            return
        }

        const dados = await responsta.json();

        return dados
    } catch (error) {
        return
    }
}

async function salvarConfiguracaoService(configuracao: any) {
    try {
        const resposta = await fetch('https://iapos-api.senaicimatec.com.br/adm/guidance_config/', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                config_name: configuracao.nome,
                duration_project_months: configuracao.duracaoProjeto,
                duration_qualification_months: configuracao.duracaoQualificacao,
                duration_conclusion_months: configuracao.duracaoConclusao
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

async function atualizarConfiguracaoService(id: string | undefined, configuracao: any) {

    try {
        const resposta = await fetch(`https://iapos-api.senaicimatec.com.br/adm/guidance_config/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                config_name: configuracao.nome,
                duration_project_months: configuracao.duracaoProjeto,
                duration_qualification_months: configuracao.duracaoQualificacao,
                duration_conclusion_months: configuracao.duracaoConclusao
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

async function excluirConfiguracaoService(id: string) {
    try {
        const resposta = await fetch(`https://iapos-api.senaicimatec.com.br/adm/guidance_config/${id}/`, {
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
        toast.error("Erro ao excluir a configuração!")
    }
}

export {
    getConfiguracoes,
    salvarConfiguracaoService,
    atualizarConfiguracaoService,
    excluirConfiguracaoService
}