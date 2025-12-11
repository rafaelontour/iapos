import { useContext, useEffect, useState } from "react";
import { CloudWordItemResearcher } from "./cloud-word-item-researcher";
import { UserContext } from "../../../../context/context";
import { Research } from "../researchers-home";
import { Skeleton } from "../../../ui/skeleton";
import { useFiltersContext } from "../../../../context/filter-context";
import { useQuery } from "../../../dashboard/builder-page/tabelas/tabela-artigos";



export function CloudWordResearcherHome() {
     const [loading, setLoading] = useState(true);
      const { itemsSelecionados, urlGeral, searchType, simcc } = useContext(UserContext);
       const { version, pesquisadoresSelecionados, idGraduateProgram } = useContext(UserContext);
       const [researcher, setResearcher] = useState<Research[]>([]);

     let urlTermPesquisadores = '';
  const queryUrl = useQuery();

  const {
    setSelectedAreas,
    setSelectedGraduations,
    setSelectedCities,
    setSelectedDepartaments,
    setSelectedGraduatePrograms,
    setSelectedSubsidies,
    setSelectedUniversities,
    clearFilters,
    selectedAreas,
    selectedGraduations,
    selectedCities,
    selectedDepartaments,
    selectedGraduatePrograms,
    selectedSubsidies,
    selectedUniversities
  } = useFiltersContext(); // ✅ correto

  const terms = queryUrl.get('terms');
     
  const Page =  1
  const Length =  10

  function arrayToParam(arr?: string[]) {
    return (arr || []).join(';');
  }
  

  
  if (searchType === 'name') {
    urlTermPesquisadores = `${urlGeral}researcherName?name=${terms?.replace(/[;|()]/g, '')}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'article') {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${terms}&university=&type=ARTICLE&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'book') {
    urlTermPesquisadores = `${urlGeral}researcherBook?term=${terms}&university=&type=BOOK&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'area') {
    urlTermPesquisadores = `${urlGeral}researcherArea_specialty?area_specialty=${terms}&university=&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'speaker') {
    urlTermPesquisadores = `${urlGeral}researcherParticipationEvent?term=${terms}&university=&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'patent') {
    urlTermPesquisadores = `${urlGeral}researcherPatent?term=${terms}&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&university=&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  } else if (searchType === 'abstract') {
    urlTermPesquisadores = `${urlGeral}researcher?terms=${terms}&university=&type=ABSTRACT&graduate_program_id=${idGraduateProgram === '0' ? '' : idGraduateProgram}&lenght=${Length}&page=${Page}&area=${arrayToParam(selectedAreas)}&graduate_program=${arrayToParam(selectedGraduatePrograms)}&city=${arrayToParam(selectedCities)}&institution=${arrayToParam(selectedUniversities)}&modality=${arrayToParam(selectedSubsidies)}&graduation=${arrayToParam(selectedGraduations)}&departament=${arrayToParam(selectedDepartaments)}`;
  }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(urlTermPesquisadores, {
          mode: "cors",
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Max-Age": "3600",
            "Content-Type": "text/plain",
          },
        });
        const data = await response.json();
        if (data) {
          setResearcher(data);

          setLoading(false);


        }

      } catch (err) {
        console.error("Main data fetch error:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [urlTermPesquisadores]);
     
    return (
        <>
        {loading ? (
   <Skeleton className="w-full rounded-md h-[300px]" />
        ):(
            <div className="gap-2 flex-wrap flex w-full items-end">
            {researcher.slice(0, 10).map((item: any) => {
                const maxFontSize = 220;
                const minFontSize = 100;

                const distinctAmongValues = [...new Set(researcher.map((item: any) => item.among))];
                const distinctAmongCount = distinctAmongValues.length;
                const fontSize =
                    maxFontSize -
                    ((maxFontSize - minFontSize) / (distinctAmongCount )) *
                    distinctAmongValues.indexOf(item.among) ;

                return (
                    <CloudWordItemResearcher
                        key={item.id}
                        name={item.name}
                        id={item.id}
                        frequency={item.frequency}
                        among={item.among}
                        fontSize={fontSize}
                    />
                );
            })}
        </div>
        )}
      
       </>
    );
}
