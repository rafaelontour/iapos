// hooks/useFiltersContext.ts
import { createContext, useContext, useEffect, useState } from 'react';
import { useQuery } from '../components/dashboard/builder-page/tabelas/tabela-artigos';
import { useModal } from '../components/hooks/use-modal-store';
import { useNavigate } from 'react-router-dom';

type FiltersContextType = {
  selectedAreas: string[];
  selectedGraduations: string[];
  selectedCities: string[];
  selectedDepartaments: string[];
  selectedGraduatePrograms: string[];
  selectedSubsidies: string[];
  selectedUniversities: string[];
  setSelectedAreas: (v: string[]) => void;
  setSelectedGraduations: (v: string[]) => void;
  setSelectedCities: (v: string[]) => void;
  setSelectedDepartaments: (v: string[]) => void;
  setSelectedGraduatePrograms: (v: string[]) => void;
  setSelectedSubsidies: (v: string[]) => void;
  setSelectedUniversities: (v: string[]) => void;
  clearFilters: () => void;
};

const FiltersContext = createContext<FiltersContextType>({} as FiltersContextType);

export const FiltersProvider = ({ children }: { children: React.ReactNode }) => {
    const queryUrl = useQuery();
    const getArrayFromUrl = (key: string) => queryUrl.get(key)?.split(";") || [];
const {onClose} = useModal()
  
    const [selectedAreas, setSelectedAreas] = useState<string[]>(getArrayFromUrl("areas"));
    const [selectedGraduations, setSelectedGraduations] = useState<string[]>(getArrayFromUrl("graduations"));
    const [selectedCities, setSelectedCities] = useState<string[]>(getArrayFromUrl("cities"));
    const [selectedUniversities, setSelectedUniversities] = useState<string[]>(getArrayFromUrl("universities"));
    const [selectedSubsidies, setSelectedSubsidies] = useState<string[]>(getArrayFromUrl("subsidy"));
    const [selectedGraduatePrograms, setSelectedGraduatePrograms] = useState<string[]>(getArrayFromUrl("graduatePrograms"));
    const [selectedDepartaments, setSelectedDepartaments] = useState<string[]>(getArrayFromUrl("departments"));

    
   // Função para atualizar os filtros na URL
   const updateFilters = (category: string, values: string[]) => {
    if (Array.isArray(values) && values.length > 0 ) {
     
      queryUrl.set(category, values.join(";"));
  
    } else {
     queryUrl.delete(category)
    }
   
  };

    const navigate = useNavigate();

   useEffect(() => {
      // Calculate filtered results count
  
        updateFilters("areas", selectedAreas );
      updateFilters("graduations", selectedGraduations);
      updateFilters("cities", selectedCities);
      updateFilters("universities", selectedUniversities);
      updateFilters("subsidy", selectedSubsidies);
      updateFilters("graduatePrograms", selectedGraduatePrograms);
      updateFilters("departments", selectedDepartaments);
  
  
      navigate({
        pathname: location.pathname,
        search: queryUrl.toString(),
      });
  
    }, [ selectedAreas, selectedGraduations, selectedCities, selectedUniversities, selectedSubsidies, selectedGraduatePrograms, selectedDepartaments]);
  

  const clearFilters = () => {
    setSelectedAreas([]);
    setSelectedGraduations([]);
    setSelectedCities([]);
    setSelectedDepartaments([]);
    setSelectedGraduatePrograms([]);
    setSelectedSubsidies([]);
    setSelectedUniversities([]);
    onClose()
  };

  return (
    <FiltersContext.Provider
      value={{
        selectedAreas,
        selectedGraduations,
        selectedCities,
        selectedDepartaments,
        selectedGraduatePrograms,
        selectedSubsidies,
        selectedUniversities,
        setSelectedAreas,
        setSelectedGraduations,
        setSelectedCities,
        setSelectedDepartaments,
        setSelectedGraduatePrograms,
        setSelectedSubsidies,
        setSelectedUniversities,
        clearFilters,
      }}
    >
      {children}
    </FiltersContext.Provider>
  );
};

export const useFiltersContext = () => useContext(FiltersContext);
