import { Link, useLocation, useNavigate } from "react-router-dom";

import { Button } from "../ui/button";
import { Blocks, Building, ChevronLeft, Eye, Home, LayoutDashboard, LoaderCircle, Plus, Shapes, SquareArrowOutUpRight, TextSearch, Undo2, UserIcon } from "lucide-react";
import { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../../context/context";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";

import { Rows, SquaresFour } from "phosphor-react";
import { ResearchersBloco } from "../homepage/categorias/researchers-home/researchers-bloco";
import { Skeleton } from "../ui/skeleton";
import { TableReseracherhome } from "../homepage/categorias/researchers-home/table-reseracher-home";
import { Alert } from "../ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useModal } from "../hooks/use-modal-store";
import { Helmet } from "react-helmet";
import { ResearchItem } from "../homepage/categorias/researchers-home/researcher-item";
import { LogoConecteeWhite } from "../svg/LogoConecteeWhite";
import { LogoConectee } from "../svg/LogoConectee";
import { LogoIapos } from "../svg/LogoIapos";
import { LogoIaposWhite } from "../svg/LogoIaposWhite";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { Keepo } from "../dashboard/builder-page/builder-page";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList } from "../ui/tabs";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { LinhasPesquisaGrupo } from "./linhas-pesquisa-grupo";
import { HomepageGrupoPesquisa } from "./homepage-grupo-pesquisa";

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
}

export interface GrupoPesquisa {
  area: string,
  institution: string,
  first_leader: string,
  first_leader_id: string,
  second_leader: string,
  second_leader_id: string,
  name: string,
  id: string
}

