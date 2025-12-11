import { Trash, X } from "lucide-react";
import { useFiltersContext } from "../../../../context/filter-context";
import { Badge } from "../../../ui/badge";
import { Separator } from "../../../ui/separator";

export function FiltersBadge() {
    
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

    return(
          <div className={`flex flex-col gap-4 w-full ${
          (selectedAreas?.length || 0) > 0 ||
          (selectedCities?.length || 0) > 0 ||
          (selectedDepartaments?.length || 0) > 0 ||
          (selectedGraduatePrograms?.length || 0) > 0 ||
          (selectedGraduations?.length || 0) > 0 ||
          (selectedSubsidies?.length || 0) > 0 ||
          (selectedUniversities?.length || 0) > 0
            ? 'flex'
            : 'hidden'
        }`}>
        
      
                  <div className="flex flex-wrap gap-3 items-center">
                    <p className="text-sm font-medium">Filtros aplicados:</p>
                    {Array.isArray(selectedAreas) && selectedAreas.map((item) => (
                       <Badge  className={` gap-2 items-center flex font-normal  rounded-md  dark:text-white py-2 px-3 ${
                        item.includes("CIENCIAS AGRARIAS")
                          ? "bg-red-400"
                          : item.includes("CIENCIAS EXATAS E DA TERRA")
                          ? "bg-green-400"
                          : item.includes("CIENCIAS DA SAUDE")
                          ? "bg-[#20BDBE]"
                          : item.includes("CIENCIAS HUMANAS")
                          ? "bg-[#F5831F]"
                          : item.includes("CIENCIAS BIOLOGICAS")
                          ? "bg-[#EB008B]"
                          : item.includes("ENGENHARIAS")
                          ? "bg-[#FCB712]"
                          : item.includes("CIENCIAS SOCIAIS APLICADAS")
                          ? "bg-[#009245]"
                          : item.includes("LINGUISTICA LETRAS E ARTES")
                          ? "bg-[#A67C52]"
                          : item.includes("OUTROS")
                          ? "bg-[#1B1464]"
                          : "bg-[#000]"
                      }`}>{item}
                       <div   onClick={() => setSelectedAreas(selectedAreas.filter(area => area !== item))} className="cursor-pointer"><X size={16}/></div>
                       </Badge>
                    ))}
        
        {Array.isArray(selectedGraduations) &&  selectedGraduations.map((item) => (
          <Badge
            key={item}
           className="bg-eng-blue gap-2 items-center flex font-normal  rounded-md dark:bg-eng-blue  dark:text-white py-2 px-3 "
          >
            {item}
            <div
              className="cursor-pointer"
              onClick={() => setSelectedGraduations(selectedGraduations.filter(i => i !== item))}
            >
              <X size={16} />
            </div>
          </Badge>
        ))}
        
        {Array.isArray(selectedCities) &&  selectedCities.map((item) => (
          <Badge
            key={item}
            className="bg-eng-blue gap-2 items-center flex font-normal  rounded-md dark:bg-eng-blue  dark:text-white py-2 px-3"
          >
            {item}
            <div
              className="cursor-pointer"
              onClick={() => setSelectedCities(selectedCities.filter(i => i !== item))}
            >
              <X size={16} />
            </div>
          </Badge>
        ))}
        
        {Array.isArray(selectedDepartaments) &&  selectedDepartaments.map((item) => (
          <Badge
            key={item}
            className="bg-eng-blue gap-2 items-center flex font-normal  rounded-md dark:bg-eng-blue  dark:text-white py-2 px-3"
          >
            {item}
            <div
              className="cursor-pointer"
              onClick={() => setSelectedDepartaments(selectedDepartaments.filter(i => i !== item))}
            >
              <X size={16} />
            </div>
          </Badge>
        ))}
        
        {Array.isArray(selectedGraduatePrograms) &&  selectedGraduatePrograms.map((item) => (
          <Badge
            key={item}
            className="bg-eng-blue gap-2 items-center flex font-normal  rounded-md dark:bg-eng-blue  dark:text-white py-2 px-3"
          >
            {item}
            <div
              className="cursor-pointer"
              onClick={() => setSelectedGraduatePrograms(selectedGraduatePrograms.filter(i => i !== item))}
            >
              <X size={16} />
            </div>
          </Badge>
        ))}
        
        {Array.isArray(selectedSubsidies) &&  selectedSubsidies.map((item) => (
          <Badge
            key={item}
            className="bg-eng-blue gap-2 items-center flex font-normal  rounded-md dark:bg-eng-blue  dark:text-white py-2 px-3"
          >
            {item}
            <div
              className="cursor-pointer"
              onClick={() => setSelectedSubsidies(selectedSubsidies.filter(i => i !== item))}
            >
              <X size={16} />
            </div>
          </Badge>
        ))}
        
        {Array.isArray(selectedUniversities) &&  selectedUniversities.map((item) => (
          <Badge
            key={item}
            className="bg-eng-blue gap-2 items-center flex font-normal  rounded-md dark:bg-eng-blue  dark:text-white py-2 px-3"
          >
            {item}
            <div
              className="cursor-pointer"
              onClick={() => setSelectedUniversities(selectedUniversities.filter(i => i !== item))}
            >
              <X size={16} />
            </div>
          </Badge>
        ))}
        
        
        
        <Badge variant={'secondary'} onClick={() => clearFilters()} className=" rounded-md cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-900 border-0  py-2 px-3 font-normal flex items-center justify-center gap-2"><Trash size={12}/>Limpar filtros</Badge>
                 
                  </div>
        </div>
    )
}