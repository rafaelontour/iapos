async function getDiscentesPorPrograma(idPrograma: string): Promise<any> {

    try {
        const url = `https://iapos-api.senaicimatec.com.br/adm/studentRest/query?graduate_program_id=${idPrograma}`;

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
        console.log("Discentes: ", dados)
        return dados;
    } catch (err) {
        console.log("Erro ao buscar discentes: ", err);
    }
}

async function getInfoPesquisadorPorId(id: string): Promise<string | undefined> {
    try {
        const url = `https://iapos-api.senaicimatec.com.br/adm/ResearcherRest/Query?researcher_id=${id}`;

        console.log("URL: ", url)
        const resposta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })

        if (!resposta.ok) {
            throw new Error("Erro ao buscar discentes!")
        }

        const dados = await resposta.json();

        return dados.name
    } catch (error) {
        console.log("Erro ao buscar informação do pesquisador: ", error);
    }
}

export {
    getDiscentesPorPrograma,
    getInfoPesquisadorPorId,
}