type Research = {
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
  research_groups: ResearchGroups[]

  cargo: string
  clas: string
  classe: string
  rt: string
  situacao: string
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

interface ResearchGroups {
  area: string
  group_id: string
  name: string
}


interface LinhasPesquisa {
  area: string
  keywords: string
  line: string
  major_area: string
  objective: string
}



export function VisualizacaoGrupo() {
  const history = useNavigate();

  const [loading, setLoading] = useState(true);
  const queryUrl = useQuery();
  const type_search = queryUrl.get('group_id');
  const { urlGeral } = useContext(UserContext)

  const [graduatePrograms, setGraduatePrograms] = useState<GrupoPesquisa>();
  const [linhasPesquisa, setLinhasPesquisa] = useState<LinhasPesquisa[]>([]);

  const urlGraduateProgram = `${urlGeral}research_group?group_id=${type_search}`;

  console.log(urlGraduateProgram)

  useEffect(() => {
    const fetchData = async () => {
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
          setGraduatePrograms(data[0]);
          setLoading(false)
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [urlGraduateProgram]);


  //linhas pesquisa


  //
  


  const items = Array.from({ length: 2 }, (_, index) => (
    <Skeleton key={index} className="w-full rounded-md h-[170px]" />
  ));

  const qualisColor: { [key: string]: string } = {
    "ASTRONOMIA": "bg-red-200",
    "FÍSICA": "bg-blue-200",
    "GEOCIÊNCIAS": "bg-green-200",
    "MATEMÁTICA": "bg-yellow-200",
    "OCEANOGRAFIA": "bg-teal-200",
    "PROBABILIDADE E ESTATÍSTICA": "bg-purple-200",
    "QUÍMICA": "bg-orange-200",
    "AGRONOMIA": "bg-red-800",
    "CIÊNCIA E TECNOLOGIA DE ALIMENTOS": "bg-blue-800",
    "ENGENHARIA AGRÍCOLA": "bg-green-800",
    "MEDICINA VETERINÁRIA": "bg-yellow-800",
    "RECURSOS FLORESTAIS E ENGENHARIA FLORESTAL": "bg-teal-800",
    "RECURSOS PESQUEIROS E ENGENHARIA DE PESCA": "bg-purple-800",
    "ZOOTECNIA": "bg-orange-800",
    "BIOFÍSICA": "bg-red-600",
    "BIOLOGIA GERAL": "bg-blue-600",
    "BIOQUÍMICA": "bg-green-600",
    "BIOTECNOLOGIA": "bg-yellow-600",
    "BOTÂNICA": "bg-teal-600",
    "ECOLOGIA": "bg-purple-600",
    "FARMACOLOGIA": "bg-orange-600",
    "FISIOLOGIA": "bg-red-400",
    "GENÉTICA": "bg-blue-400",
    "IMUNOLOGIA": "bg-green-400",
    "MICROBIOLOGIA": "bg-yellow-400",
    "MORFOLOGIA": "bg-teal-400",
    "PARASITOLOGIA": "bg-purple-400",
    "ZOOLOGIA": "bg-orange-400",
    "EDUCAÇÃO FÍSICA": "bg-red-300",
    "ENFERMAGEM": "bg-blue-300",
    "FARMÁCIA": "bg-green-300",
    "FISIOTERAPIA E TERAPIA OCUPACIONAL": "bg-yellow-300",
    "FONOAUDIOLOGIA": "bg-teal-300",
    "MEDICINA": "bg-purple-300",
    "NUTRIÇÃO": "bg-orange-300",
    "ODONTOLOGIA": "bg-red-100",
    "SAÚDE COLETIVA": "bg-blue-100",
    "ANTROPOLOGIA": "bg-green-100",
    "ARQUEOLOGIA": "bg-yellow-100",
    "CIÊNCIA POLÍTICA": "bg-teal-100",
    "EDUCAÇÃO": "bg-purple-100",
    "FILOSOFIA": "bg-orange-100",
    "GEOGRAFIA": "bg-red-900",
    "HISTÓRIA": "bg-blue-900",
    "PSICOLOGIA": "bg-green-900",
    "SOCIOLOGIA": "bg-yellow-900",
    "TEOLOGIA": "bg-teal-900",
    "CIÊNCIA DA COMPUTAÇÃO": "bg-purple-900",
    "DESENHO INDUSTRIAL": "bg-orange-900",
    "ENGENHARIA AEROESPACIAL": "bg-red-500",
    "ENGENHARIA BIOMÉDICA": "bg-blue-500",
    "ENGENHARIA CIVIL": "bg-green-500",
    "ENGENHARIA DE ENERGIA": "bg-yellow-500",
    "ENGENHARIA DE MATERIAIS E METALÚRGICA": "bg-teal-500",
    "ENGENHARIA DE MINAS": "bg-purple-500",
    "ENGENHARIA DE PRODUÇÃO": "bg-orange-500",
    "ENGENHARIA DE TRANSPORTES": "bg-red-700",
    "ENGENHARIA ELÉTRICA": "bg-blue-700",
    "ENGENHARIA MECÂNICA": "bg-green-700",
    "ENGENHARIA NAVAL E OCEÂNICA": "bg-yellow-700",
    "ENGENHARIA NUCLEAR": "bg-teal-700",
    "ENGENHARIA QUÍMICA": "bg-purple-700",
    "ENGENHARIA SANITÁRIA": "bg-orange-700",
    "ARTES": "bg-red-50",
    "LETRAS": "bg-blue-50",
    "LINGÜÍSTICA": "bg-green-50",
    "BIOÉTICA": "bg-yellow-50",
    "CIÊNCIAS AMBIENTAIS": "bg-teal-50",
    "DEFESA": "bg-purple-50",
    "DIVULGAÇÃO CIENTÍFICA": "bg-orange-50",
    "MICROELETRÔNICA": "bg-red-700",
    "ROBÓTICA, MECATRÔNICA E AUTOMAÇÃO": "bg-blue-700",
    "SEGURANÇA CONTRA INCÊNDIO": "bg-green-700",
    "ADMINISTRAÇÃO": "bg-yellow-700",
    "ARQUITETURA E URBANISMO": "bg-teal-700",
    "CIÊNCIA DA INFORMAÇÃO": "bg-purple-700",
    "COMUNICAÇÃO": "bg-orange-700",
    "DEMOGRAFIA": "bg-red-100",
    "DIREITO": "bg-blue-100",
    "ECONOMIA": "bg-green-100",
    "ECONOMIA DOMÉSTICA": "bg-yellow-100",
    "MUSEOLOGIA": "bg-teal-100",
    "PLANEJAMENTO URBANO E REGIONAL": "bg-purple-100",
    "SERVIÇO SOCIAL": "bg-orange-100",
    "TURISMO": "bg-red-200",
  };

  const normalizeArea = (area: string): string => {
    return area

      .toUpperCase(); // Converte para maiúsculas
  };


  const [count, setCount] = useState(12)
  const { onOpen } = useModal()
  const { version } = useContext(UserContext)

  const siteTitle = graduatePrograms?.name
  ? `${graduatePrograms.name} | ${version ? "Conectee" : "Simcc"}`
  : `${version ? "Conectee" : "Simcc"} | ${version ? "Escola de Engenharia UFMG" : "SECTI-BA"}`;

const siteDescription = graduatePrograms?.name
  ? `${graduatePrograms.name} | Conectee`
  : `${version ? "Conectee" : "Simcc"} | ${version ? "Escola de Engenharia UFMG" : "SECTI-BA"}`;

  const tabs = [
    { id: "visao_geral", label: "Visão geral", icon: Home },
    { id: "linhas_pesquisa", label: "Linhas de pesquisa", icon: TextSearch },


  ];

  const tab = queryUrl.get('pagina');


  const [value, setValue] = useState(tab || tabs[0].id)

  const navigate = useNavigate();
  const updateFilters = (category: string, values: any) => {
    if (values  ) {
     
      queryUrl.set(category, values);
     
    } else {
     queryUrl.delete(category)
    }
   
  };


  useEffect(() => {
    console.log("typeResult mudou para:", value);
     updateFilters("pagina", value );

     navigate({
      pathname: location.pathname,
      search: queryUrl.toString(),
    })

  }, [value]);

        

  const [loadingMessage, setLoadingMessage] = useState("Estamos procurando todas as informações no nosso banco de dados, aguarde.");

  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
  
   
      setLoadingMessage("Estamos procurando todas as informações no nosso banco de dados, aguarde.");
  
      timeouts.push(setTimeout(() => {
        setLoadingMessage("Estamos quase lá, continue aguardando...");
      }, 5000));
  
      timeouts.push(setTimeout(() => {
        setLoadingMessage("Só mais um pouco...");
      }, 10000));
  
      timeouts.push(setTimeout(() => {
        setLoadingMessage("Está demorando mais que o normal... estamos tentando encontrar tudo.");
      }, 15000));
  
      timeouts.push(setTimeout(() => {
        setLoadingMessage("Estamos empenhados em achar todos os dados, aguarde só mais um pouco");
      }, 15000));
    
  
    return () => {
      // Limpa os timeouts ao desmontar ou quando isOpen mudar
      timeouts.forEach(clearTimeout);
    };
  }, []);




  /////////////
  const [keepoData, setKeepoData] = useState<Keepo>({
    app: {
      background_color: "",
      background_image:'',
      text_color: "",
      status:"publicar",
      card_color: "",
      card_text_color: "",
      button_color: "",
      button_text_color: "",
    },
    profile_info: {
      avatar: "",
      firstName: "",
      lastName: "",
      email: "",
      jobTitle: "",
      supporting: "",
      button_text: "",
      link: "",
    },
    content: [],
  });
  
  
    
              ////firebase
              const graduate_program_id = queryUrl.get('graduate_program_id');
              const group_id = queryUrl.get('group_id');
              const dep_id = queryUrl.get('dep_id');
  
              const documentId = graduate_program_id || group_id || dep_id;
  
              const db = getFirestore();
              const isDataLoaded = useRef(false); // Flag para evitar loop de salvamento
    
              // Carregar dados ao montar a página
              useEffect(() => {
                if (documentId) {
                  const fetchData = async () => {
                    const docRef = doc(db, "construtor-pagina", documentId);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                      const data = docSnap.data() as Partial<Keepo>;
              
                      setKeepoData({
                        app: {
                          background_color: data.app?.background_color || "",
                          background_image:data.app?.background_image || "",
                          text_color: data.app?.text_color || "",
                          card_color: data.app?.card_color || "",
                          card_text_color: data.app?.card_text_color || "",
                          button_color: data.app?.button_color || "",
                          button_text_color: data.app?.button_text_color || "",
                          status:data.app?.status || "",
                        },
                        profile_info: {
                          avatar: data.profile_info?.avatar || "",
                          firstName: data.profile_info?.firstName || "",
                          lastName: data.profile_info?.lastName || "",
                          email: data.profile_info?.email || "",
                          jobTitle: data.profile_info?.jobTitle || "",
                          supporting: data.profile_info?.supporting || "",
                          button_text: data.profile_info?.button_text || "",
                          link: data.profile_info?.link || "",
                        },
                        content: data.content || [],
                      });
              
                      isDataLoaded.current = true; // Marca que os dados foram carregados
                    }
                  };
                  fetchData();
                }
              }, [documentId]);

              const { theme } = useTheme() 
              

              const handleVoltar = () => {

                const currentPath = location.pathname;
                const hasQueryParams = location.search.length > 0;
                
                if (hasQueryParams) {
                  // Se tem query parameters, remove apenas eles
                  navigate(currentPath);
                } else {
                  // Se não tem query parameters, remove o último segmento do path
                  const pathSegments = currentPath.split('/').filter(segment => segment !== '');
                  
                  if (pathSegments.length > 1) {
                    pathSegments.pop();
                    const previousPath = '/' + pathSegments.join('/');
                    navigate(previousPath);
                  } else {
                    // Se estiver na raiz ou com apenas um segmento, vai para raiz
                    navigate('/');
                  }
                }
              };

if (loading) {
return (
  <div className="flex justify-center items-center h-full">
  <div className="w-full flex flex-col items-center justify-center h-full">
    <div className="text-eng-blue mb-4 animate-pulse">
      <LoaderCircle size={108} className="animate-spin" />
    </div>
    <p className="font-medium text-lg max-w-[500px] text-center">
      {loadingMessage}
    </p>
  </div>
</div>
);
}

if (!graduatePrograms) {
return (
  <div
    className="h-full bg-cover bg-center flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-900"
    
  >
     {version ? (
                     <Link to="/" className="absolute top-16">
                     {theme === "dark" ? <LogoConecteeWhite /> : <LogoConectee />}
                   </Link>
                 ):(
                     <Link to="/" className="absolute top-16">
                     {theme === "dark" ? <LogoIaposWhite /> : <LogoIapos />}
                   </Link>
                 )}

    <div className="w-full flex flex-col items-center justify-center">
    <p className="text-9xl text-[#719CB8] font-bold mb-16 animate-pulse">
        (⊙_⊙)
      </p>
      <h1 className="text-center text-2xl md:text-4xl text-neutral-400 font-medium leading-tight tracking-tighter lg:leading-[1.1] ">
        Não foi possível acessar as <br/>  informações deste grupo.
      </h1>
     

      <div className="flex gap-3 mt-8">
              <Button  onClick={handleVoltar} variant={'ghost'}><Undo2 size={16}/> Voltar</Button>
               <Link to={'/'}> <Button><Home size={16}/> Página Inicial</Button></Link>

              </div>
    </div>
  </div>
);
}

  return (
   <>
     <Helmet>
       <title>{siteTitle}</title>
       <meta name="description" content={siteDescription} />
       <meta name="robots" content="index, follow" />
     </Helmet>

      <main className="grid grid-cols-1 ">
       <Tabs defaultValue={tabs[0].id} value={value} className="">
     <div className="md:p-8 p-4 pb-0">
     <div    style={{ backgroundImage: `url(${keepoData.app.background_image})` }} className="bg-eng-blue bg-no-repeat bg-center bg-cover border dark:border-neutral-800 w-full rounded-md h-[300px]">
     <div className={`w-full h-full rounded-md ${!(keepoData.app.background_image == "") && ('bg-black/25 ')}  pb-0 md:pb-0 p-4 md:p-8 flex-col flex justify-between `}>
       <div
                       className="
                         flex flex-col items-center gap-4 justify-between
     
                         md:flex-row
                       "
                     >
                       <div className="flex gap-2">
                         <Button onClick={handleVoltar} variant="outline" size="icon" className="h-7 w-7 text-eng-blue hover:text-eng-blue">
                           <ChevronLeft className="h-4 w-4" />
                           <span className="sr-only">Voltar</span>
                         </Button>
                         <div
                           className="
                             flex flex-col gap-2
     
                             md:flex-col
     
                             lg:flex-row
                           "
                         >
                           <h1 className="flex-1 shrink-0 text-white whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
             Grupo de pesquisa
             
           </h1>
                         </div>
                       </div>
     
                       <div
                         className="
                           flex items-center gap-2 flex-wrap
                         "
                       >
          
         <Link to={`/dashboard/programa?graduate_program_id=${type_search}`} target="_blank">
         <Button  className="h-8 text-eng-blue hover:text-eng-blue" size={'sm'} variant={'outline'}><LayoutDashboard size={16} />Painel administrativo</Button>
         </Link>
                       </div>
                     </div>
       
       <div className="flex justify-end items-end flex-1 w-full ">
       <div className="flex justify-between w-full gap-8">
     
      <div className="absolute">
       {keepoData.profile_info.avatar ? (
                 <Alert
                   className="aspect-square  bg-no-repeat bg-center bg-contain -top-12 xl:top-0 rounded-lg h-24 bg-white dark:bg-neutral-900"
                   style={{ backgroundImage: `url(${keepoData.profile_info.avatar})` }}
                 ></Alert>
       ):(
         <Avatar className=" rounded-lg  h-24 w-24 relative -top-12 xl:top-0">
         <AvatarImage className={'rounded-md h-24 w-24'} src={``} />
         <AvatarFallback className="flex items-center justify-center"><Blocks size={24} /></AvatarFallback>
       </Avatar>
       )}
     
      </div>
     <div className="  w-24 min-w-24">
     
     </div>
     
       <div className="relative  grid-cols-1 hidden xl:grid">
     <ScrollArea className="relative overflow-x-auto">
     <TabsList className="p-0 justify-start flex gap-2 h-auto bg-transparent dark:bg-transparent">
     {tabs.map(
     ({ id, label, icon: Icon }) =>
      
         <div
           key={id}
           className={`pb-2 border-b-2 text-black dark:text-white transition-all ${
             value === id ? "border-b-white dark:border-b-neutral-800" : "border-b-transparent"
           }`}
           onClick={() => setValue(id)}
         >
           <Button variant="ghost" className={`m-0 text-white hover:text-eng-blue dark:hover:text-eng-blue ${ value === id ? "bg-white dark:bg-neutral-800 text-eng-blue" : ""}`}>
             <Icon size={16} />
             {label}
           </Button>
         </div>
       
     )}
     </TabsList>
     <ScrollBar orientation="horizontal" />
     </ScrollArea>
     
     <div>
     
     </div>
     </div>
       </div>
       </div>
       </div>
       </div>
     </div>
      
      <div className="grid grid-cols-1 gap-4 md:gap-8  z-[2] pt-8 md:p-0">
     
                     <div className="flex justify-between  md:px-8 items-center ">
             <div className="flex flex-col  gap-6 mt-8 px-8">
             
     
               <div>
               <h1 className="text-2xl mb-2 max-w-[800px] font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1] md:block">
                   {graduatePrograms.name}
                 </h1>
     
              
     
                 <p className="max-w-[750px] text-lg font-light text-foreground">
                   <div className="flex flex-wrap gap-4 ">
                     <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Blocks size={12} />{graduatePrograms.area}</div>
     
                     {graduatePrograms.institution && (
                       <div className="text-sm text-gray-500 dark:text-gray-300 font-normal flex gap-1 items-center"><Building size={12} />{graduatePrograms.institution}</div>
                     )}
     
                   
     
                   </div>
                 </p>
     
               
                
               </div>
             </div>
           </div>
     
           <div className="xl:hidden">
           <div className="px-8 md:px-8 xl:hidden">
       <div className="relative grid grid-cols-1 xl:hidden">
         <ScrollArea className="relative w-full overflow-x-auto">
           <div className="flex w-full gap-2">
             <TabsList className="p-0 justify-start flex gap-2 h-auto bg-transparent dark:bg-transparent border pt-2 px-2 dark:bg-neutral-800 w-full">
               {tabs.map(({ id, label, icon: Icon }) => (
                 <div
                   key={id}
                   className={`pb-2 border-b-2 text-black dark:text-white transition-all ${
                     value === id ? "border-b-[#719CB8]" : "border-b-transparent"
                   }`}
                   onClick={() => setValue(id)}
                 >
                   <Button variant="ghost" className="m-0">
                     <Icon size={16} />
                     {label}
                   </Button>
                 </div>
               ))}
             </TabsList>
           </div>
           <ScrollBar orientation="horizontal" />
         </ScrollArea>
         <div></div>
       </div>
     </div>
     
           </div>
     
                   
                    
     
     <TabsContent value="visao_geral" className="m-0">
  <HomepageGrupoPesquisa program={graduatePrograms} keepoData={keepoData}/>
     </TabsContent>

     <TabsContent value="linhas_pesquisa" className="m-0">
     <LinhasPesquisaGrupo />
     </TabsContent>
     
   
                    
      </div>
      </Tabs>
       </main>
   </>
  )
}