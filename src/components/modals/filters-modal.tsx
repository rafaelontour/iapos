import { useContext, useEffect, useRef, useState } from "react";
import { useModalResult } from "../hooks/use-modal-result";
import { UserContext } from "../../context/context";

import { ChartBar, FadersHorizontal, ListNumbers, MagnifyingGlass, Rows, SquaresFour, UserList } from "phosphor-react";
import { Button } from "../ui/button";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion";
import { Skeleton } from "../ui/skeleton";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

import { useLocation, useNavigate } from "react-router-dom";
import { Alert } from "../ui/alert";

import { Hash, MapIcon, Sparkles, Trash, User, X } from "lucide-react";
import bg_popup from '../../../assets/bg_popup.png';
import bg_user from '../../assets/user.png';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { useModal } from "../hooks/use-modal-store";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group"

import { Label } from "../ui/label";

//mapa

import { Sheet, SheetContent } from "../ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { useFiltersContext } from "../../context/filter-context";


type CityData = {
  nome: string;
  latitude: number;
  longitude: number;
  pesquisadores: number;
  professores: string[];
  lattes_10_id: string;
};

export type Research = {
  among: number,
  status: boolean
  articles: number,

  book: number,
  book_chapters: number,
  id: string,
  name: string,
  university: string,
  lattes_id: string,
  area: string,
  lattes_10_id: string,
  abstract: string,
  city: string,
  orcid: string,
  image: string
  graduation: string,
  patent: string,
  software: string,
  brand: string,
  lattes_update: Date,
  h_index: string,
  relevance_score: string,
  works_count: string,
  cited_by_count: string,
  i10_index: string,
  scopus: string,
  openalex: string,
  subsidy: Bolsistas[]
  graduate_programs: GraduatePrograms[]
  departments: Departments[]
  ufmg: Ufmg
}

interface Ufmg {
  id: string;
  full_name: string;
  gender: string | null;
  status_code: string;
  work_regime: string;
  job_class: string;
  job_title: string;
  job_rank: string;
  job_reference_code: string;
  academic_degree: string;
  organization_entry_date: string; // formato ISO: "YYYY-MM-DD"
  last_promotion_date: string;
  employment_status_description: string;
  department_name: string;
  career_category: string;
  academic_unit: string;
  unit_code: string;
  function_code: string
  position_code: string 
  leadership_start_date: string 
  leadership_end_date: string 
  current_function_name: string 
  function_location: string 
  registration_number: string 
  ufmg_registration_number: string 
  semester_reference: string 
}


interface Departments {
  dep_des: string
  dep_email: string
  dep_nom: string
  dep_id: string
  dep_sigla: string
  dep_site: string
  dep_tel: string
  img_data: string
}

interface Bolsistas {
  aid_quantity: string
  call_title: string
  funding_program_name: string
  modality_code: string
  category_level_code: string
  institute_name: string
  modality_name: string
  scholarship_quantity: string
}

interface GraduatePrograms {
  graduate_program_id: string
  name: string
}

interface ResearchOpenAlex {
  display_name: string
  id: string
  orcid: string
  works_count: string
  works_api_url: string
  relevance_score: string
  cited_by_count: string
  summary_stats: SummaryStats
  ids: Ids
}

interface SummaryStats {
  h_index: string
  i10_index: string
}

interface Ids {
  scopus: string
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

interface Total {
  researcher_count:number
  orcid_count:number
  scopus_count:number
}


interface Filtros {
  area:string[]
  graduation:string[]
  city:string[]
  institution:string[]
  modality:string[]
  graduate_program:string[]
  departament:string[]
}


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



export function FiltersModal() {
  const isFirstRender = useRef(true);
const {urlGeral, searchType} = useContext(UserContext)
const [filtros, setFiltros] = useState<Filtros>();

const queryUrl = useQuery();

const terms = queryUrl.get('terms');
  let urlPublicacoesPorPesquisador = `${urlGeral}researcher_filter?terms=${terms}&type=${searchType.toUpperCase()}`;
  
  console.log(urlPublicacoesPorPesquisador)
    useEffect(() => {
      const fetchData = async () => {
  
        try {
          const response = await fetch(urlPublicacoesPorPesquisador, {
            mode: 'cors',
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'GET',
              'Access-Control-Allow-Headers': 'Content-Type',
              'Access-Control-Max-Age': '3600',
              'Content-Type': 'text/plain'
            }
          });
          const data = await response.json();
          if (data) {
            setFiltros(data)
          }
        } catch (err) {
          console.log(err);
        } finally {
  
        }
      };
      fetchData();
    }, [urlPublicacoesPorPesquisador]);

