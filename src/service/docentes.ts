async function getDocentesPorPrograma(idPrograma: string): Promise<any> {
    const url = `https://iapos-api.senaicimatec.com.br/adm/GraduateProgramResearcherRest/Query?graduate_program_id=${idPrograma}`;

    try {
        const resposta = await fetch(url, {
            mode: "cors",
            method: "GET",
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Content-Type",
                "Access-Control-Max-Age": "3600",
                "Content-Type": "text/plain",
            },
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar discentes!")
        }

        const dados = resposta.json();
        return dados;
    } catch (err) {
        console.log("Erro ao buscar doscentes: ", err);
    }
}

async function adicionarOrientacao(orientacao: any): Promise<any> {

    try {
        const url = `https://iapos-api.senaicimatec.com.br/adm/guidance_tracking/`

        const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orientacao)
        })

        return resposta

    } catch (error) {
        console.log("Não foi possivel adicionar o orientando!", error);
    }
}

async function atualizarOrientacao(orientacao: any): Promise<number | undefined> {

    try {
        const url = `https://iapos-api.senaicimatec.com.br/adm/guidance_tracking/${orientacao.id}/`

        const resposta = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(orientacao)
        })

        console.log("status: ", resposta.status);

        return resposta.status
    } catch (error) {
        console.log("Não foi possivel atualizar a orientação!", error);
    }
}

async function getOrientacoesPorDocente(idOrientador: string, idPrograma: string): Promise<any[] | undefined> {

    try {
        const url = `https://iapos-api.senaicimatec.com.br/adm/guidance_tracking/?supervisor_researcher_id=${idOrientador}&graduate_program_id=${idPrograma}`

        const resposta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })

        if (!resposta.ok) {
            throw new Error("Erro ao buscar orientacoes por docente!")
        }

        const dados = await resposta.json();
        return dados
    } catch (error) {
        console.log("Erro ao buscar orientacoes por docente: ", error);
    }
}

async function getImagemDocente(nome: string): Promise<string | undefined> {
    try {
        const url = `https://iapos-api.senaicimatec.com.br/adm/ResearcherData/Image?name=${nome}`

        const resposta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resposta.ok) {
            throw new Error("Erro ao buscar imagem do docente!")
        }

        const dados = await resposta.json();
        return dados
    } catch (error) {
        console.log("Erro ao buscar imagem do docente: ", error);
    }

}

async function excluirOrientacao(id: string): Promise<number | undefined> {
    try {
        const url = `https://iapos-api.senaicimatec.com.br/adm/guidance_tracking/${id}/`

        const resposta = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        return resposta.status
    } catch (error) {
        console.log("Erro ao excluir orientacao: ", error);
    }
}

export {
    getDocentesPorPrograma,
    adicionarOrientacao,
    getOrientacoesPorDocente,
    getImagemDocente,
    atualizarOrientacao,
    excluirOrientacao
}