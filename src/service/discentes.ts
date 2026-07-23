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

        const dados = await resposta.json();
        console.log("Discentes: ", dados)
        return dados;
    } catch (err) {
        console.log("Erro ao buscar discentes: ", err);
    }
}

async function getInfoPesquisadorPorId(id: string): Promise<string | undefined> {
    // 🛑 PROTEÇÃO: Não faz chamada se o ID for inválido ou a string "undefined"
    if (!id || id === "undefined" || id === "null") {
        console.warn("ID do pesquisador inválido recebido:", id);
        return undefined;
    }

    console.log("ID pesquisador: ", id);
    try {
        const url = `https://iapos-api.senaicimatec.com.br/adm/ResearcherRest/Query?researcher_id=${id}`;

        const resposta = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!resposta.ok) {
            throw new Error("Erro ao buscar dados do pesquisador!");
        }

        const dados = await resposta.json();

        // Garante que só retorna o nome se dados e dados.name existirem
        return dados?.name || undefined;
    } catch (error) {
        console.log("Erro ao buscar informação do pesquisador: ", error);
        return undefined;
    }
}

export {
    getDiscentesPorPrograma,
    getInfoPesquisadorPorId,
}