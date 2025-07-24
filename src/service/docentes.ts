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

        console.log(orientacao)

        alert(resposta.status)

        /* const resposta = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "student_research_id": idOrientando,
                "supervisor_research_id": idOrientador,
                "co_supervisor_research_id": idCoorientador,
                "graduate_program_id": props.graduate_program_id,
                "start_date": dataEntrada,
                "planned_date_project": dataPrevisaoDefesa,
                "done_date_project": dataRealizadaDefesa,
                "planned_date_qualification": dataPrevisaoQualificacao,
                "done_date_qualification": dataRealizadaQualificacao,
                "planned_date_conclusion": dataPrevisaoDefesaFinal,
                "done_date_conclusion": dataRealizadaDefesaFinal
            })
        }) */

        return resposta

    } catch (error) {
        console.log("Não foi possivel adicionar o orientando!", error);
    }
}

export {
    getDocentesPorPrograma,
    adicionarOrientacao
}