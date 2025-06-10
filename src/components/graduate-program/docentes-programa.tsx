import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/context";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { ResearchItem } from "../homepage/categorias/researchers-home/researcher-item";
import { Button } from "../ui/button";
import { Plus, User } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { Alert } from "../ui/alert";
import { CardContent, CardHeader, CardTitle } from "../ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { HeaderResultTypeHome } from "../homepage/categorias/header-result-type-home";
import { Rows, SquaresFour, UserList } from "phosphor-react";
import { ResearchersBloco } from "../homepage/categorias/researchers-home/researchers-bloco";
import { TableReseracherhome } from "../homepage/categorias/researchers-home/table-reseracher-home";

interface Pesquisador {
  among: number,
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
  ufmg: Ufmg
  h_index: string,
  relevance_score: string,
  works_count: string,
  cited_by_count: string,
  i10_index: string,
  scopus: string,
  openalex: string,
  departament: string
  subsidy: Bolsistas[]
  graduate_programs: GraduatePrograms[]
  departments: string
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



interface GraduateProgram {
  area: string;
  code: string;
  graduate_program_id: string;
  modality: string;
  name: string;
  rating: string;
  type: string;
  city: string
  state: string
  instituicao: string
  url_image: string
  region: string
  sigla: string
  latitude: string
  longitude: string
  visible: string
  qtd_discente: string
  qtd_colaborador: string
  qtd_permanente: string
  site: string
  acronym: string
  description?: string
}


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export function DocentesPrograma() {
  const { urlGeral } = useContext(UserContext)

  const [dados, setDados] = useState<GraduateProgram[]>([]);

  const queryUrl = useQuery();

  const type_search = queryUrl.get('graduate_program_id');

  const urlGraduateProgram2 = `${urlGeral}graduate_program_profnit?id=${type_search}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(urlGraduateProgram2, {
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
          setDados(data);
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlGraduateProgram2]);

  const [loading, setLoading] = useState(true);
  const Page = queryUrl.get('page') || '1';
  const Length = queryUrl.get('length') || '24';



  const urlGraduateProgram = `${urlGeral}researcherName?name=&graduate_program_id=${type_search}&lenght=${Length}&page=${Page}`

  console.log(urlGraduateProgram)

  const [graduatePrograms, setGraduatePrograms] = useState<Pesquisador[]>([]);
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(urlGraduateProgram, {
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
          setGraduatePrograms(data);
          setIsLoading(false)
          setLoading(false)
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlGraduateProgram]);


  const [count, setCount] = useState(12)


  const permanenteCount = dados.length > 0 ? dados[0].qtd_permanente : 0;
  const colaboradorCount = dados.length > 0 ? dados[0].qtd_colaborador : 0;

  const items = Array.from({ length: 12 }, (_, index) => (
    <Skeleton key={index} className="w-full rounded-md h-[300px]" />
  ));

  const [typeVisu, setTypeVisu] = useState('block');

  return (
    <div className="px-4 md:px-8">
      <div>


        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 ">
          <Alert className="p-0 mb-4 md:mb-8">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Docentes permenentes
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{permanenteCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                registrados
              </p>
            </CardContent>
          </Alert>

          <Alert className="p-0 mb-4 md:mb-8">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Docentes  colaboradores
              </CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{colaboradorCount || 0}</div>
              <p className="text-xs text-muted-foreground">
                registrados
              </p>
            </CardContent>
          </Alert>
        </div>
      </div>

      <div>
        <Accordion defaultValue="item-1" type="single" collapsible>
          <AccordionItem value="item-1">
            <div className="flex mb-2">
              <HeaderResultTypeHome title="Pesquisadores por detalhamento" icon={<UserList size={24} className="text-gray-400" />}>
                <div className="hidden md:flex gap-3 mr-3">
                  <Button onClick={() => setTypeVisu('rows')} variant={typeVisu === 'block' ? 'ghost' : 'outline'} size={'icon'}>
                    <Rows size={16} className="whitespace-nowrap" />
                  </Button>
                  <Button onClick={() => setTypeVisu('block')} variant={typeVisu === 'block' ? 'outline' : 'ghost'} size={'icon'}>
                    <SquaresFour size={16} className="whitespace-nowrap" />
                  </Button>
                </div>
              </HeaderResultTypeHome>
              <AccordionTrigger>

              </AccordionTrigger>
            </div>
            <AccordionContent>
              {typeVisu === 'block' ? (
                loading ? (
                  <ResponsiveMasonry
                    columnsCountBreakPoints={{
                      350: 2,
                      750: 3,
                      900: 4,
                      1200: 6,
                      1500: 6,
                      1700: 7
                    }}
                  >
                    <Masonry gutter="16px">
                      {items.map((item, index) => (
                        <div className="w-full" key={index}>{item}</div>
                      ))}
                    </Masonry>
                  </ResponsiveMasonry>
                ) : (
                  <ResearchersBloco researcher={graduatePrograms} />
                )
              ) : (
                loading ? (
                  <Skeleton className="w-full rounded-md h-[400px]" />
                ) : (
                  <TableReseracherhome researcher={graduatePrograms} />
                )
              )}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}