async function getDoscentesPorPrograma(idPrograma: string): Promise<any> {
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

export {
    getDoscentesPorPrograma
}