  const getArrayFromUrl = (key: string) => queryUrl.get(key)?.split(";") || [];

  
  const { onClose, isOpen, type: typeModal } = useModal();
  const isModalOpen = isOpen && typeModal === "filters";
 
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
  } = useFiltersContext();
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const navigate = useNavigate();

  const location = useLocation();

  const { simcc } = useContext(UserContext)

  const handleAreaToggle = (value: any) => {
    setSelectedAreas(value);
  };

  const handleGraduationToggle = (value: any) => {
    setSelectedGraduations(value);
  };

  const handleDepartamentToggle = (value: any) => {
    setSelectedDepartaments(value);
  };

  const handleCityToggle = (value: any) => {
    setSelectedCities(value);
  };

  const handleUniversityToggle = (value: any) => {
    setSelectedUniversities(value);
  };

  const handleSubsidyToggle = (value: any) => {
    setSelectedSubsidies(value);
  };

  const handleGraduateProgramToggle = (value: any) => {
    setSelectedGraduatePrograms(value);
  };

  const applyFilters = () => {
  
    onClose();
  };


  // Ensure unique values
  const uniqueAreas = filtros?.area || [];
  const uniqueGraduations = filtros?.graduation || [];
  const uniqueCities = filtros?.city || [];
  const uniqueUniversities = filtros?.institution || [];
  const uniqueSubsidies = filtros?.modality || [];
  const uniqueGraduatePrograms = filtros?.graduate_program || [];
  const uniqueDepartaments = filtros?.departament || [];
  

  const {version} = useContext(UserContext)


  ///////////q


   // Função para atualizar os filtros na URL
   const updateFilters = (category: string, values: string[]) => {
    if (Array.isArray(values) && values.length > 0 ) {
     
      queryUrl.set(category, values.join(";"));
  
    } else {
     queryUrl.delete(category)
    }
   
  };

 
  // Carrega os valores da URL ao iniciar a página


  const [search, setSearch] = useState('')
  const [search2, setSearch2] = useState('')

  const filteredTotal = Array.isArray(uniqueGraduatePrograms) ? uniqueGraduatePrograms.filter(item => {
    // Normaliza a string do item e da busca para comparação
    const normalizeString = (str: any) => str
      .normalize("NFD") // Decompõe os caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos
      .toLowerCase(); // Converte para minúsculas

    const searchString = normalizeString(item);
    const normalizedSearch = normalizeString(search);

    return searchString.includes(normalizedSearch);
  }) : [];

  const filteredTotal2 = Array.isArray(uniqueCities) ? uniqueCities.filter(item => {
    // Normaliza a string do item e da busca para comparação
    const normalizeString = (str: any) => str
      .normalize("NFD") // Decompõe os caracteres acentuados
      .replace(/[\u0300-\u036f]/g, "") // Remove os diacríticos
      .toLowerCase(); // Converte para minúsculas

    const searchString = normalizeString(item);
    const normalizedSearch = normalizeString(search2);

    return searchString.includes(normalizedSearch);
  }) : [];

  return (
    <Sheet open={isModalOpen} onOpenChange={onClose}>
      <SheetContent className={`p-0 dark:bg-neutral-900 dark:border-gray-600 min-w-[60vw]`}>
        <DialogHeader className="h-[50px] px-4 justify-center border-b dark:border-gray-600">

          <div className="flex items-center gap-3">

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button className="h-8 w-8" variant={'outline'} onClick={() => {
                    onClose()
                  }} size={'icon'}><X size={16} /></Button>
                </TooltipTrigger>
                <TooltipContent> Fechar</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

        </DialogHeader>

        <div className="relative flex">

          <div>
            <div className="hidden lg:block p-8 pr-0 h-full">
              <div style={{ backgroundImage: `url(${bg_user})` }} className=" h-full w-[270px]  bg-cover bg-no-repeat bg-left rounded-md bg-eng-blue p-8"></div>

            </div>

          </div>
          <ScrollArea className="relative whitespace-nowrap h-[calc(100vh-50px)] p-8 w-full ">
            <div>
              <p className="max-w-[750px] mb-2 text-lg font-light text-foreground">
                Pesquisadores
              </p>

              <h1 className="max-w-[500px] text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] mb-8 md:block">
                Filtros de pesquisa
              </h1>
            </div>

            <div className="w-full">
              {/* Área de especialidade */}
             

              <Accordion defaultValue="item-1" type="single" collapsible className="w-full">
  <AccordionItem value="item-1" className="w-full">
    <div className="flex items-center justify-between">
    <Label>Área de especialidade</Label>
    <div className="flex gap-2 items-center">
    {Array.isArray(selectedAreas) && selectedAreas.length > 0 && (
        <Button
        onClick={() => {
          setSelectedAreas([]) 
          applyFilters()}}
         className="" variant={'destructive'} size={'icon'}><Trash size={16}/></Button>
      )}
       <AccordionTrigger>
      
      </AccordionTrigger>
    </div>
    
    </div>
    <AccordionContent>
    <ToggleGroup
                  type="multiple"
                  variant={'outline'}
                  value={selectedAreas}
                  onValueChange={handleAreaToggle}
                  className="aspect-auto flex flex-wrap items-start justify-start gap-2"
                >
                {uniqueAreas
  .filter((area) => area.trim() !== "")
  .map((area) => (
    <ToggleGroupItem key={area} value={area} className="px-3 py-2 gap-2 flex">
     <Alert className={` w-4 rounded-md border-0 h-4 p-0 ${
                area.includes("CIENCIAS AGRARIAS")
                  ? "bg-red-400"
                  : area.includes("CIENCIAS EXATAS E DA TERRA")
                  ? "bg-green-400"
                  : area.includes("CIENCIAS DA SAUDE")
                  ? "bg-[#20BDBE]"
                  : area.includes("CIENCIAS HUMANAS")
                  ? "bg-[#F5831F]"
                  : area.includes("CIENCIAS BIOLOGICAS")
                  ? "bg-[#EB008B]"
                  : area.includes("ENGENHARIAS")
                  ? "bg-[#FCB712]"
                  : area.includes("CIENCIAS SOCIAIS APLICADAS")
                  ? "bg-[#009245]"
                  : area.includes("LINGUISTICA LETRAS E ARTES")
                  ? "bg-[#A67C52]"
                  : area.includes("OUTROS")
                  ? "bg-[#1B1464]"
                  : "bg-[#000]"
              }`} />   {area}
    </ToggleGroupItem>
  ))}
                </ToggleGroup>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-2">
    <div className="flex items-center justify-between">
    <Label>Formação acadêmica/ titulação</Label>
   
       <div className="flex gap-2 items-center">

       {Array.isArray(selectedGraduations) && selectedGraduations.length > 0 && (
        <Button
        onClick={() => setSelectedGraduations([])}
         className="" variant={'destructive'} size={'icon'}><Trash size={16}/></Button>
      )}
<AccordionTrigger>

</AccordionTrigger>
</div>
    </div>
    <AccordionContent>
    <ToggleGroup
                  type="multiple"
                  variant={'outline'}
                  value={selectedGraduations}
                  onValueChange={handleGraduationToggle}
                  className="aspect-auto flex flex-wrap items-start justify-start gap-2"
                >
                  {uniqueGraduations.map((graduation) => (
                    <ToggleGroupItem key={graduation} value={graduation} className="px-3 py-2">
                      {graduation}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
    </AccordionContent>
  </AccordionItem>

  <AccordionItem value="item-3">
    <div className="flex items-center justify-between">
    <Label>Cidade</Label>
   
      
      <div className="flex gap-2 items-center">

      {Array.isArray(selectedCities) && selectedCities.length > 0 && (
        <Button
        onClick={() => setSelectedCities([])}
         className="" variant={'destructive'} size={'icon'}><Trash size={16}/></Button>
      )}
<AccordionTrigger>

</AccordionTrigger>
</div>
    </div>
    <AccordionContent>
    <Alert className="h-12 p-2 mb-4 flex items-center justify-between  w-full ">
                <div className="flex items-center gap-2 w-full flex-1">
                  <MagnifyingGlass size={16} className=" whitespace-nowrap w-10" />
                  <Input onChange={(e) => setSearch2(e.target.value)} value={search2} type="text" className="border-0 w-full " />
                </div>

                <div className="w-fit">


                </div>
              </Alert>

    <ToggleGroup
                    type="multiple"
                    variant={'outline'}
                    value={selectedCities}
                    onValueChange={handleCityToggle}
                    className="aspect-auto flex flex-wrap items-start justify-start gap-2"
                  >
                    {filteredTotal2.map((city) => (
                      <ToggleGroupItem key={city} value={city} className="px-3 py-2">
                        {city}
                      </ToggleGroupItem>
                    ))}
                  </ToggleGroup>
    </AccordionContent>
  </AccordionItem>

 {!version && (
   <AccordionItem value="item-4">
   <div className="flex items-center justify-between">
   <Label>Universidade</Label>
    <div className="flex gap-2 items-center">
   
         {Array.isArray(selectedUniversities) && selectedUniversities.length > 0 && (
           <Button
           onClick={() => setSelectedUniversities([])}
            className="" variant={'destructive'} size={'icon'}><Trash size={16}/></Button>
         )}
       <AccordionTrigger>
         
         </AccordionTrigger>
       </div>
  
   </div>
   <AccordionContent>
   <ToggleGroup
                   type="multiple"
                   variant={'outline'}
                   value={selectedUniversities}
                   onValueChange={handleUniversityToggle}
                   className="aspect-auto flex flex-wrap items-start justify-start gap-2"
                 >
                   {uniqueUniversities.map((university) => (
                     <ToggleGroupItem key={university} value={university} className="px-3 py-2">
                       {university}
                     </ToggleGroupItem>
                   ))}
                 </ToggleGroup>
   </AccordionContent>
 </AccordionItem>

 )}

<AccordionItem value="item-5">
    <div className="flex items-center justify-between">
    <Label>Bolsa CNPq</Label>
  

<div className="flex gap-2 items-center">

{Array.isArray(selectedSubsidies) && selectedSubsidies.length > 0 && (
        <Button
        onClick={() => setSelectedSubsidies([])}
         className="" variant={'destructive'} size={'icon'}><Trash size={16}/></Button>
      )}
<AccordionTrigger>

</AccordionTrigger>
</div>
    </div>
    <AccordionContent>
    <ToggleGroup
                  type="multiple"
                  variant={'outline'}
                  value={selectedSubsidies}
                  onValueChange={handleSubsidyToggle}
                  className="aspect-auto flex flex-wrap items-start justify-start gap-2"
                >
                  {uniqueSubsidies.map((subsidy) => (
                    <ToggleGroupItem key={subsidy} value={subsidy} className="px-3 py-2">
                      {subsidy === 'pq' ? 'Produtividade em Pesquisa' : subsidy === 'dt' ? 'Desenvolvimento Tecnológico' : subsidy}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
    </AccordionContent>
  </AccordionItem>

  {version && (
  <AccordionItem value="item-6">
    <div className="flex items-center justify-between">
    <Label>Departamentos</Label>
    <div className="flex gap-2 items-center">

      {Array.isArray(selectedDepartaments) && selectedDepartaments.length > 0 && (
        <Button
        onClick={() => setSelectedDepartaments([])}
         className="" variant={'destructive'} size={'icon'}><Trash size={16}/></Button>
      )}
    <AccordionTrigger>
      
      </AccordionTrigger>
    </div>
    </div>
    <AccordionContent>
    <ToggleGroup
                type="multiple"
                variant={'outline'}
                value={selectedDepartaments}
                onValueChange={handleDepartamentToggle}
                className="aspect-auto flex flex-wrap items-start justify-start gap-2"
              >
                {uniqueDepartaments.map((program) => (
                  <ToggleGroupItem key={program} value={program} className="px-3 py-2 whitespace-normal">
                    {program}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
    </AccordionContent>
  </AccordionItem>
)}

{location.pathname != '/pos-graduacao' && (
  <AccordionItem value="item-7">
    <div className="flex items-center justify-between">
    <Label>Programas de Pós-graduação</Label>
    <div className="flex gap-2 items-center">

      {Array.isArray(selectedGraduatePrograms) && selectedGraduatePrograms.length > 0 && (
        <Button
        onClick={() => setSelectedGraduatePrograms([])}
         className="" variant={'destructive'} size={'icon'}><Trash size={16}/></Button>
      )}
    <AccordionTrigger>
      
      </AccordionTrigger>
    </div>
    </div>
    <AccordionContent>
    <Alert className="h-12 p-2 mb-4 flex items-center justify-between  w-full ">
                <div className="flex items-center gap-2 w-full flex-1">
                  <MagnifyingGlass size={16} className=" whitespace-nowrap w-10" />
                  <Input onChange={(e) => setSearch(e.target.value)} value={search} type="text" className="border-0 w-full " />
                </div>

                <div className="w-fit">


                </div>
              </Alert>

    <ToggleGroup
                  type="multiple"
                  variant={'outline'}
                  value={selectedGraduatePrograms}
                  onValueChange={handleGraduateProgramToggle}
                  className="aspect-auto flex flex-wrap items-start justify-start gap-2"
                >
                  {filteredTotal.map((program) => (
                    <ToggleGroupItem key={program} value={program} className="px-3 py-2 whitespace-normal">
                      {program}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
    </AccordionContent>
  </AccordionItem>
)}


</Accordion>

            </div>

            <DialogFooter className="py-4">
              <Button variant="ghost" onClick={clearFilters} className="gap-2">
                <Trash size={16} />
                Limpar Filtros
              </Button>

              <Button onClick={applyFilters} className="gap-2">
                <FadersHorizontal size={16} />
                Mostrar resultados
              </Button>
            </DialogFooter>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )}

